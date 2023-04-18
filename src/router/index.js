/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/Login'
import manage from '@/components/Manage'
import register from '@/components/Register'
import user from '@/components/User'
import orders from '@/components/Orders'

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
      path: '/manage',
      component: manage,
      meta: {
        title: 'manage'
      }
    },
    {
      path: '/register',
      component: register,
      meta: {
        title: 'Register'
      }
    },
    {
      path: '/user',
      component: user,
      meta: {
        title: 'User'
      }
    },
    {
      path: '/orders',
      component: orders,
      meta: {
        title: 'orders'
      }
    },
  ]
})