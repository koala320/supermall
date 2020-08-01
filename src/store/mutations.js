import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  //mutations的唯一目的是修改state中的状态
  //mutations中的每个方法尽可能做单一的事件，不要一个方法做两件事
  [ADD_COUNTER](state,payload) {
    payload.count++
  },
  [ADD_TO_CART](state,payload) {
    state.cartList.push(payload)
  }
}