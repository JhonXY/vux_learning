import { removeStore, setStore, getStore } from '@/utils/storage.js'

const shop = {
  state: {
    shopId: '',
    shopInfo: {}
  },
  mutations: {
    // 设置当前缓存的shopid
    SET_SHOPID: (state, init) => {
      if (init) {
        state.shopId = init
        
      }
    },
    // 设置当前缓存的shop信息
    SET_SHOPINFO: (state, info) => {
      if (info) {
        state.shopInfo = info
      }
    }
  },
  actions: {
    setShopId: async ({ commit }, id) => {
      let init = getStore('userInfo')
      if (init) {
        await removeStore('shopId')
        await setStore('shopId', {
          shopId: id
        })
      } else {
        await setStore('shopId', {
          shopId: id
        })
      }
      commit('SET_SHOPID', id);
    },
    setShopInfo: ({ commit }, info) => {
      commit('SET_SHOPINFO', info);
    }
  }
}

export default shop;