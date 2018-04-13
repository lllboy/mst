// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'babel-polyfill'

import 'element-ui/lib/theme-chalk/index.css'
// import '../theme/index.css'
import './style/index.less'
import './style/nprogress.css'
import './style/reset.css'
import './assets/icon/iconfont.css'



Vue.use(ElementUI)
// 开启debug模式
Vue.config.debug = true;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
