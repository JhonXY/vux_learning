<template>
  <div class="shop_list">
    <header class="shop_header"> 
      <svg class="shop_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop">
          <svg viewBox="0 0 32 31" id="shop" width="100%" height="100%">
            <g fill-rule="evenodd">
              <path d="M28.232 1.822C27.905.728 26.97.152 25.759.152H5.588c-1.252 0-1.867.411-2.397 1.415l-.101.243-.443 1.434-.975 3.154-.002.007C.837 9.101.294 10.854.26 10.956l-.059.259c-.231 1.787.337 3.349 1.59 4.448 1.159 1.017 2.545 1.384 3.865 1.384.07 0 .07 0 .132-.002-.01.001-.01.001.061.002 1.32 0 2.706-.367 3.865-1.384a4.96 4.96 0 0 0 .413-.407l-1.043-.946-1.056.931c1.033 1.171 2.51 1.792 4.21 1.801.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384.148-.13.287-.267.418-.411l-1.044-.944-1.057.93c1.033 1.174 2.511 1.796 4.213 1.806.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384.15-.131.29-.27.422-.416l-1.046-.943-1.058.929c1.033 1.177 2.513 1.801 4.218 1.811.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384 1.206-1.058 1.858-2.812 1.676-4.426-.069-.61-.535-2.207-1.354-4.785l-.109-.342a327.554 327.554 0 0 0-1.295-3.966l-.122-.366.014.043h.004zm-2.684.85l.12.361.318.962c.329.999.658 2.011.965 2.973l.108.338c.719 2.262 1.203 3.92 1.24 4.249.08.711-.233 1.553-.735 1.993-.553.485-1.308.685-2.008.685l-.098-.002c-.987-.007-1.695-.306-2.177-.854l-1.044-1.189-1.06 1.175a2.192 2.192 0 0 1-.188.185c-.553.485-1.308.685-2.008.685l-.098-.002c-.985-.007-1.693-.305-2.174-.852l-1.043-1.185-1.059 1.171c-.058.064-.12.125-.186.183-.553.485-1.308.685-2.008.685l-.098-.002c-.984-.007-1.692-.304-2.173-.85L9.101 12.2l-1.058 1.166a2.248 2.248 0 0 1-.184.181c-.553.485-1.307.685-2.008.685l-.061-.001-.131.001c-.701 0-1.455-.2-2.008-.685-.538-.472-.767-1.102-.654-1.971l-1.396-.18 1.338.44c.043-.13.552-1.775 1.425-4.599l.002-.007.975-3.155.443-1.434-1.345-.415 1.245.658c.054-.102.042-.085-.083-.001-.122.082-.143.086-.009.086H25.763c.053 0-.164-.133-.225-.339l.014.043-.004-.001zM5.528 19.48c.778 0 1.408.63 1.408 1.408v7.424a1.408 1.408 0 1 1-2.816 0v-7.424c0-.778.63-1.408 1.408-1.408z"></path>
              <path d="M.28 29.72c0-.707.58-1.28 1.277-1.28h28.155a1.28 1.28 0 0 1 .007 2.56H1.561A1.278 1.278 0 0 1 .28 29.72z"></path>
              <path d="M26.008 19.48c.778 0 1.408.63 1.408 1.408v7.424a1.408 1.408 0 1 1-2.816 0v-7.424c0-.778.63-1.408 1.408-1.408z"></path>
            </g>
          </svg>
        </use>
      </svg>
      <span class="shop_header_title">
        附近的商家
      </span>
    </header>
    <ul>
      <!-- params的传值方式只能采用name进行跳转 -->
      <!-- 通过id来做url的标识 -->
      <router-link 
        :to="{
          name: 'agritainment', 
          params: item, 
          query: { shop: item.id }
        }" 
        tag="li" 
        v-for="(item,index) in finalList" 
        :key="index">
        <shop-item v-bind="item"></shop-item>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { getShopsList } from '@/apis/shop'
import { randomNum } from '@/utils/utils'
import ShopItem from './ShopItem'
export default {
  data() {
    return {
      // 等待初始化
      itemList: []
    }
  },
  mounted(){
    // 获取首页店家列表
    getShopsList().then(res => {
      this.itemList = res.data.data.data
    })
  },
  computed: {
    finalList(){
      let list = this.itemList
      // 月售量，人均消费，距离
      list.forEach((item) => {
        item.perFee = randomNum(35, 15)
        item.distance = randomNum(10, 10)
        item.monthlySales = randomNum(150, 50)
      })
      return list;
    }
  },
  components: {
    ShopItem
  }
}
</script>
<style lang="scss">
.shop_list {
  border-top: 0.025rem solid #e4e4e4;
  background-color: #fff;
  margin-top: .4rem;
  margin-bottom: 1.95rem;
  .shop_icon {
    fill: #999;
    margin-left: 0.6rem;
    vertical-align: middle;
    width: 0.6rem;
    height: 0.6rem;
  }
  .shop_header_title {
    color: #999;
    font: 0.55rem/1.6rem "Microsoft YaHei";
  }
  .shop_li {
    // width: 100%;
    display: flex;
    border-bottom: 0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;
    .shop_img {
      width: 2.7rem;
      height: 2.7rem;
      display: block;
      margin-right: 0.4rem;
      border: 0.05rem solid #e9e9e9;  
    }
    .shop_li_right {
      flex: auto;
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h4 {
          &::before {
            content: '\54C1\724C';
            display: inline-block;
            font-size: 0.5rem;
            line-height: .6rem;
            color: #333;
            background-color: #ffd930;
            padding: 0 0.1rem;
            border-radius: 0.1rem;
            margin-right: 0.2rem;
          }
          width: 8.5rem;
          color: #333;
          padding-top: .01rem;
          font: 0.65rem/0.65rem "PingFangSC-Regular";
          font-weight: 700;
        }
        ul {
          transform: scale(0.8);
          margin-right: -0.3rem;
          display: flex;
          justify-content: space-between;
          li {
            font-size: 0.5rem;
            color: #999;
            border: 0.025rem solid #f1f1f1;
            padding: 0 0.04rem;
            border-radius: 0.08rem;
            margin-left: 0.05rem;
          }
        }
      }
      .one {
        display: flex;
        justify-content: space-between;
        height: 0.6rem;
        margin-top: 0.52rem;
        p {
          transform: scale(0.9);
          font-size: 0.5rem;
          color: #666;
        }
        .one_right {
          display: flex;
          justify-content: space-between;
          line-height: 0.5rem;
          margin-right: -0.2rem;
          .one_right_l {
            padding: 0.04rem 0.08rem 0;
            border-radius: 0.08rem;
            box-sizing: border-box;
            background-color: #3190e8;
            border: 0.025rem solid #3190e8 ;
            font-size: 0.4rem;
            color: #fff;
          }
          .one_right_r {
            padding: 0.04rem 0.08rem 0;
            border-radius: 0.08rem;
            box-sizing: border-box;
            color: #3190e8;
            border: 0.025rem solid #3190e8 ;
            font-size: 0.4rem;
          }
        }
      }
      .two {
        display: flex;
        justify-content: space-between;
        height: 0.6rem;
        margin-top: 0.52rem;
        font-size: 0.5rem;
        color: #333;
        p {
          transform: scale(0.9);
          font-size: 0.5rem;
          color: #666;
          margin-right: -0.2rem;
        }
      }
    }
  }
}
.one_left {
  padding-left: .3rem
}
</style>
