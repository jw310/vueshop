import Vue from 'vue'
//import vuex from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios' //  主要 AJAX 套件
import VueAxios from 'vue-axios'  // 將它轉為 Vue 的套件
import 'bootstrap'
import Loading from 'vue-loading-overlay' // 讀取效果套件
import 'vue-loading-overlay/dist/vue-loading.css'
// import './bus'
import currencyFilter from './filters/currency'
import timestampFilter from './filters/timestamp'
import VeeValidate from 'vee-validate'

//import zhTW from 'vee-validate/dist/locale/zh_tw'
//import VueI18n from 'vue-i18n'
import datePicker from 'vue-bootstrap-datetimepicker'

import store from './store'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'

Vue.config.productionTip = false

// init
Vue.use(VueAxios, axios)  //  加入此行才能執行 axios
//vuex.use(vuex);

axios.defaults.withCredentials = true //  前端 axios 請求附帶 Cookies 設定

Vue.component('Loading', Loading);  // 執行 效果套件


Vue.filter('currency', currencyFilter);
Vue.filter('timestamp', timestampFilter);

Vue.use(datePicker);


//Vue.use(VueI18n);

// const i18n = new VueI18n({
//   locale: 'zhTW'
// })

Vue.use(VeeValidate, {
  events: 'input|blur', //這是為了讓使用者離開該欄位時觸發驗證
  //i18n,
  // dictionary: {
  //   zhTW
  // }
})

new Vue({
  el: '#app',

  //i18n,
  router,

  store,

  // app.vue 掛載並 replace index.html 原始掛載點： <div id="app"></div>
  render: h => h(App)
}).$mount('#app')
