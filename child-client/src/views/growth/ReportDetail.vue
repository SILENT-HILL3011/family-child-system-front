<template>
  <div class="report-page">
    <div class="container">
      <div class="back-btn" @click="goBack">← 返回体检列表</div>

      <div class="title">🏥 体检报告详情</div>
      <el-button type="primary" @click="exportPdf" style="margin-top:20px; width:100%">
        导出体检报告（PDF）
      </el-button>

      <div class="card-box" v-if="reportData">
        <el-descriptions :column="1" border title="儿童信息" size="medium">
          <el-descriptions-item label="儿童姓名">{{ reportData.childName }}</el-descriptions-item>
          <el-descriptions-item label="医生">{{ reportData.doctor }}</el-descriptions-item>
          <el-descriptions-item label="体检日期">{{ formatTime(reportData.examDate) }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">体检项目结果</div>
        <el-descriptions :column="1" border size="medium">
          <el-descriptions-item label="身高">{{ toText(reportData.height) }}</el-descriptions-item>
          <el-descriptions-item label="体重">{{ toText(reportData.weight) }}</el-descriptions-item>
          <el-descriptions-item label="头围">{{ toText(reportData.headCirc) }}</el-descriptions-item>
          <el-descriptions-item label="视力">{{ toText(reportData.vision) }}</el-descriptions-item>
          <el-descriptions-item label="听力">{{ toText(reportData.hearing) }}</el-descriptions-item>
          <el-descriptions-item label="牙齿">{{ toText(reportData.tooth) }}</el-descriptions-item>
          <el-descriptions-item label="心脏">{{ toText(reportData.heart) }}</el-descriptions-item>
          <el-descriptions-item label="腹部">{{ toText(reportData.abdomen) }}</el-descriptions-item>
          <el-descriptions-item label="四肢">{{ toText(reportData.limb) }}</el-descriptions-item>
          <el-descriptions-item label="皮肤">{{ toText(reportData.skin) }}</el-descriptions-item>
          <el-descriptions-item label="神经">{{ toText(reportData.nerve) }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">医生建议</div>
        <div class="suggest-box">{{ reportData.suggestion || '暂无建议' }}</div>
      </div>

      <div v-else class="empty-tip">
        <el-empty description="报告不存在或未生成" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { checkResult,exportExamPdf } from '../../api/growth'

const route = useRoute()
const router = useRouter()
const appointId = route.query.appointId
const reportData = ref(null)

const exportPdf = async () => {
  const res = await exportExamPdf({ appointId })
  const blob = new Blob([res], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '体检报告.pdf'
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (!appointId) {
    ElMessage.error('参数错误')
    return
  }
  getReport()
})

const getReport = async () => {
  try {
    const res = await checkResult({ appointId })
    if (res.code === 200 && res.data) {
      reportData.value = res.data
    } else {
      ElMessage.warning('暂无报告')
    }
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const toText = (val) => val === 1 ? '正常' : val === 0 ? '异常' : '未检查'

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString().replace(/\//g, '-')
}

const goBack = () => router.push('/my-examination')
</script>

<style scoped>
.report-page {
  width: 100vw;
  height: 100vh;
  background: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  padding-top: 60px;
}

.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
}

.card-box {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.section-title {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 500;
}

.suggest-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
}
</style>