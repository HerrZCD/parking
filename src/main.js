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
      parkingSpots: [],
    }
  },
  mutations: {
    changeName(state, name) {
      console.log(name);
      state.currentUser = name;
    },
    changeRole(state, role) {
      console.log(role);
      state.currentRole = role;
    },
    initParkingSpots(state, spots) {
      console.log(spots);
      state.parkingSpots = spots;
    }
  },
  actions: {
    nameActions({ commit }, username) {
      console.log(username);
      commit('changeName', username);
    },
    roleActions({ commit }, role) {
      console.log(role);
      commit('changeRole', role);
    },
    initSpotsActions({ commit }, spots) {
      console.log(spots);
      commit('initParkingSpots', spots);
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