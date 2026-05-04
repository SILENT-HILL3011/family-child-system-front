<template>
  <div class="my-exam-page">
    <div class="container">
      <div class="back-btn" @click="goBack">← 返回成长档案</div>

      <div class="title">🏥 我的体检预约</div>

      <div class="card-box">
        <div v-if="loading" style="text-align:center;padding:40px">加载中...</div>
        <div v-else-if="list.length === 0" class="empty-tip">暂无体检预约记录</div>

        <el-table
          v-else
          :data="list"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column label="儿童姓名" prop="childName" />
          <el-table-column label="医生" prop="doctorName" />
          
          <el-table-column label="开始时间">
            <template #default="scope">
              {{ formatTime(scope.row.startTime) }}
            </template>
          </el-table-column>
          
          <el-table-column label="结束时间">
            <template #default="scope">
              {{ formatTime(scope.row.endDate) }}
            </template>
          </el-table-column>
          
          <el-table-column label="体检状态" prop="status">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 1"
                type="danger"
                size="small"
                @click="handleCancel(scope.row.appointId)"
              >
                取消预约
              </el-button>

              <el-button
                v-else-if="scope.row.status === 2"
                type="info"
                size="small"
                disabled
              >
                体检中
              </el-button>

              <el-button
                v-else-if="scope.row.status === 3"
                type="primary"
                size="small"
                @click="handleReport(scope.row)"
              >
                查看报告
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import { findMyExamination, cancelExamination } from '../../api/growth'

const router = useRouter()
const goBack = () => router.push('/growth')

const list = ref([])
const loading = ref(false)

const formatTime = (time) => {
  if (!time) return '2000-00-00 00:00:00'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-').replace(/\u5e74|\u6708/g, '-').replace(/\u65e5/g, '')
}

const loadMyExamination = async () => {
  loading.value = true
  try {
    const familyId = localStorage.getItem('familyId')
    const res = await findMyExamination({ familyId })
    if (res.code === 200) {
      list.value = res.data || []
    }
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const getStatusTagType = (status) => {
  switch (status) {
    case 1: return 'warning'
    case 2: return 'info'
    case 3: return 'success'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 1: return '待体检'
    case 2: return '进行中'
    case 3: return '已完成'
    default: return '未知'
  }
}

// ========== 最终正确取消预约 ==========
const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消该体检预约吗？')
    
    const res = await cancelExamination({ appointId: id })

    if (res.code === 200) {
      ElMessage.success('取消成功')
      loadMyExamination()
    }
  } catch (e) {
    ElMessage.info('已取消')
  }
}

const handleReport = (row) => {
  router.push(`/growth/reportDetail?appointId=${row.appointId}`)
}

onMounted(() => {
  loadMyExamination()
})
</script>

<style scoped>
.my-exam-page {
  width: 100vw;
  height: 100vh;
  background: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.container {
  max-width: 1000px;
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
  z-index: 99;
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 500;
}

.card-box {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>