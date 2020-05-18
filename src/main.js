import Vue from 'vue'
import App from './App.vue'
import jsPlumb from 'jsplumb'

Vue.config.productionTip = false
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb

new Vue({
  render: h => h(App),
}).$mount('#app')
