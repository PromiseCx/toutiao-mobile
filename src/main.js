import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant'
import 'vant/lib/index.css'

import './styles/index.less'

import './utils/dayjs'

// 设置rem的基准值
import 'amfe-flexible'

Vue.use(Vant)
Vue.config.productionTip = false

// 封装中间件函数的插件
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      inserted (el) {
        /**
         * 指令所在的是van-search组件，
         *组件的根标签是div，input在内部
         */
        const theInput = el.querySelector('input')
        theInput.focus()
      }
    })
  }
}
// 执行目标对象的instal方法并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
