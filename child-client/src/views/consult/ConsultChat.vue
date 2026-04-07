<template>
  <div class="chat-page">
    <el-button type="primary" @click="goBack" style="margin-bottom:20px">
      ← 返回
    </el-button>

    <div class="chat-header">
      <h3>会话 ID：{{ boardId }}</h3>
    </div>

    <div class="chat-messages" ref="chatScroll">
      <div 
        v-for="msg in messageList" 
        :key="msg.messageId"
        class="message-item"
        :class="msg.self ? 'my-message' : 'other-message'"
      >
        <div class="message-bubble">
          <p class="message-text">{{ msg.text }}</p>
          <span class="message-time">{{ formatTime(msg.publishDate) }}</span>
        </div>
      </div>

      <div v-if="messageList.length === 0" class="empty-tip">暂无聊天记录</div>
    </div>

    <div class="input-area">
      <el-input
        v-model="inputText"
        placeholder="输入消息..."
        @keyup.enter="sendMessage"
      >
        <template #append>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMessageInfoByBoardId, consultToExpert } from '../../api/consult'

const router = useRouter()
const route = useRoute()

const boardId = ref(route.query.boardId || '')
const messageList = ref([])
const inputText = ref('')
const chatScroll = ref(null)
const userId = ref(localStorage.getItem('userId') || '')

let ws = null

const loadHistory = async () => {
  if (!boardId.value) return
  try {
    const res = await getMessageInfoByBoardId({ boardId: boardId.value })
    messageList.value = res.data
    scrollToBottom()
  } catch (err) {
    ElMessage.error('加载记录失败')
  }
}

const connectNetty = () => {
  if (ws) return
  ws = new WebSocket('ws://localhost:9090')
  ws.onopen = () => {
    console.log('用户 Netty 已连接')
    ws.send('BIND_USER:' + userId.value)
  }
  ws.onmessage = () => loadHistory()
  ws.onerror = () => console.log('ws 异常')
  ws.onclose = () => { ws = null; setTimeout(connectNetty, 2000) }
}

const sendMessage = async () => {
  const content = inputText.value.trim()
  if (!content) return ElMessage.warning('请输入消息内容')
  try {
    await consultToExpert({
      message: content,
      boardId: boardId.value,
      expertId: route.query.expertId
    })
    inputText.value = ''
    await loadHistory()
    ws?.send("refresh")
    ElMessage.success('发送成功')
  } catch (err) {
    ElMessage.error('发送失败')
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScroll.value) {
      chatScroll.value.scrollTop = chatScroll.value.scrollHeight
    }
  })
}

onMounted(() => {
  loadHistory()
  connectNetty()
})

const goBack = () => router.go(-1)
</script>

<style scoped>
.chat-page { padding: 20px; }
.chat-header { margin-bottom: 15px; }
.chat-messages {
  height: 400px; border: 1px solid #e4e7ed; border-radius: 8px;
  padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
}
.message-item { display: flex; }
.message-item.my-message { justify-content: flex-end; }
.message-item.my-message .message-bubble { background: #409eff; color: #fff; }
.message-item.other-message { justify-content: flex-start; }
.message-item.other-message .message-bubble { background: #f5f7fa; color: #333; }
.message-bubble { max-width: 70%; padding: 10px 15px; border-radius: 18px; }
.message-text { margin: 0; word-break: break-all; }
.message-time { font-size: 12px; opacity: 0.7; margin-top: 5px; display:block; text-align:right; }
.other-message .message-time { text-align:left; }
.empty-tip { text-align: center; padding: 40px; color: #999; }
.input-area { margin-top: 15px; }
</style>