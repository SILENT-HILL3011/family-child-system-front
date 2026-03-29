<template>
  <div class="my-task-page">
    <!-- 头部 -->
    <div class="page-header">
      <el-button @click="goBack">← 返回</el-button>
      <h2>查看我的任务</h2>
    </div>

    <!-- 任务列表（复用之前的宽版样式） -->
    <el-table :data="taskList" border style="width: 100%;">
      <el-table-column label="任务ID" prop="taskId" width="220" />
      <el-table-column label="任务名称" prop="taskName" width="180" />
      <el-table-column label="发布人ID" prop="publisherId" width="200" />
      <el-table-column label="接收人ID" prop="receiverId" width="200" />
      <el-table-column label="发布时间" prop="publishDate" width="240" />
      
      <el-table-column label="是否接受" width="120">
        <template #default="{ row }">
          <span :style="{color: row.isAccepted ? 'green' : 'red'}">
            {{ row.isAccepted ? '已接受' : '未接受' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="是否完成" width="120">
        <template #default="{ row }">
          <span :style="{color: row.isFinished ? 'green' : 'red'}">
            {{ row.isFinished ? '已完成' : '未完成' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="row.isFinished"
            @click="handleFinish(row)"
          >
            {{ row.isFinished ? '已完成' : '完成' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchMyTask, finishFamilyTask } from '../../api/family'

const router = useRouter()
const taskList = ref([])

// 加载我的任务
const loadMyTask = async () => {
  try {
    const res = await searchMyTask()
    if (res.code === 200) {
      taskList.value = res.data
    } else {
      ElMessage.error('获取我的任务失败')
    }
  } catch (err) {
    ElMessage.error('请求异常')
  }
}

// 完成任务
const handleFinish = async (row) => {
  try {
    const res = await finishFamilyTask({
      taskName: row.taskName
    })
    if (res.code === 200) {
      ElMessage.success('任务完成！')
      loadMyTask() // 刷新列表
    } else {
      ElMessage.error('完成失败')
    }
  } catch (err) {
    ElMessage.error('请求失败')
  }
}

// 返回
const goBack = () => {
  router.go(-1)
}

onMounted(loadMyTask)
</script>

<style scoped>
.my-task-page {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

/* 保持宽版无滚动条 */
:deep(.el-table) {
  width: 100% !important;
  min-width: 1500px !important;
}

:deep(.el-table__body-wrapper) {
  overflow: hidden !important;
}
</style>