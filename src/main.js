import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('@/utils/static')
  mockXHR()
}

Vue.config.productionTip = false

new Vue({
  el: '#bi-admin',
  router,
  store,
  render: (h) => h(App),
})
