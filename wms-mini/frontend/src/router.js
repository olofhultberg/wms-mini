import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn.vue'
import Dashboard from '@/components/Dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
