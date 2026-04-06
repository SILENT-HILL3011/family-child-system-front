<template>
  <div class="chat-page">
    <div class="top">
      <el-button @click="goBack">← 返回</el-button>
      <h2>咨询聊天</h2>
    </div>

    <div class="chat-box">
      <div class="msg-list" ref="msgList">
        <div
          v-for="msg in messageList"
          :key="msg.messageId"
          :class="['msg', msg.isSelf ? 'self' : 'other']"
        >
          <div class="bubble">
            <span class="time">{{ msg.time }}</span>
            <p>{{ msg.text }}</p>
          </div>
        </div>
      </div>

      <div class="input-box">
        <el-input v-model="content" type="textarea" rows="2" placeholder="输入消息..." />
        <el-button type="primary" @click="send" :loading="loading">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { consultToExpert, getMessageInfoByBoardId } from '../../api/consult'

const router = useRouter()
const route = useRoute()

const boardId = ref('')
const expertId = ref('')
const userId = ref(localStorage.getItem('userId') || '')

const messageList = ref([])
const content = ref('')
const loading = ref(false)
const msgList = ref(null)

// 初始化加载
const loadMessages = async () => {
  if (!boardId.value) return
  try {
    const res = await getMessageInfoByBoardId({ boardId: boardId.value })
    if (res.code === 200 && res.data) {
      messageList.value = res.data.map(m => ({
        ...m,
        isSelf: m.publisherId === userId.value,
        time: new Date(m.publishDate).toLocaleString()
      }))
      scrollBottom()
    }
  } catch (e) {}
}

// 发送
const send = async () => {
  if (!content.value.trim()) return ElMessage.warning('请输入内容')
  try {
    loading.value = true
    const res = await consultToExpert({
      expertId: expertId.value,
      message: content.value.trim(),
      boardId: boardId.value || null
    })
    if (res.code === 200) {
      boardId.value = res.data
      content.value = ''
      await loadMessages()
    }
  } catch (e) {
    ElMessage.error('发送失败')
  } finally {
    loading.value = false
  }
}

const scrollBottom = () => {
  nextTick(() => {
    if (msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight
  })
}

// 第一次进入
onMounted(() => {
  boardId.value = route.query.boardId || ''
  expertId.value = route.query.expertId || ''
  if (boardId.value) loadMessages()
})

// 从历史列表点进来一定会触发！（关键修复）
watch(
  () => route.query,
  () => {
    boardId.value = route.query.boardId || ''
    expertId.value = route.query.expertId || ''
    if (boardId.value) loadMessages()
  },
  { deep: true }
)

const goBack = () => router.go(-1)
</script>

<style scoped>
.chat-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.chat-box {
  height: 80vh;
  border: 1px solid #eee;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  background: #fafbfc;
}
.msg-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.msg {
  display: flex;
  max-width: 60%;
}
.msg.self {
  justify-content: flex-end;
}
.msg.other {
  justify-content: flex-start;
}
.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eee;
}
.msg.self .bubble {
  background: #409eff;
  color: #fff;
  border: none;
}
.time {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}
.input-box {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.input-box > :deep(.el-input) {
  flex: 1;
}
</style>