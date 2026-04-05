<template>
  <div class="home-page">
    <!-- 左侧边栏：功能模块（完全保留原结构） -->
    <aside class="sidebar">
      <div class="sidebar-title">功能菜单</div>
      <div class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
        {{ item.name }}
      </div>
    </aside>

    <!-- 中间主内容区：2×3 功能卡片布局 -->
    <main class="main-content">
      <div class="top-bar">系统主页</div>
      <div class="content-area">
        <!-- 2行3列网格布局 -->
        <div class="func-grid">
          <div class="func-card" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
            <!-- 功能图片 -->
            <div class="func-img">
              <img :src="item.img" :alt="item.name" />
            </div>
            <!-- 功能名称+解释 -->
            <div class="func-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
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

// 6个功能模块（新增图片+家庭向解释，完全对应2×3布局）
const menuList = ref([
  {
    name: '用户管理',
    path: '/user',
    // 家庭主题图片（可替换为本地路径）
    img: 'https://img0.baidu.com/it/u=3691190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '管理家庭成员信息，维护家庭档案'
  },
  {
    name: '成长档案与监测',
    path: '/growth',
    img: 'https://img0.baidu.com/it/u=3911190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '记录孩子成长数据，监测健康发育'
  },
  {
    name: '智能日程',
    path: '/schedule',
    img: 'https://img0.baidu.com/it/u=3811190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '疫苗、体检等育儿日程智能提醒'
  },
  {
    name: '家庭协同与共享',
    path: '/family',
    img: 'https://img0.baidu.com/it/u=3711190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '家庭留言板，全家协同育儿'
  },
  {
    name: '实用工具',
    path: '/util',
    img: 'https://img0.baidu.com/it/u=3511190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '知识图谱、过敏原查询等育儿工具'
  },
  {
    name: '专家咨询',
    path: '/expert',
    img: 'https://img0.baidu.com/it/u=3411190909,1111190909&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300',
    desc: '育儿专家在线咨询，科学育儿指导'
  }
])

// 点击菜单跳转（完全保留原逻辑）
const handleMenuClick = (item) => {
  ElMessage.info(`切换到：${item.name}`)
  router.push(item.path)
}

// 退出登录（完全保留原逻辑）
const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 收件箱（完全保留原逻辑）
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
  background: #f5f7fa;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
}

/* 左侧边栏（完全保留原样式，仅微调适配） */
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

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.top-bar {
  height: 70px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  color: #333;
}

.content-area {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 核心：2行3列网格布局 */
.func-grid {
  width: 90%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 25px;
}

/* 功能卡片：图片+文字 */
.func-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.func-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* 图片区域 */
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

/* 文字信息区域 */
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
  line-height: 1.5;
}

/* 底部按钮（完全保留原位置样式） */
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

/* 响应式适配 */
@media (max-width: 1200px) {
  .func-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .func-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
}
</style>