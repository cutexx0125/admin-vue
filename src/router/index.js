import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    name: '',
    component: () => import('../views/404.vue'),
    hidden: true
  },
  {
    path: '/',
    name: '导航一',
    component: () => import('../views/Home.vue'),
    iconCls: 'el-icon-message',
    children: [
      {
        path: '/main',
        name: '主页',
        component: () => import('../views/Main.vue'),
        hidden: true
      },
      {
        path: '/table',
        name:'Table',
        component: () => import('../views/nav1/mTable.vue')
      },
      {
        path: '/form',
        name: 'Form',
        component: () => import('../views/nav1/mForm.vue')
      },
      {
        path: '/user',
        name: '列表',
        component: () => import('../views/nav1/User.vue')
      }
    ]
  },
  {
    path: '/',
    name: '导航二',
    iconCls: 'fa fa-id-card-o',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/page4',
        name: '页面4',
        component: () => import('../views/nav2/Page4.vue')
      },
      {
        path: '/page5',
        name: '页面5',
        component: () => import('../views/nav2/Page5.vue')
      }
    ]
  },
  {
    path: '/',
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/page6',
        name: '导航三',
        component: () => import('../views/nav3/Page6.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'Charts',
    iconCls: 'fa fa-bar-chart',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/echarts',
        name:'echarts',
        component: () => import('../views/charts/Echarts.vue')
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
