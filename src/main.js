import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

//设置全局组件在部分页面不显示
// router.beforeEach((to, from, next) => {
//
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   next()
// })