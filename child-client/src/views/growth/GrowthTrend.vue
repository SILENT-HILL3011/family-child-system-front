<template>
  <div class="trend-page">
    <div class="container">
      <div class="back-btn" @click="goBack">← 返回成长档案</div>

      <div class="title">📊 成长趋势分析</div>

      <div class="query-box">
        <el-form :model="query" label-width="100px" inline>
          <el-form-item label="选择儿童">
            <el-select v-model="query.childId" style="width:220px" placeholder="请选择儿童">
              <el-option v-for="item in childList" :key="item.childId" :label="item.childName" :value="item.childId" />
            </el-select>
          </el-form-item>

          <el-form-item label="展示方式">
            <el-select v-model="query.type" style="width:160px">
              <el-option label="列表展示" value="day" />
              <el-option label="图形展示" value="week" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="loadData">查询并生成</el-button>

        <!-- 关键：v-if="list.length > 0" 有数据才显示 -->
        <el-button 
          v-if="list.length > 0" 
          type="success" 
          size="small" 
          icon="el-icon-download" 
          @click="handleExportGrowth"
          style="margin-left:10px"
        >
          导出Excel
        </el-button>
      </div>

      <div v-if="query.type === 'day' && list.length" class="table-box">
        <el-table :data="list" border size="small" style="width:100%">
          <el-table-column label="日期" prop="recordDate" :formatter="formatDate" />
          <el-table-column label="身高(cm)" prop="height">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.height" size="small" />
              <span v-else>{{ scope.row.height || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="体重(斤)" prop="weight">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.weight" size="small" />
              <span v-else>{{ scope.row.weight || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="头围(cm)" prop="headCirc">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.headCirc" size="small" />
              <span v-else>{{ scope.row.headCirc || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="识字" prop="chineseWordCount">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.chineseWordCount" size="small" />
              <span v-else>{{ scope.row.chineseWordCount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单词" prop="englishWordCount">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.englishWordCount" size="small" />
              <span v-else>{{ scope.row.englishWordCount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="诗词" prop="poetryCount">
            <template #default="scope">
              <el-input v-if="editId === scope.row.id" v-model="scope.row.poetryCount" size="small" />
              <span v-else>{{ scope.row.poetryCount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <div v-if="editId === scope.row.id">
                <el-button type="success" size="small" @click="submitEdit(scope.row)">提交</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="small" @click="toEdit(scope.row.id)">修改</el-button>
                <el-button type="danger" size="small" @click="delRow(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="query.type === 'week' && list.length" class="chart-wrapper">
        <div class="chart-item">
          <div ref="chartBody" class="chart-mini"></div>
        </div>
        <div class="chart-row">
          <div class="chart-item flex-1">
            <div ref="chartLearnBar" class="chart-mini"></div>
          </div>
          <div class="chart-item flex-1">
            <div ref="chartLearnLine" class="chart-mini"></div>
          </div>
        </div>
        <div class="chart-item">
          <div ref="chartLearnPie" class="chart-mini"></div>
        </div>
      </div>

      <div v-if="loaded && list.length === 0" style="padding:20px;color:#999;text-align:center">
        暂无成长数据
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

import { searchGrowth, updateGrowthTrend, deleteGrowthTrend,searchChildInfo,exportGrowth } from '../../api/growth'

const router = useRouter()
const goBack = () => { router.push('/growth') }

const query = ref({ childId: '', type: 'week' })
const list = ref([])
const loaded = ref(false)
const editId = ref('')
const childList = ref([])

const chartBody = ref(null)
const chartLearnBar = ref(null)
const chartLearnLine = ref(null)
const chartLearnPie = ref(null)

let myChartBody, myChartLearnBar, myChartLearnLine, myChartLearnPie

// 日期格式化
const formatDate = (row) => {
  if (!row || !row.recordDate) return ''
  const date = new Date(row.recordDate)
  if (isNaN(date.getTime())) return row.recordDate
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initCharts = () => {
  if (!chartBody.value) return
  myChartBody = echarts.init(chartBody.value)
  myChartLearnBar = echarts.init(chartLearnBar.value)
  myChartLearnLine = echarts.init(chartLearnLine.value)
  myChartLearnPie = echarts.init(chartLearnPie.value)
}

const loadData = async () => {
  const { childId, type } = query.value
  if (!childId) { ElMessage.warning('请输入儿童ID'); return }
  try {
    const res = await searchGrowth({ childId })
    if (res.code === 200) {
      list.value = res.data || []
      loaded.value = true
      await nextTick()
      if (type === 'week') { initCharts(); renderAllCharts() }
    }
  } catch (e) { ElMessage.error('查询失败') }
}

const toEdit = (id) => {
  editId.value = String(id)
}
const cancelEdit = () => { editId.value = '' }

// 提交：完全用你的 updateGrowthTrend
const submitEdit = async (row) => {
  try {
    const res = await updateGrowthTrend(row)
    if (res.code === 200) {
      ElMessage.success('修改成功')
      editId.value = ''
      loadData()
    }
  } catch (e) { ElMessage.error('修改失败') }
}

// 删除：用你的 deleteGrowthTrend
const delRow = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除？')
    const res = await deleteGrowthTrend({ id })
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (e) { ElMessage.error('删除失败') }
}

const renderAllCharts = () => {
  const days = list.value.map(i => formatDate(i))
  const height = list.value.map(i => i.height || 0)
  const weight = list.value.map(i => i.weight || 0)
  const head = list.value.map(i => i.headCirc || 0)
  const cn = list.value.map(i => i.chineseWordCount || 0)
  const en = list.value.map(i => i.englishWordCount || 0)
  const poem = list.value.map(i => i.poetryCount || 0)

  myChartBody.setOption({
    title: { text: '身体指标', left: 'center' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    legend: { data: ['身高(cm)', '体重(斤)', '头围(cm)'], bottom: 0 },
    series: [
      { name: '身高(cm)', type: 'bar', data: height },
      { name: '体重(斤)', type: 'bar', data: weight },
      { name: '头围(cm)', type: 'bar', data: head }
    ]
  })

  myChartLearnBar.setOption({
    title: { text: '学习数据', left: 'center' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    legend: { data: ['识字', '单词', '诗词'], bottom: 0 },
    series: [
      { name: '识字', type: 'bar', data: cn },
      { name: '单词', type: 'bar', data: en },
      { name: '诗词', type: 'bar', data: poem }
    ]
  })

  myChartLearnLine.setOption({
    title: { text: '学习趋势', left: 'center' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    legend: { data: ['识字', '单词', '诗词'], bottom: 0 },
    series: [
      { name: '识字', type: 'line', data: cn, smooth: true },
      { name: '单词', type: 'line', data: en, smooth: true },
      { name: '诗词', type: 'line', data: poem, smooth: true }
    ]
  })

  myChartLearnPie.setOption({
    title: { text: '学习占比', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', data: ['识字', '单词', '诗词'] },
    series: [{
      type: 'pie',
      radius: '45%',
      center: ['50%', '60%'],
      data: [
        { name: '识字', value: cn.reduce((a, b) => a + b, 0) },
        { name: '单词', value: en.reduce((a, b) => a + b, 0) },
        { name: '诗词', value: poem.reduce((a, b) => a + b, 0) }
      ]
    }]
  })
}

const handleExportGrowth = async () => {
  const childId = query.value.childId
  if (!childId) {
    ElMessage.warning('请先选择儿童')
    return
  }
  try {
    const res = await exportGrowth({ childId })
    const blob = new Blob([res], {
      type: 'application/vnd.ms-excel'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '成长记录_' + new Date().getTime() + '.xlsx'
    a.click()
    URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (err) {
    ElMessage.error('导出失败')
    console.error(err)
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
.trend-page {
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
  z-index: 999;
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 500;
}

.query-box {
  background: #fff;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #eee;
}

.table-box {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-row {
  display: flex;
  gap: 15px;
}

.chart-item {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.chart-mini {
  width: 100%;
  height: 260px;
}

.flex-1 {
  flex: 1;
}
</style>