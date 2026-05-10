<template>
  <div class="doctor-page">
    <!-- 页面标题 + 返回首页按钮 -->
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1 class="page-title">医生模块</h1>
        <el-button type="primary" @click="goHome">← 返回首页</el-button>
      </div>
      <p class="page-subtitle">体检管理、健康评估、预防保健一站式服务</p>
    </div>

    <!-- 功能卡片 -->
    <div class="func-cards">
      <!-- 体检发布 -->
      <div class="func-card" @click="openPublishDialog">
        <div class="card-icon blue-icon">
          <el-icon size="40"><Calendar /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">体检发布</h3>
          <p class="card-desc">创建体检项目，设置开始时间与结束时间</p>
        </div>
      </div>

      <!-- 我的体检 -->
      <div class="func-card" @click="goToMyExam">
        <div class="card-icon green-icon">
          <el-icon size="40"><Document /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">我的体检</h3>
          <p class="card-desc">查看我发布的体检、待填写报告、已完成体检</p>
        </div>
      </div>

      <!-- 疾病预防 -->
      <div class="func-card" @click="goToDiseaseManager">
        <div class="card-icon orange-icon">
          <el-icon size="40"><Warning /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">疾病知识维护</h3>
          <p class="card-desc">专家维护：疾病、症状、药品、关系管理</p>
        </div>
      </div>
    </div>

    <!-- 体检发布弹窗（你原来的） -->
    <el-dialog v-model="publishDialogVisible" title="创建体检" width="500px">
      <el-form label-width="100px" :model="publishForm">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="publishForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="publishForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitPublish">
          确认创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, Document, Warning } from '@element-plus/icons-vue'
import { createPersonalExamination } from '../../api/expert'

const router = useRouter()

// 体检发布
const publishDialogVisible = ref(false)
const loading = ref(false)
const publishForm = ref({ startTime: '', endTime: '' })

// 打开弹窗
const openPublishDialog = () => {
  publishDialogVisible.value = true
}

// 提交发布
const submitPublish = async () => {
  const { startTime, endTime } = publishForm.value
  if (!startTime || !endTime) return ElMessage.warning('请选择时间')

  loading.value = true
  try {
    const res = await createPersonalExamination(startTime, endTime)
    if (res.code === 200) {
      ElMessage.success('创建成功')
      publishDialogVisible.value = false
    }
  } catch (e) {
    ElMessage.error('失败')
  } finally {
    loading.value = false
  }
}

const goToMyExam = () => router.push('/expert/doctor/my-exam')

const goToDiseaseManager = () => router.push('/expert/doctor/disease-manager')

// 返回首页
const goHome = () => router.push('/home')
</script>

<style scoped>
/* 完全和你原来一模一样，不动 */
.doctor-page {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  min-height: 100%;
  padding: 20px;
  background: #f5f7fa;
  overflow-x: hidden;
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

.func-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.blue-icon { background: linear-gradient(135deg, #409eff, #74b9ff); }
.green-icon { background: linear-gradient(135deg, #67c23a, #85e085); }
.orange-icon { background: linear-gradient(135deg, #e6a23c, #f5c568); }

.card-content { flex: 1; }
.card-title { font-size: 20px; font-weight: 600; margin:0 0 6px; }
.card-desc { font-size:15px; color:#909399; margin:0; }
</style>