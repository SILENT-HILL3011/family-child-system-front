<template>
  <div class="home-page">
    <main class="main-content">
      <div class="top-bar">系统主页</div>
      <div class="content-area">
        <div class="func-grid">
          <div class="func-card" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
            <div class="func-img">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="func-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="bottom-left">
      <el-button type="primary" @click="handleLogout">退出登录</el-button>
    </div>

    <div class="bottom-right">
      <el-button type="info" @click="handleInbox">收件箱</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { checkUnReadMails } from '../api/mail'

const router = useRouter()

const menuList = ref([
  {
    name: '用户管理',
    path: '/user',
    img: new URL('../assets/images/user.jpg', import.meta.url).href,
    desc: '管理家庭成员信息，维护家庭档案'
  },
  {
    name: '成长档案与监测',
    path: '/growth',
    img: new URL('../assets/images/growth.jpg', import.meta.url).href,
    desc: '记录孩子成长数据，监测健康发育'
  },
  {
    name: '智能日程',
    path: '/schedule',
    img: new URL('../assets/images/schedule.jpg', import.meta.url).href,
    desc: '疫苗、体检等育儿日程智能提醒'
  },
  {
    name: '家庭协同与共享',
    path: '/family',
    img: new URL('../assets/images/family.jpg', import.meta.url).href,
    desc: '家庭留言板，全家协同育儿'
  },
  {
    name: '实用工具',
    path: '/util',
    img: new URL('../assets/images/tool.jpg', import.meta.url).href,
    desc: '知识图谱、过敏原查询等育儿工具'
  },
  {
    name: '专家咨询',
    path: '/expert',
    img: new URL('../assets/images/expert.jpg', import.meta.url).href,
    desc: '育儿专家在线咨询，科学育儿指导'
  }
])

const handleMenuClick = (item) => {
  ElMessage.info(`切换到：${item.name}`)
  router.push(item.path)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}

const handleInbox = () => {
  ElMessage.info('进入收件箱')
  router.push('/mail/box')
}

// ==============================================
// 🔥 语音提示：你有未读邮件
// ==============================================
const speakUnreadTip = () => {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance()
  u.text = '你有未读邮件'
  u.lang = 'zh-CN'
  u.volume = 1
  window.speechSynthesis.speak(u)
}

// ==============================================
// 🔥 进入首页自动检查未读
// ==============================================
onMounted(async () => {
  try {
    const res = await checkUnReadMails()
    if (res.data === true) {
      speakUnreadTip()
    }
  } catch (err) {}
})
</script>

<style scoped>
/* 你的样式完全不动 */
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
}
.main-content { width: 100%; height: 100%; display: flex; flex-direction: column; background: #fff; }
.top-bar { height: 70px; border-bottom: 1px solid #e4e7ed; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 500; color: #333; }
.content-area { flex: 1; padding: 30px; overflow-y: auto; display: flex; align-items: center; justify-content: center; }
.func-grid { width: 90%; max-width: 1200px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 25px; }
.func-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); overflow: hidden; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; }
.func-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
.func-img { width: 100%; height: 180px; overflow: hidden; background: #f5f7fa; }
.func-img img { width: 100%; height: 100%; object-fit: cover; transition: all 0.3s; }
.func-card:hover .func-img img { transform: scale(1.05); }
.func-info { padding: 18px 15px; text-align: center; }
.func-info h3 { margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1a3a69; }
.func-info p { margin: 0; font-size: 14px; color: #666; line-height: 1.5; }
.bottom-left { position: fixed; left: 30px; bottom: 30px; z-index: 10; }
.bottom-right { position: fixed; right: 30px; bottom: 30px; z-index: 10; }
@media (max-width: 1200px) { .func-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 1fr); } }
@media (max-width: 768px) { .func-grid { grid-template-columns: 1fr; grid-template-rows: repeat(6, 1fr); } }
</style>