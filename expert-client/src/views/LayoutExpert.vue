<template>
  <div class="home-page">
    <aside class="sidebar">
      <div class="sidebar-title">功能菜单</div>
      <div class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
        {{ item.name }}
      </div>
    </aside>

    <main class="main-content">
      <div class="top-bar">专家系统主页</div>
      <div class="content-area">
        <div class="func-grid">
          <div class="func-card" @click="goModule('common')">
            <div class="func-img">
              <img src="../assets/common.jpg" alt="通用模块" />
            </div>
            <div class="func-info">
              <h3>通用模块</h3>
              <p>公告、咨询、消息、系统工具</p>
            </div>
          </div>

          <!-- 医生模块 - doctor.jpg -->
          <div class="func-card" @click="goModule('doctor')">
            <div class="func-img">
              <img src="../assets/doctor.jpg" alt="医生模块" />
            </div>
            <div class="func-info">
              <h3>医生模块</h3>
              <p>体检管理、报告填写、儿童健康</p>
            </div>
          </div>

          <!-- 教师模块 - teacher.jpg -->
          <div class="func-card" @click="goModule('teacher')">
            <div class="func-img">
              <img src="../assets/teacher.jpg" alt="教师模块" />
            </div>
            <div class="func-info">
              <h3>教师模块</h3>
              <p>成长评价、教育指导、档案管理</p>
            </div>
          </div>

          <!-- 厨师模块 - cook.jpg -->
          <div class="func-card" @click="goModule('cook')">
            <div class="func-img">
              <img src="../assets/cook.jpg" alt="厨师模块" />
            </div>
            <div class="func-info">
              <h3>厨师模块</h3>
              <p>膳食建议、营养指导、食谱管理</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部按钮 -->
    <div class="bottom-left">
      <el-button type="primary" @click="handleLogout">退出登录</el-button>
    </div>
    <div class="bottom-right">
      <el-button type="info" @click="handleInbox">收件箱</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const menuList = ref([
  { name: '专家信息管理', type: 'dialog' },
  { name: '体检发布', type: 'dialog' },
  { name: '实用工具', path: '/expert/tools' },
  { name: '用户咨询', path: '/expert/chat-list' }
])

const handleMenuClick = (item) => {
  ElMessage.info('功能开发中：' + item.name)
}

const goModule = (type) => {
  const map = {
    common: '/expert/common',
    doctor: '/expert/doctor',
    teacher: '/expert/teacher',
    cook: '/expert/cook'
  }
  ElMessage.success('进入：' + type + ' 模块')
  router.push(map[type])
}

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出')
  router.push('/login')
}

const handleInbox = () => {
  router.push('/expert/mail')
}
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
}

.sidebar {
  width: 220px;
  height: 100%;
  background: #f7f8fa;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
}

.sidebar-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.menu-item:hover {
  background: #e8f3ff;
  color: #409eff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 70px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 40px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.func-grid {
  width: 90%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 25px;
}

.func-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.func-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.func-img {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f7fa;
}

.func-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.func-card:hover .func-img img {
  transform: scale(1.05);
}

.func-info {
  padding: 18px 15px;
  text-align: center;
}

.func-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a3a69;
}

.func-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.bottom-left {
  position: fixed;
  left: 30px;
  bottom: 30px;
  z-index: 10;
}

.bottom-right {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 10;
}
</style>