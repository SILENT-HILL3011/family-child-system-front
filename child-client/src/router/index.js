import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Layout from '../views/Layout.vue'
import UserInfo from '../views/user/UserInfo.vue'
import Growth from '../views/growth/Growth.vue'
import { ElMessage } from 'element-plus'
import ChildList from '../views/growth/ChildList.vue'
import VaccineQuery from '../views/growth/VaccineQuery.vue'
import VaccineTimeLine from '../views/growth/VaccineTimeLine.vue'
import SearchLive from '../views/growth/SearchLive.vue'
import SmartSchedule from '../views/schedule/SmartSchedule.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/register',
    component: RegisterView
  },
  {
    path: '/home',
    component: Layout  // 主页
  },
  {
    path: '/user',    // 用户管理 = 独立页面
    component: UserInfo
  },
  {
    path: '/family/member',
    name: 'FamilyMember',
    component: () => import('../views/family/FamilyMember.vue')
  },
  {
    path: '/growth',
    name: 'Growth',
    component: Growth
  },
  {
    path: '/child-list',
    name: 'ChildList',
    component: ChildList
  },
  {
    path: '/vaccine-query',
    name: 'VaccineQuery',
    component: VaccineQuery
  },
  {
    path: '/vaccine-timeline',
    name: 'VaccineTimeline',
    component: VaccineTimeLine
  },
  {
    path: '/search-live',
    name: 'SearchLive',
    component: SearchLive
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: SmartSchedule
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    if (token) next()
    else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  }
})

export default router