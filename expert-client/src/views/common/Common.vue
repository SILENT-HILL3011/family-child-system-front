<template>
  <div class="common-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">通用模块</h1>
      <p class="page-subtitle">专家基础信息管理与用户咨询入口</p>
    </div>

    <!-- 功能卡片区（纵向单列） -->
    <div class="func-cards">
      <!-- 专家信息管理卡片 -->
      <div class="func-card" @click="openInfoDialog">
        <div class="card-icon">
          <el-icon size="40"><User /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">专家信息管理</h3>
          <p class="card-desc">查看并修改您的个人资料、联系方式和所属类型</p>
        </div>
      </div>

      <!-- 用户咨询卡片 -->
      <div class="func-card" @click="goToChat">
        <div class="card-icon chat-icon">
          <el-icon size="40"><ChatDotRound /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">用户咨询</h3>
          <p class="card-desc">查看待处理咨询，与用户在线沟通并提供专业建议</p>
        </div>
      </div>
    </div>

    <!-- 专家信息弹窗 -->
    <el-dialog v-model="infoDialogVisible" title="专家信息管理" width="520px">
      <el-form label-width="100px" :model="infoForm">
        <el-form-item label="专家ID">
          <el-input v-model="infoForm.expertId" disabled />
        </el-form-item>
        <el-form-item label="专家姓名">
          <el-input v-model="infoForm.expertName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="infoForm.expertPhone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="infoForm.expertEmail" />
        </el-form-item>
        <el-form-item label="工作单位">
          <el-input v-model="infoForm.workPlace" />
        </el-form-item>
        <el-form-item label="专家类型">
          <el-select v-model="infoForm.expertType" placeholder="请选择类型">
            <el-option label="医生" value="医生" />
            <el-option label="老师" value="老师" />
            <el-option label="厨师" value="厨师" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="infoDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveExpertInfo">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, ChatDotRound } from '@element-plus/icons-vue'
import { searchExpertInfo, updateExpertInfo } from '../../api/expert'

const router = useRouter()

// 专家信息弹窗
const infoDialogVisible = ref(false)
const infoForm = ref({})
const saving = ref(false)

// 打开专家信息弹窗
const openInfoDialog = async () => {
  await loadExpertInfo()
  infoDialogVisible.value = true
}

// 加载专家信息
const loadExpertInfo = async () => {
  try {
    const res = await searchExpertInfo()
    if (res.code === 200) {
      infoForm.value = { ...res.data }
    }
  } catch (e) {
    ElMessage.error('加载信息失败')
  }
}

// 保存专家信息
const saveExpertInfo = async () => {
  saving.value = true
  try {
    const res = await updateExpertInfo(infoForm.value)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      infoDialogVisible.value = false
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 跳转到用户咨询
const goToChat = () => {
  router.push('/expert/chat-list')
}
</script>

<style scoped>
/* 页面容器 —— 修复宽度 + 隐藏滚动条 */
.common-page {
  width: 100%;
  max-width: 700px; /* 关键：限制最大宽度，去掉滚动条 */
  margin: 0 auto;   /* 居中 */
  min-height: 100%;
  padding: 20px;
  background: #f5f7fa;
  overflow-x: hidden; /* 强制隐藏横向滚动条 */
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 15px;
  color: #909399;
  margin: 0;
}

/* 卡片纵向排列 */
.func-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 卡片样式 */
.func-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.func-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 图标区域 */
.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #74b9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.chat-icon {
  background: linear-gradient(135deg, #67c23a, #85e085);
}

/* 文字内容 */
.card-content {
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 6px;
}

.card-desc {
  font-size: 15px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}
</style>