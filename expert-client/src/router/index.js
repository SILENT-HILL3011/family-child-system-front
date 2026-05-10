import { createRouter, createWebHistory } from 'vue-router'
import ExpertLogin from '../views/ExpertLogin.vue'
import ExpertRegister from '../views/ExpertRegister.vue'
import LayoutExpert from '../views/LayoutExpert.vue'
import { ElMessage } from 'element-plus'
import ExpertChatList from '../views/utils/ExpertChatList.vue'
import ExpertChat from '../views/utils/ExpertChat.vue'
import ToolsIndex from '../views/utils/ToolsIndex.vue'
import Common from '../views/common/Common.vue'
import Doctor from '../views/doctor/Doctor.vue'
import MyExam from '../views/doctor/MyExam.vue'
import FillReport from '../views/doctor/FillReport.vue'
import DiseaseManager from '../views/doctor/DiseaseManager.vue'
import Teacher from '../views/teacher/Teacher.vue'
import Knowledge from '../views/teacher/Knowledge.vue'
import Chef from '../views/cook/Chef.vue'
import ChefDataManager from '../views/cook/ChefDataManager.vue'



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
  },
  {
    path: '/expert/common',
    component: Common
  },
  {
    path: '/expert/doctor',
    component: Doctor
  },
  {
    path: '/expert/teacher',
    component: Teacher
  },
  {
    path: '/expert/teacher/knowledge-manager',
    component: Knowledge
  },
  {
    path: '/expert/cook',
    component: Chef
  },
  {
    path: '/expert/chef/data-manager',
    component: ChefDataManager
  },
  {
    path: '/expert/doctor/my-exam',
    component: MyExam
  },
  {
    path: '/expert/doctor/fillReport',
    name: 'FillReport',
    component: FillReport
  },
  {
    path: '/expert/doctor/disease-manager',
    name: 'DiseaseManager',
    component: DiseaseManager
  },


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