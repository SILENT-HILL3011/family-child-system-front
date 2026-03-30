import { createRouter, createWebHistory } from 'vue-router'
import ExpertLogin from '../views/ExpertLogin.vue'
import ExpertRegister from '../views/ExpertRegister.vue'
import LayoutExpert from '../views/LayoutExpert.vue'
import { ElMessage } from 'element-plus'
import ExpertChatList from '../views/utils/ExpertChatList.vue'
import ExpertChat from '../views/utils/ExpertChat.vue'
import ToolsIndex from '../views/utils/ToolsIndex.vue'


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: ExpertLogin },
  { path: '/register', component: ExpertRegister },
  { path: '/home', component: LayoutExpert },
  {
    path: '/expert/chat-list',
    component: ExpertChatList
  },
  {
    path: '/expert/chat',
    name: 'ExpertChat',
    component: ExpertChat
  },
  {
    path: '/expert/tools',
    component: ToolsIndex,
    // redirect: '/expert/tools/allergy',
    
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

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