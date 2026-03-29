<template>
  <div class="consult-chat-page">
    <div class="page-header">
      <el-button @click="goBack">← 返回</el-button>
      <h2>与 {{ expertName }} 咨询中</h2>
    </div>

    <div class="chat-window">
      <div class="message-list">
        <div 
          v-for="msg in messageList" 
          :key="msg.messageId"
          :class="['message-item', isSelf(msg) ? 'self' : 'other']"
        >
          <div class="message-bubble">
            <span class="message-time">{{ formatTime(msg.publishDate) }}</span>
            <p>{{ msg.text }}</p>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <el-input v-model="message" type="textarea" rows="2" placeholder="输入咨询内容..." />
        <el-button type="primary" @click="handleSend" :loading="isLoading">发送咨询</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { consultToExpert, getMessageInfoByBoardId } from '../../api/consult'

const router = useRouter()
const route = useRoute()

// 专家信息
const expertId = route.query.expertId || ''
const expertName = route.query.expertName || '专家'

// ✅ 修复点 1：优先从缓存拿 boardId，而不是只看路由
const boardId = ref(null)
const userId = ref(localStorage.getItem('userId') || '')

const message = ref('')
const messageList = ref([])
const isLoading = ref(false)

// ============================
// ✅ 持久化存储（刷新不丢）
// ============================
const initCacheKey = () => {
  return `chat_${expertId}_${userId.value}`
}

// 加载缓存
const loadFromCache = () => {
  const key = initCacheKey()
  const data = localStorage.getItem(key)
  if (!data) return

  const parsed = JSON.parse(data)
  messageList.value = parsed.messages || []
  // ✅ 修复点 2：刷新后从缓存恢复 boardId
  if (parsed.boardId) {
    boardId.value = parsed.boardId
  }
}

// 保存缓存
const saveToCache = () => {
  const key = initCacheKey()
  localStorage.setItem(key, JSON.stringify({
    boardId: boardId.value,
    messages: messageList.value
  }))
}

// 消息归属
const isSelf = (msg) => {
  return msg.publisherId === userId.value
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

// 加载聊天记录
const loadMessageList = async () => {
  if (!boardId.value) return
  try {
    const res = await getMessageInfoByBoardId({ boardId: boardId.value })
    if (res.code === 200) {
      messageList.value = res.data || []
      saveToCache()
      scrollToBottom()
    }
  } catch (e) {}
}

// 发送消息
const handleSend = async () => {
  if (!message.value.trim()) return ElMessage.warning('请输入内容')
  try {
    isLoading.value = true
    const res = await consultToExpert({
      userId: userId.value,
      expertId: expertId,
      message: message.value,
      boardId: boardId.value // ✅ 永远带 boardId
    })

    if (res.code === 200) {
      message.value = ''
      // ✅ 修复点 3：第一次发送就保存 boardId，永不丢失
      if (!boardId.value) {
        boardId.value = res.data
      }
      await loadMessageList()
      saveToCache()
    }
  } catch (err) {
    ElMessage.error('发送失败')
  } finally {
    isLoading.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.querySelector('.message-list')
    if (el) el.scrollTop = el.scrollHeight
  })
}

// 初始化
onMounted(() => {
  loadFromCache() // 先恢复缓存
  if (!boardId.value) {
    boardId.value = route.query.boardId || null
  }
  loadMessageList()
  scrollToBottom()
})

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.consult-chat-page {
  padding: 20px;
  max-width: 1700px;
  width: 100%;
  margin: 0 auto;
}
:deep(.page-header) {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
:deep(.chat-window) {
  border: 1px solid #e4e7ed;
  border-radius: 16px;
  padding: 30px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fafbfc;
}
:deep(.message-list) {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 10px 0;
}
:deep(.message-item) {
  display: flex;
  max-width: 38%;
}
:deep(.message-item.self) {
  justify-content: flex-end;
}
:deep(.message-item.other) {
  justify-content: flex-start;
}
:deep(.message-bubble) {
  width: 100%;
  padding: 14px 20px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
:deep(.message-item.self .message-bubble) {
  background: #409eff;
  color: #fff;
}
:deep(.message-item.other .message-bubble) {
  background: #fff;
  color: #333;
  border: 1px solid #eee;
}
:deep(.message-time) {
  font-size: 11px;
  color: #999;
  text-align: center;
  display: block;
  margin-bottom: 6px;
}
:deep(.chat-input) {
  border-top: 1px solid #eee;
  padding-top: 16px;
}
</style>