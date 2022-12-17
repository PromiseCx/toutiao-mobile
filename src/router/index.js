import Vue from 'vue'
import VueRouter from 'vue-router'
// import { getItem } from '@/utils/storage'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },

  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home', // 默认子路由，只能有一个
        name: 'home',
        component: () => import('@/views/home')
      },
      // {
      //   path: 'qa',
      //   name: 'qa',
      //   component: () => import('@/views/qa')
      // },
      // {
      //   path: 'video',
      //   name: 'video',
      //   component: () => import('@/views/video')
      // },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props传参，把路由参数映射到组件的props数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat')
  }
]

const router = new VueRouter({
  routes
})

// 路由的全局前置守卫,在路由发生真正跳转之前，执行此函数
// 此函数，可以决定路由是否真正的跳转
// router.beforeEach((to,from,next)=>{
//   if(getItem('TOUTIAO_USER').token.length>0 && to.path === '/login') {
//     next(false);
//   }else {
//     next();
//   }
// })

export default router
