import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Products from './views/Products.vue'
import CustomerOrders from './views/CustomerOrders.vue'
import Login from './views/Login.vue'
import Orders from './views/Orders.vue'
import CustomerCheckout from './views/CustomerCheckout.vue'
import Coupons from './views/Coupons.vue'
import Logout from './views/Logout.vue'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',  /*其他不存在的頁面 */
      redirect: 'Login',  //重新導向 login
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/admin.vue')
    },
    {
      path: '/admin/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/admin/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/admin/coupons',
      name: 'Coupons',
      component: Coupons
    },
    {
      path: '/customerorders',
      name: 'CustomerOrders',
      component: CustomerOrders
    },
    {
      path: '/customercheckout/:orderId',
      name: 'CustomerCheckout',
      component: CustomerCheckout
    },
  ]
})
