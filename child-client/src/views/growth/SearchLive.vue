<!-- <template>
    <div class="page-box">
        <div class="page-header">
            <h2>📋 每日生活记录查询</h2>
            <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>

        <div class="search-bar">
            <el-form inline>
                <el-form-item label="儿童ID">
                    <el-input v-model="searchForm.childId" placeholder="请输入儿童ID" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList">查询</el-button>
                    <el-button type="success" @click="exportData">导出数据</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-box">
            <el-table :data="list" border>
                <el-table-column label="记录类型" width="120" prop="time" />
                <el-table-column label="饮食/睡眠" min-width="240">
                    <template #default="scope">
                        {{ scope.row.food ? scope.row.food : scope.row.sleepTime + ' 小时' }}
                    </template>
                </el-table-column>
                <el-table-column label="记录时间" width="200">
                    <template #default="scope">
                        {{ formatTime(scope.row.recordTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleEdit(row)" disabled>修改</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <el-dialog v-model="editDialog" title="修改每日记录" width="540px" center>
        <div style="padding: 20px">
            <el-form label-width="100px">
                <el-form-item label="儿童ID">
                    <el-input v-model="editForm.childId" disabled />
                </el-form-item>
                <el-form-item label="记录类型">
                    <el-select v-model="editForm.time" placeholder="请选择" style="width:280px">
                        <el-option label="早饭" :value="1" />
                        <el-option label="午饭" :value="2" />
                        <el-option label="午休" :value="3" />
                        <el-option label="晚饭" :value="4" />
                        <el-option label="晚休" :value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="饮食内容" v-if="[1, 2, 4].includes(editForm.time)">
                    <el-input v-model="editForm.food" placeholder="请输入饮食" style="width:280px" />
                </el-form-item>
                <el-form-item label="睡眠时长" v-if="[3, 5].includes(editForm.time)">
                    <el-input v-model.number="editForm.sleepTime" placeholder="请输入小时" style="width:280px" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="editDialog = false">取消</el-button>
            <el-button type="primary" @click="submitEdit">保存修改</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchLive, exportLive, deleteLiveRecord } from '../../api/growth'
import axios from 'axios'

const searchForm = reactive({
    childId: '',
    pageNum: 1
})

const list = ref([])

const getList = async () => {
    if (!searchForm.childId) {
        ElMessage.warning('请输入儿童ID')
        return
    }

    try {
        const res = await searchLive(searchForm)
        if (res.code === 200) {
            list.value = res.data.list || []
            ElMessage.success('查询成功')
        }
    } catch (err) {
        ElMessage.error('请求失败')
    }
}


const exportData = async () => {
    if (!searchForm.childId) {
        ElMessage.warning("请输入儿童ID")
        return
    }

    try {
        const res = await exportLive({ childId: searchForm.childId })

        const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = "生活记录.xlsx"
        a.click()

        ElMessage.success("导出成功")
    } catch (e) {
        console.error(e)
        ElMessage.error("导出失败")
    }
}

const formatTime = (time) => {
    if (!time) return ''
    let date = new Date(time)
    let y = date.getFullYear()
    let m = (date.getMonth() + 1).toString().padStart(2, '0')
    let d = date.getDate().toString().padStart(2, '0')
    let hh = date.getHours().toString().padStart(2, '0')
    let mm = date.getMinutes().toString().padStart(2, '0')
    let ss = date.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

const handleDelete = async (row) => {
    await ElMessageBox.confirm(
        '确定删除这条记录吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    try {
        let formatTimeStr = formatTime(row.recordTime)
        await deleteLiveRecord({ childId: row.childId, recordTime: formatTimeStr })
        ElMessage.success('删除成功')
        getList()
    } catch (err) {
        ElMessage.error('删除失败')
    }
}

const handleEdit = (row) => {
    ElMessage.info('修改功能暂未开放')
}
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
</style> -->
<template>
    <div class="page-box">
        <div class="page-header">
            <h2>📋 每日生活记录查询</h2>
            <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>

        <div class="search-bar">
            <el-form inline>
                <el-form-item label="儿童ID">
                    <el-input v-model="searchForm.childId" placeholder="请输入儿童ID" />
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchLive, exportLive, deleteLiveRecord, updateLiveRecord } from '../../api/growth'

const searchForm = reactive({ childId: '', pageNum: 1 })
const list = ref([])
const editDailyId = ref(null)
const oldRow = ref(null)

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