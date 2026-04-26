<template>
  <div class="my-exam-page">
    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-btn" @click="goBack">← 返回成长档案</div>

      <div class="title">🏥 我的体检预约</div>

      <!-- 列表区域 -->
      <div class="card-box">
        <div v-if="list.length === 0" class="empty-tip">暂无体检预约记录</div>

        <el-table
          v-else
          :data="list"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column label="儿童ID" prop="childId" />
          <el-table-column label="儿童姓名" prop="childName" />
          <el-table-column label="医生ID" prop="doctorId" />
          <el-table-column label="预约时间" prop="appointTime" />
          <el-table-column label="体检状态" prop="status">
            <template #default="scope">
              <el-tag 
                :type="getStatusTagType(scope.row.status)"
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <!-- 待体检：取消预约 -->
              <el-button
                v-if="scope.row.status === '待体检'"
                type="danger"
                size="small"
                @click="handleCancel(scope.row.id)"
              >
                取消预约
              </el-button>

              <!-- 已完成：查询体检报告 -->
              <el-button
                v-else-if="scope.row.status === '已完成'"
                type="primary"
                size="small"
                @click="handleReport(scope.row)"
              >
                查询体检报告
              </el-button>

              <!-- 进行中：禁用按钮 仅文字 -->
              <el-button
                v-else-if="scope.row.status === '进行中'"
                type="info"
                size="small"
                disabled
              >
                请耐心等待
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 返回
const goBack = () => {
  router.push('/growth')
}

// 模拟数据：包含三种状态
const list = ref([
  {
    id: 1,
    childId: '1001',
    childName: '张三',
    doctorId: '2001',
    appointTime: '2025-12-25 09:00:00',
    status: '待体检'
  },
  {
    id: 2,
    childId: '1001',
    childName: '张三',
    doctorId: '2002',
    appointTime: '2025-12-20 14:30:00',
    status: '已完成'
  },
  {
    id: 3,
    childId: '1002',
    childName: '李四',
    doctorId: '2003',
    appointTime: '2025-12-26 10:00:00',
    status: '进行中'
  }
])

// 状态标签颜色
const getStatusTagType = (status) => {
  switch(status) {
    case '待体检':
      return 'warning'
    case '已完成':
      return 'success'
    case '进行中':
      return 'info'
    default:
      return ''
  }
}

// 取消预约
const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消该体检预约吗？')
    list.value = list.value.filter(item => item.id !== id)
    ElMessage.success('预约已取消')
  } catch {
    ElMessage.info('已取消操作')
  }
}

// 查询体检报告
const handleReport = (row) => {
  ElMessage.success(`正在查看【${row.childName}】体检报告`)
  // 后续可对接报告弹窗 / 新页面跳转
}
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