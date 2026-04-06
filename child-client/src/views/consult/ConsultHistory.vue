<template>
  <div class="consult-history-page">
    <div class="header">
      <h2>我的咨询</h2>
      <el-button @click="goBack">← 返回</el-button>
    </div>

    <div class="list">
      <div v-if="loading" style="padding:40px;text-align:center">加载中...</div>

      <div
        v-for="item in list"
        :key="item.boardId"
        class="item"
      >
        <div>
          <div>专家：{{ item.expertId }}</div>
          <div>消息数：{{ item.messageCount }}</div>
          <div :class="['tag', item.isFinished ? 'end' : 'ing']">
            {{ item.isFinished ? '已结束' : '咨询中' }}
          </div>
        </div>
        <div class="btns">
          <el-button type="primary" @click="goChat(item)">进入聊天</el-button>
          <el-button type="danger" plain @click="finish(item.boardId)" :disabled="item.isFinished">
            结束咨询
          </el-button>
        </div>
      </div>

      <div v-if="!loading && list.length === 0" style="padding:60px;text-align:center;color:#999">
        暂无咨询记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchMyMessage, finishMessage } from '../../api/consult'

const router = useRouter()
const list = ref([])
const loading = ref(false)

const loadList = async () => {
  loading.value = true
  try {
    const res = await searchMyMessage({ pageNum: 1 })
    list.value = res.data?.list || []
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const goChat = (item) => {
  router.push({
    path: '/consult/chat',
    query: {
      boardId: item.boardId,
      expertId: item.expertId
    }
  })
}

const finish = async (boardId) => {
  try {
    await ElMessageBox.confirm('确定结束该咨询？')
    const res = await finishMessage({ boardId })
    if (res.code === 200) {
      ElMessage.success('已结束')
      loadList()
    }
  } catch (e) {}
}

onMounted(() => loadList())
const goBack = () => router.go(-1)
</script>

<style scoped>
.consult-history-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.item {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
  margin-left: 8px;
}
.ing { background: #409eff; }
.end { background: #999; }
.btns { display: flex; gap: 10px; }
</style>