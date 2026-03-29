<template>
  <div class="chat-page">
    <!-- 返回按钮 -->
    <el-button type="primary" @click="goBack" style="margin-bottom:20px">
      ← 返回
    </el-button>

    <!-- 会话信息 -->
    <div class="chat-header">
      <h3>会话 ID：{{ boardId }}</h3>
    </div>

    <!-- 消息区域 -->
    <div class="chat-messages" ref="chatScroll">
      <div
        class="message-item"
        v-for="msg in messageList"
        :key="msg.messageId"
        :class="getMsgClass(msg)"
      >
        <div class="message-bubble">
          <p class="message-text">{{ msg.text }}</p>
          <span class="message-time">{{ formatTime(msg.publishDate) }}</span>
        </div>
      </div>

      <div v-if="messageList.length === 0" class="empty-tip">
        暂无聊天记录
      </div>
    </div>

    <!-- 输入框 + 发送按钮 -->
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
import { getHistory, applyMessage } from '../../api/expertUtil'

const router = useRouter()
const route = useRoute()

// 会话ID
const boardId = ref(route.query.boardId || '')
// 消息列表
const messageList = ref([])
// 输入内容
const inputText = ref('')
// 滚动容器
const chatScroll = ref(null)

// 获取历史消息
const loadHistory = async () => {
  if (!boardId.value) return

  try {
    const res = await getHistory(boardId.value)
    if (res.code === 200) {
      messageList.value = res.data
      nextTick(scrollToBottom)
    }
  } catch (err) {
    ElMessage.error('加载记录失败')
  }
}

// 🔴 发送消息核心逻辑
const sendMessage = async () => {
  const content = inputText.value.trim()
  if (!content) {
    return ElMessage.warning('请输入消息内容')
  }

  try {
    // 调用你截图的 apply 接口
    const res = await applyMessage({
      content,
      boardId: boardId.value
    })

    if (res.code === 200) {
      ElMessage.success('消息发送成功')
      inputText.value = '' // 清空输入框
      loadHistory() // 刷新记录，自动加入新消息
    }
  } catch (err) {
    ElMessage.error('发送失败')
  }
}

// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString()
}

// 判断消息属于自己还是对方
const getMsgClass = (msg) => {
  const expertId = localStorage.getItem('expertId') || ''
  return msg.publisherId === expertId ? 'my-message' : 'other-message'
}

// 返回
const goBack = () => {
  router.go(-1)
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatScroll.value) {
    chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.chat-page {
  padding: 20px;
}
.chat-header {
  margin-bottom: 15px;
}
.chat-messages {
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message-item {
  display: flex;
}
.my-message {
  justify-content: flex-end;
}
.other-message {
  justify-content: flex-start;
}
.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
}
.my-message .message-bubble {
  background: #409eff;
  color: #fff;
}
.other-message .message-bubble {
  background: #f5f7fa;
  color: #333;
}
.message-text {
  margin: 0;
  word-break: break-all;
}
.message-time {
  font-size: 12px;
  opacity: 0.7;
  display: block;
  margin-top: 5px;
  text-align: right;
}
.other-message .message-time {
  text-align: left;
}
.empty-tip {
  text-align: center;
  padding: 40px;
  color: #999;
}
.input-area {
  margin-top: 15px;
}
</style>