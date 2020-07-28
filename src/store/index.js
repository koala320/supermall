import Vue from 'vue'
import Vuex from 'vuex'

//1、安装插件
Vue.use(Vuex)
//2、创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCart(state,payload) {
      //payload新添加的商品
      //数组常用的方法有哪些？ push/pop/unshift/shift/sort/reverse/map/filter/reduce/join
      // let oldProduct = null;
      // for (let item of state.cartList){
      //   if(item.iid === payload.idd){
      //     oldProduct = item;
      //   }
      // }
      //1、查找之前数组中是否有该商品
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)
      //2、判断oldProduct是否有值

      if(oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }
    }
  }
})
//3、挂载Vue实例上
export default store