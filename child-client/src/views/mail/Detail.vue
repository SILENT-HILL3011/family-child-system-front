<template>
  <div class="mail-detail">
    <el-button @click="goBack" style="margin-bottom:20px">← 返回</el-button>

    <el-card v-if="detail">
      <h3>{{ detail.title }}</h3>
      <div class="info-bar">
        <span>ID：{{ detail.id }}</span>
        <span>发件人：{{ detail.sendUserId }}</span>
        <span>时间：{{ detail.createTime }}</span>
      </div>
      <div class="content">{{ detail.content }}</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { openMail } from '../../api/mail'  // 只用这一个接口！

const router = useRouter()
const route = useRoute()
const detail = ref({})
const mailId = route.params.id

const goBack = () => {
  router.go(-1)
}

// ✅ 核心：调用 readMail → 直接返回 content + 自动标已读
const init = async () => {
  // 后端这个接口：
  // 1. 查询邮件
  // 2. 自动设置为已读
  // 3. 返回完整内容
  const res = await openMail({ mailId })
  
  // 组装详情对象（你接口返回的是 content，我帮你拼成完整结构）
  detail.value = {
    id: mailId,
    content: res.data,  // 后端返回的就是正文
    title: route.query.title,
    sendUserId: route.query.sendUserId,
    createTime: route.query.createTime
  }
}

onMounted(() => init())
</script>

<style scoped>
.mail-detail { padding: 20px; }
.info-bar {
  color: #666; margin:15px 0; padding-bottom:15px; border-bottom:1px solid #eee;
  span { margin-right:20px; }
}
.content { font-size:15px; line-height:1.8; }
</style>