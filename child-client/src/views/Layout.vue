<template>
  <div class="home-page">
    <!-- 左侧边栏：功能模块 -->
    <aside class="sidebar">
      <div class="sidebar-title">功能菜单</div>
      <div class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
        {{ item.name }}
      </div>
    </aside>

    <!-- 中间主内容区 -->
    <main class="main-content">
      <div class="top-bar">系统主页</div>
      <div class="content-area">
        <!-- 必须加这个，才能显示页面 -->
      </div>
    </main>

    <!-- 左下角：退出登录 -->
    <div class="bottom-left">
      <el-button type="primary" @click="handleLogout">退出登录</el-button>
    </div>

    <!-- 右下角：收件箱 -->
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

// 6个功能模块
const menuList = ref([
  { name: '用户管理', path: '/user' }, // 这里不要 /
  { name: '成长档案与监测', path: '/growth' },
  { name: '智能日程', path: '/schedule' },
  { name: '家庭协同与共享', path: '/family' },
  { name: '实用工具', path: '/util' },
  { name: '专家咨询', path: '/expert' }
])

// 点击菜单跳转
const handleMenuClick = (item) => {
  ElMessage.info(`切换到：${item.name}`)
  router.push(item.path)
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 收件箱
const handleInbox = () => {
  ElMessage.info('进入收件箱')
  router.push('/mail/box')
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
  overflow: hidden;
}

.bottom-left {
  position: fixed;
  left: 30px;
  bottom: 30px;
}

.bottom-right {
  position: fixed;
  right: 30px;
  bottom: 30px;
}
</style>