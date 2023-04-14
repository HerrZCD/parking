/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import Vuex from 'vuex'
import { cp } from 'shelljs'


Vue.use(Vuex)

const store = new Vuex.Store({
  state () {
    return {
      currentUser: '',
      currentRole: '',
    }
  },
  mutations: {
    login (state, name, role) {
      state.currentUser = name;
      state.currentRole = role;
    }
  },
  actions: {
    loginActions({ commit }) {
      commit('login');
    }
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(store)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})