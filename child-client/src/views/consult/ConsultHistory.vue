<template>
  <div class="consult-history-page">
    <!-- 左侧边栏（和你专家模块统一） -->
    <div class="sidebar">
      <div class="menu-item" @click="go('/home')">返回首页</div>
      <div class="menu-item" @click="currentMenu = 'find'">寻找专家</div>
      <div class="menu-item active" @click="currentMenu = 'history'">历史咨询</div>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <h2>历史咨询</h2>

      <!-- 历史记录列表 -->
      <div class="history-list">
        <div class="history-item" v-for="item in historyList" :key="item.boardId">
          <div class="history-info">
            <div class="history-title">
              与 {{ getExpertName(item.expertId) }} 的咨询（{{ item.messageCount }} 条消息）
            </div>
            <div class="history-detail">
              <p>会话ID：{{ item.boardId }}</p>
              <p>专家ID：{{ item.expertId }}</p>
              <p>消息数：{{ item.messageCount }}</p>
            </div>
          </div>
          <div class="btn-group">
            <el-button type="primary" size="small" @click="goToChat(item)">
              继续聊天
            </el-button>
            <el-button type="danger" size="small" plain @click="finishChat(item)">结束聊天</el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="historyList.length === 0" class="empty-placeholder">
        <p>暂无历史咨询记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchMyMessage, finishMessage } from '../../api/consult'

const router = useRouter()
const currentMenu = ref('history')
const historyList = ref([])

// 加载历史咨询
const loadHistory = async () => {
  try {
    const res = await searchMyMessage()
    if (res.code === 200) {
      historyList.value = res.data.list || []
    }
  } catch (err) {
    ElMessage.error('加载历史咨询失败')
  }
}

// 根据 expertId 显示专家名（演示用，后续可对接接口）
const getExpertName = (expertId) => {
  // 你可以在这里对接 getExpertByType 接口，根据 expertId 查名字
  // 现在先返回固定名，等专家模块好了再补全
  return '王医生'
}

// 继续聊天（跳转到聊天页，携带 boardId）
const goToChat = (item) => {
  router.push({
    path: '/consult/chat',
    query: {
      boardId: item.boardId,
      expertId: item.expertId,
      expertName: getExpertName(item.expertId)
    }
  })
}

const go = (path) => {
  router.push(path)
}

const finishChat = async (item) => {
  try {
    const res = await finishMessage({ boardId: item.boardId })
    if (res.code === 200) {
      ElMessage.success('结束咨询成功')
      // 结束后刷新历史列表
      await loadHistory()
    }
  } catch (err) {
    ElMessage.error('结束咨询失败')
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
/* 完全和你之前的页面样式统一 */
.consult-history-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.sidebar {
  width: 220px;
  background: #f7f8fa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
}
.menu-item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.3s;
}
.menu-item:hover {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.menu-item.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}
.history-item {
  background: #fff;
  padding: 18px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.history-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}
.history-detail p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}
.btn-group {
  display: flex;
  gap: 10px;
}
.empty-placeholder {
  margin-top: 60px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>