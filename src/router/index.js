/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/Login'
import register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login',
      component: login,
      meta: {
        title: 'login'
      }
    },
    {
      path: '/login',
      component: login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/register',
      component: register,
      meta: {
        title: 'Register'
      }
    }
  ]
})