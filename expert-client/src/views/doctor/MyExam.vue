<template>
  <div class="my-exam-page">
    <div class="page-header">
      <h1 class="page-title">我的体检</h1>
      <p class="page-subtitle">个人发布体检及预约记录查询</p>
    </div>

    <div class="table-wrapper">
      <el-table :data="tableList" border stripe style="width: 100%">
        <el-table-column label="预约ID" prop="appointId" />
        <el-table-column label="体检ID" prop="examinationId" />
        <el-table-column label="儿童姓名" prop="childName" />
        <el-table-column label="医生姓名" prop="doctorName" />
        <el-table-column label="开始时间" prop="startTime" />
        <el-table-column label="结束时间" prop="endDate" />

        <el-table-column label="体检状态">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 只加这一列：操作按钮 -->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <!-- 填写报告：只有状态=3显示 -->
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.status === 3"
              @click="goFill(scope.row)"
            >
              填写报告
            </el-button>

            <!-- 返回按钮 -->
            <el-button size="small" @click="goBack">返回</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-empty v-if="tableList.length === 0" description="暂无体检记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getMyExamination } from '../../api/expert'

const router = useRouter()
const tableList = ref([])

onMounted(async () => {
  await loadList()
})

const loadList = async () => {
  try {
    const res = await getMyExamination()
    if (res.code === 200) {
      tableList.value = res.data
    }
  } catch (err) {
    ElMessage.error('加载体检列表失败')
  }
}

// 状态文本
const getStatusText = (val) => {
  switch (val) {
    case 1: return '未开始'
    case 2: return '进行中'
    case 3: return '待填写报告'
    default: return '已过期'
  }
}

// 标签类型
const getTagType = (val) => {
  switch (val) {
    case 1: return 'info'
    case 2: return 'primary'
    case 3: return 'success'
    default: return 'danger'
  }
}

// ============== 按钮方法 ==============
// 返回医生主页
const goBack = () => {
  router.push('/expert/doctor')
}

// 填写报告
const goFill = (row) => {
  ElMessage.success('前往填写报告：' + row.appointId)
  router.push(`/expert/doctor/fillReport?appointId=${row.appointId}`)
}
</script>

<style scoped>
.my-exam-page {
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

.table-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
</style>