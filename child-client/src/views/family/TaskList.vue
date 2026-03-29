<template>
    <div class="task-page">
        <!-- 头部 -->
        <div class="page-header">
            <el-button @click="goBack">← 返回</el-button>
            <h2>查看家庭任务</h2>
        </div>

        <!-- 查询区域：输入发布人ID + 查询按钮 -->
        <div class="search-box">
            <el-input v-model="publisherId" placeholder="请输入发布人ID" style="width: 300px; margin-right: 10px" />
            <el-button type="primary" @click="doSearch">查询</el-button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchFamilyTask, acceptFamilyTask } from '../../api/family'

const router = useRouter()
const publisherId = ref('')  // 发布人ID，用户输入
const taskList = ref([])

// 返回
const goBack = () => {
    router.go(-1)
}

// 查询任务
const doSearch = async () => {
    if (!publisherId.value) {
        ElMessage.warning('请输入发布人ID')
        return
    }

    try {
        const res = await searchFamilyTask({
            publisherId: publisherId.value
        })
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
  width: 100%;       /* 页面全屏 */
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-box {
  text-align: center;
  margin-bottom: 20px;
}

/* 强制表格全屏 + 关闭滚动条 */
:deep(.el-table) {
  width: 100% !important;
  min-width: 1400px !important;  /* 超宽 */
}

:deep(.el-table__body-wrapper) {
  overflow: hidden !important; /* 彻底去掉下方滚动条 */
}
</style>