<template>
    <div class="task-page">
        <!-- 头部 -->
        <div class="page-header">
            <el-button @click="goBack">← 返回</el-button>
            <h2>查看家庭任务</h2>
        </div>

        <!-- 任务列表 -->
        <el-table :data="taskList" border style="width: 90%; margin: 20px auto">
            <el-table-column label="任务ID" prop="taskId" />
            <el-table-column label="任务名称" prop="taskName" />
            <el-table-column label="发布人ID" prop="publisherId" />
            <el-table-column label="发布时间" prop="publishDate" />

            <el-table-column label="是否接受">
                <template #default="{ row }">
                    <span :style="{ color: row.isAccepted ? 'green' : 'red' }">
                        {{ row.isAccepted ? '已接受' : '未接受' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="是否完成" width="100">
                <template #default="{ row }">
                    <span :style="{ color: row.isFinished ? 'green' : 'red' }">
                        {{ row.isFinished ? '已完成' : '未完成' }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="success" size="small" :disabled="row.isAccepted" @click="handleAccept(row)">
                        {{ row.isAccepted ? '已接受' : '接受任务' }}
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
import { searchFamilyTask, acceptFamilyTask } from '../../api/family'

const router = useRouter()
const taskList = ref([])

// 返回
const goBack = () => {
    router.go(-1)
}

// ====================================
//  页面一加载 自动查询家庭任务
// ====================================
onMounted(() => {
    doSearch()
})

// 自动从 localStorage 取 familyId 查询
const doSearch = async () => {
    const familyId = localStorage.getItem('familyId')
    
    if (!familyId) {
        ElMessage.warning('未获取到家庭信息，请重新登录')
        return
    }

    try {
        const res = await searchFamilyTask({ familyId })
        if (res.code === 200) {
            taskList.value = res.data
        } else {
            ElMessage.error('查询失败')
        }
    } catch (e) {
        ElMessage.error('请求异常')
    }
}

// 接受任务
const handleAccept = async (row) => {
    try {
        const res = await acceptFamilyTask({
            publisherId: row.publisherId,
            taskName: row.taskName
        })
        if (res.code === 200) {
            ElMessage.success('接受成功')
            doSearch() // 刷新列表
        } else {
            ElMessage.error('接受失败')
        }
    } catch (e) {
        ElMessage.error('请求失败')
    }
}
</script>

<style scoped>
.task-page {
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

:deep(.el-table) {
  width: 100% !important;
}
</style>