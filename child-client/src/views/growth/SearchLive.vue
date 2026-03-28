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
                <el-table-column label="记录类型" width="120" prop="time" />
                <el-table-column prop="food" label="饮食内容" />
                <el-table-column prop="sleepTime" label="睡眠时长" width="130" />
                <el-table-column label="记录时间" width="200">
                    <template #default="scope">
                        {{ formatTime(scope.row.recordTime) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { searchLive ,exportLive} from '../../api/growth'
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
</script>

<style scoped>
.page-box { padding: 30px; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.search-bar { margin-bottom: 20px; }
.table-box { background: #fff; padding: 20px; border-radius: 8px; }
</style>