<template>
  <div class="Agritain">
    <div>
    <head-top v-bind="head"></head-top>
    <div class="shop-swipe">
      <div class="shop-title">
        <div class="shop-title-l">{{moreDetails.name}}</div>
        <span class="shop-imgs">1/1</span>
      </div>
      <button class="vr">全景预览</button>
      <button class="hb">手气红包</button>
    </div>
    <ul class="shop-introduce">
      <li>
        <rating :rate="rate"></rating>
        <div class="right-con">
          <span class="right-content">评价</span>
        </div>
      </li>
      <li>
        <div class="shop-address">
          <div class="shop-address-fir">
            {{moreDetails.address.fir}}
          </div>
          <div class="shop-address-sec">
            <span>{{moreDetails.address.sec}}</span>
            <span> 距您999米</span>
          </div>
        </div>
        <div class="right-con">
          <router-link 
          :to="{
            path: '/agritainment/mapDirection',
            query: {
              name: moreDetails.name,
              tele: moreDetails.tele,
              sec: moreDetails.address.sec,
              fir: moreDetails.address.fir,
              coordinates: moreDetails.address.coordinates
            }
          }" 
          tag="span"
          class="right-content">地图</router-link>
        </div>
      </li>
      <li>
        <div class="more">
          电话: {{moreDetails.tele}}
        </div>
        <div class="right-con">
          <router-link 
          :to="{path: '/agritainment/more', query: {name: moreDetails.name}}" 
          tag="span" 
          class="right-content">详情</router-link>
        </div>
      </li>
    </ul>
    <div class="main-check" style="margin-top: .5rem;">
      <div class="main-check-bar">
        <div>
          <span class="check-live active">住店</span>
        </div>
        <div>
          <router-link 
          :to="{path: '/shopCar', query: {name: moreDetails.name, shopId: shopId}}" 
          tag="span" 
          class="check-live">点菜</router-link>
        </div>
      </div>
      <div v-if="roomList.length > 0" @click="showDatePicker" class="check-bar">
        <div class="live-in">
          <p>入住</p>
          <input v-model="beginTime" type="text" placeholder="入店日期" readonly>
        </div>
        <div class="how-long">共{{howLong}}晚</div>
        <div class="live-out">
          <p>离店</p>
          <input type="text" v-model="endTime" placeholder="离店日期" readonly>
        </div>
      </div>
      <ul class="room-list">
        <!-- 主要的住房信息与订单处理 -->
          <room-item
          @show="getRoomDetails"
          @order="initOrder"
          v-bind="item"
          :index="index"
          v-for="(item, index) in roomList" 
          :key="index">
          </room-item>
      </ul>
    </div>
    <div class="noData" v-if="roomList.length <= 0">暂无数据</div>
    <date-picker 
      v-show="showPicker" 
      @confirm="confirm" 
      @hideDatePicker="hideDatePicker" 
      @initDay="initDay">
    </date-picker>
    <room-details 
      @order="initOrder"
      ref="details" 
      :title="roomShowName" 
      :item="roomItem" 
      :index="detailIndex"
      v-show="showRoomDetails" 
      @hideRoomDetails="hideRoomDetails">
    </room-details>
    <shade-mask 
      ref="mask" 
      @closeMask="hideDialog">
    </shade-mask>
    </div>
  <transition name="router-slid" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
import HeadTop from '@/components/index/HeadTop.vue';
import Rating from '@/components/agritainment/Rating.vue';
import DatePicker from '@/components/agritainment/DatePicker.vue';
import RoomItem from '@/components/agritainment/RoomItem.vue';
import RoomDetails from '@/components/agritainment/RoomDetails.vue';
import ShadeMask from '@/components/layout/shadeMask.vue';
import { mapGetters } from 'vuex';
import { getHotels } from '@/apis/shop';
import { setStore, getStore } from '@/utils/storage.js'

export default {
  name: 'agritainment',
  data(){
    return {
      head:{
        goBack: true,
        title: '店铺详情'
      },
      // 需要接口
      moreDetails:{
        name: '农家乐农家乐',
        address:{
          fir: '荆州沙市区太岳路18号',
          sec: '万达商圈',
          coordinates: [116.397428, 39.90923]
        },
        tele: '18052664969',
        rate: 3.1
      },
      // 需要接口
      roomList:[],
      showPicker: false,  // 控制日期选择显示
      beginTime: '',  // 住店时间
      endTime: '',  // 离店时间
      howLong: '',  // 住多少天
      showRoomDetails: false,  // 控制房间详情的显示
      roomShowName: '', // 哪个房间需要显示详情
      canRecordInfo: false, // 是否可以获取记录
      roomItem: null,
      detailIndex: 0, 
      rate: 3.4
    }
  },
  // 路由钩子的回调触发在mounted之后
  beforeRouteEnter (to, from, next) {
  // 在导航完成前获取数据
    // 在前一个路由名为index时做店铺信息的共享操作
    if(from.name === 'index') {
      // 在该钩子中this还未创建，所以需要往next的回调中传参，该参会成为即将实例化的this
      // 此处的回调调用在dom的渲染之后
      // 所以对dom的操作（computed之类的）也会延后
      next(vm => {      
        vm.setCanRecord()
        // 标识来自首页
        vm.fromIndex = true
        // 如果能够获取到店铺信息，在vuex做存储
        vm.$store.dispatch('changeShopName', vm.$route.params.name)
        vm.$store.dispatch('setShopId', vm.$route.query.shop)
        vm.$store.dispatch('setShopInfo', vm.details)

        vm.getData(vm.$route.query.shop)
      });
    } else {
      next(vm => {
        vm.fromIndex = false
        let storage = getStore('shopId'), id
    
        storage 
          ? id = storage.shopId
          : id = vm.shopId 

        vm.getData(id)
      });
    }
  },
  mounted(){
  },
  computed: {
    // 路由中传递的店铺信息
    details(){
      if(this.canRecordInfo) {
        return this.$route.params;
      }
    },
    // 路由中传递的店铺id
    // shopId(){
    //   if(this.canRecordInfo) {
    //     return this.$route.query.shop;
    //   }
    // },
    ...mapGetters([
      'isLogined',
      'userInfo',
      'forOrder',
      'shopId'
    ]),
  },
  components: {
    HeadTop,
    Rating,
    DatePicker,
    RoomItem,
    RoomDetails,
    ShadeMask
  },
  methods: {
    getData(id){
      getHotels({
        shopId: id
      }).then(res => {
        this.roomList = res.data.data.data 
        this.moreDetails = {
          name: res.data.data.shop.name,
          address: {
            fir: res.data.data.shop.area,
            sec: '万达商圈',
            coordinates: [res.data.data.shop.longitude, res.data.data.shop.latitude]
          },
          tele: res.data.data.shop.tele,
          rate: res.data.data.shop.rate
        }
        this.rate = 4.4
        this.roomList.forEach(item => {
          item.imgsrc = 'http://dimg04.c-ctrip.com/images/220f0j000000b1bar536E_C_130_130_Q50.jpg?v=1'
        })
      })  
    },
    setCanRecord(){
      this.canRecordInfo = true
    },
    showDatePicker(){
      this.showPicker = true;
      this.$refs.mask.on = true;
    },
    hideDatePicker(){
      this.showPicker = false;
      this.$refs.mask.on = false;
    },
    confirm(startDate, endDate, howLong){
      this.beginTime = startDate;
      this.endTime = endDate;
      this.howLong = howLong;
      this.$store.dispatch('changeHowLong', howLong)
      this.$store.dispatch('changeCheckIn', startDate)
      this.$store.dispatch('changeCheckOut', endDate)
      this.showPicker = false;
      this.$refs.mask.on = false;
    },
    initDay(startDate, endDate, howLong){
      this.beginTime = startDate;
      this.endTime = endDate;
      this.howLong = howLong;
      this.$store.dispatch('changeHowLong', howLong)
      this.$store.dispatch('changeCheckIn', startDate)
      this.$store.dispatch('changeCheckOut', endDate)
    },
    // 获取当前信息详情
    getRoomDetails(index){
      this.roomShowName = this.roomList[index].name
      this.roomItem = this.roomList[index]
      this.detailIndex = index

      this.showRoomDetails = true;
      this.$refs.mask.on = true;

      // 触发弹窗需要触发动画，不能同步改变属性，需要先装载组件，再改变组件属性
      setTimeout(()=>{
        this.$refs.details.hide = false;
      }, 100)
    },
    // 订单初始化
    initOrder(index){
      this.$router.push({
        path: '/hostelorder', 
        query: { 
          hotelId: this.roomList[index].id,
          ...this.roomList[index]
        }
      })
    },
    // 隐藏床型具体信息弹层
    hideRoomDetails(){
      this.$refs.details.hide = true;
      setTimeout(()=>{
        this.showRoomDetails = false;
        this.$refs.mask.on = false;
      }, 300)
    },
    // 遮罩层综合
    hideDialog(){
      this.hideDatePicker()
      this.hideRoomDetails()
    }
  }
}
</script>

<style lang="scss" scoped>
.Agritain {
  display: flex;
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  position: absolute;
  right: 0;
  left: 0;
  height: 100%;
}
.shop-swipe {
  margin-top: 1.95rem;
  width: 100%;
  height: 10rem;
  background: #666;
  position: relative;
  overflow: hidden;
  background-image: url(../assets/images/welcome.gif);
  .vr {
    position: absolute;
    top: .5rem;
    right: .5rem;
    color: #fff;
    padding: 0 10px;
    border-radius: 15px;
    background: rgba(0,0,0,.4);
    line-height: 1rem;
    font-size: .5rem;
    border: 0 none;
    z-index: 100;
  }
  .hb {
    position: absolute;
    top: 2rem;
    right: .5rem;
    color: #fff;
    padding: 0 10px;
    border-radius: 15px;
    background: rgba(0,0,0,.4);
    line-height: 1rem;
    font-size: .5rem;
    border: 0 none;
    z-index: 100;
  }
  .shop-title {
    width: 100%;
    line-height: 1.25;
    color: #fff;
    pointer-events: none;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 1.5rem 3rem .55rem .75rem;
    box-sizing: border-box;
    background: -webkit-linear-gradient(top,transparent,rgba(0,0,0,.5));
    .shop-title-l {
      font-size: .8rem;
    }
    .shop-imgs {
      position: absolute;
      bottom: .5rem;
      right: 1rem;
      color: #fff;
      padding: 0 10px;
      border-radius: 15px;
      background-color: rgba(0,0,0,.3);
      line-height: 1rem;
      font-size: .3rem;
      border: 0 none;
      z-index: 100;
    }
  }
}
.shop-introduce {
  list-style: none;
  background: #fff;
  position: relative;
  border-bottom: 1px solid #e2e2e2;
  li {
    border-top: 1px solid #e2e2e2;
    padding: .5rem;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &::after{
      content: ' ';
      position: absolute;
      top: 50%;
      right: .5rem;
      width: .25rem;
      height: .25rem;
      border: 1px solid;
      border-bottom: 0;
      border-right: 0;
      margin-top: -.1rem;
      color: #ccc;
      -webkit-transform: rotateZ(-45deg);
      transform: rotateZ(135deg);
    }
    // &::before{
    //   content: "";
    //   position: absolute;
    //   font-size: 0;
    //   line-height: 0;
    //   top: 0;
    //   width: 150%;
    //   left: 0;
    //   height: 0;
    //   background: none;
    //   -webkit-transform-origin: 0 0;
    //   -ms-transform-origin: 0 0;
    //   transform-origin: 0 0;
    //   border-bottom: 1px solid #e2e2e2;
    //   pointer-events: none;
    // }
  }
  .right-content {
    font-size: .3rem;
    vertical-align: middle;
    color: #41a2fc;
  }
  .right-con {
    width: 15%;
    text-align: right;
    line-height: 100%;
  }
  .shop-address {
    color: #666;
    width: 80%;
  }
  .shop-address-fir {
    line-height: 1.5;
    font-size: .6rem;
  }
  .shop-address-sec {
    font-size: .3rem;
  }
  .more {
    width: 80%;
    font-size: .3rem;
    color: #666;
  }
}
.main-check-bar {
  background: #fff;
  display: flex;
  font-size: .7rem;
  line-height: 1.5rem;
  height: 1.5rem;
  justify-content: space-around;
  div {
     width: 50%;
     display: flex;
     justify-content: space-around;
  }
  span {
    color: #333;
  }
  span.active {
    border-bottom: 2px solid #FFD161;;
  }
}
.check-bar {
  border-top: 1px solid #e2e2e2;
  text-align: center;
  line-height: 1.2;
  height: 2.3rem;
  padding: 0 .5rem 0 .75rem;
  color: #b2b2b2;
  font-size: .6rem;
  background-color: #fff;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .live-in {
    width: 30%;
    input {
      margin-top: .3rem;
      width: 100%;
      text-align: center;
    }
  }
  .live-out {
    width: 30%;
    input {
      margin-top: .3rem;
      width: 100%;
      text-align: center;
    }
  }
  .how-long {
    display:inline;
    color: #2b2b2b;
    font-size: .3rem;
    border: 1px solid #e6e9eb;
    padding: .2rem .5rem .15rem;
    border-radius: 2rem;
    font-weight: 300;
  }
}
.room-list {
  list-style: none;
  background: #fff;
  position: relative;
  border-bottom: 1px solid #e2e2e2;
  li {
    border-top: 1px solid #e2e2e2;
    padding: .5rem;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
.noData {
  font-size: .8rem;
  padding: 2rem;
  color: #bdbdbd;
  text-align: center;
}
</style>

