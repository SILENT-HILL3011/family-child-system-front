<template>
    <div class="page-box">
        <div class="page-header">
            <h2>📋 每日生活记录查询</h2>
            <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>

        <div class="search-bar">
            <el-form inline>
                <!-- 儿童ID 输入框 → 下拉选择 -->
                <el-form-item label="选择儿童">
                    <el-select v-model="searchForm.childId" placeholder="请选择儿童" style="width:240px">
                        <el-option v-for="item in childList" :key="item.childId" :label="item.childName"
                            :value="item.childId" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList">查询</el-button>
                    <el-button type="success" @click="exportData">导出数据</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
            <el-table :data="list" border>
                <el-table-column label="记录类型" width="120">
                    <template #default="scope">
                        {{
                            scope.row.time === 1 ? '早餐' :
                                scope.row.time === 2 ? '午餐' :
                                    scope.row.time === 3 ? '午睡' :
                                        scope.row.time === 4 ? '晚餐' :
                                            scope.row.time === 5 ? '晚睡' : '未知'
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="饮食/睡眠" min-width="260">
                    <template #default="scope">
                        <div v-if="editDailyId !== scope.row.dailyId">
                            {{ scope.row.food ? scope.row.food : (scope.row.sleepTime ? scope.row.sleepTime + ' 小时' :
                                '') }}
                        </div>
                        <div v-else>
                            <el-input v-if="[1, 2, 4].includes(scope.row.time)" v-model="scope.row.food"
                                placeholder="饮食内容" />
                            <el-input v-if="[3, 5].includes(scope.row.time)" v-model.number="scope.row.sleepTime"
                                placeholder="睡眠时间" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="记录时间" width="200">
                    <template #default="scope">
                        {{ formatTime(scope.row.recordTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template #default="scope">
                        <div v-if="editDailyId !== scope.row.dailyId">
                            <el-button type="primary" size="small" @click="startEdit(scope.row)">修改</el-button>
                            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                        </div>
                        <div v-else>
                            <el-button type="success" size="small" @click="saveEdit(scope.row)">保存</el-button>
                            <el-button size="small" @click="cancelEdit">取消</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchLive, exportLive, deleteLiveRecord, updateLiveRecord,searchChildInfo } from '../../api/growth'

const searchForm = reactive({ childId: '', pageNum: 1 })
const list = ref([])
const editDailyId = ref(null)
const oldRow = ref(null)
const childList = ref([])

const getList = async () => {
    if (!searchForm.childId) return ElMessage.warning('请输入儿童ID')
    try {
        const res = await searchLive(searchForm)
        if (res.code === 200) list.value = res.data.list || []
    } catch (err) {
        ElMessage.error('请求失败')
    }
}

const exportData = async () => {
    if (!searchForm.childId) return ElMessage.warning("请输入儿童ID")
    try {
        const res = await exportLive({ childId: searchForm.childId })
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = "生活记录.xlsx"
        a.click()
        ElMessage.success("导出成功")
    } catch (e) {
        ElMessage.error("导出失败")
    }
}

// 时间格式化
const formatTime = (time) => {
    if (!time) return ''
    let d = new Date(time)
    let y = d.getFullYear()
    let m = (d.getMonth() + 1).toString().padStart(2, '0')
    let day = d.getDate().toString().padStart(2, '0')
    let hh = d.getHours().toString().padStart(2, '0')
    let mm = d.getMinutes().toString().padStart(2, '0')
    let ss = d.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

const handleDelete = async (row) => {
    await ElMessageBox.confirm('确定删除？', '警告')
    try {
        await deleteLiveRecord({ dailyId: row.dailyId })
        ElMessage.success('删除成功')
        getList()
    } catch (e) {
        ElMessage.error('删除失败')
    }
}

const startEdit = (row) => {
    editDailyId.value = row.dailyId
    oldRow.value = { ...row }
}

const cancelEdit = () => {
    const target = list.value.find(item => item.dailyId === editDailyId.value)
    if (target) Object.assign(target, oldRow.value)
    editDailyId.value = null
}

const saveEdit = async (row) => {
    try {
        await updateLiveRecord({
            dailyId: row.dailyId,
            time: row.timeText,
            food: row.food || null,
            sleepTime: row.sleepTime || null
        })
        ElMessage.success('保存成功')
        editDailyId.value = null
        getList()
    } catch (e) {
        ElMessage.error('保存失败')
    }
}

onMounted(async () => {
  try {
    const familyId = localStorage.getItem('familyId')
    const res = await searchChildInfo({ familyId: familyId })
    if (res.code === 200) {
      childList.value = res.data || []
    }
  } catch (e) {}
})
</script>

<style scoped>
.page-box {
    padding: 30px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.search-bar {
    margin-bottom: 20px;
}

.table-box {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
}
</style>