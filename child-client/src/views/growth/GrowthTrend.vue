<template>
  <div class="trend-page">
    <div class="container">
      <!-- 返回按钮 固定在左上角 永远能点到 -->
      <div class="back-btn" @click="goBack">← 返回成长档案</div>

      <div class="title">📊 成长趋势分析</div>

      <!-- 查询面板 -->
      <div class="query-box">
        <el-form :model="query" label-width="100px" inline>
          <el-form-item label="儿童ID">
            <el-input v-model="query.childId" style="width:220px" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="查询类型">
            <el-select v-model="query.type" style="width:160px">
              <el-option label="按日查询" value="day" />
              <el-option label="按周查询" value="week" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="loadData">查询并生成图表</el-button>
      </div>

      <!-- 按日 → 列表 -->
      <div v-if="query.type === 'day' && list.length" class="table-box">
        <el-table :data="list" border size="small" style="width:100%">
          <el-table-column label="日期" prop="recordDate" />
          <el-table-column label="身高(mm)" prop="height" />
          <el-table-column label="体重(g)" prop="weight" />
          <el-table-column label="头围(mm)" prop="headCirc" />
          <el-table-column label="识字" prop="chineseWordCount" />
          <el-table-column label="单词" prop="englishWordCount" />
          <el-table-column label="诗词" prop="poetryCount" />
        </el-table>
      </div>

      <!-- 按周 → 图表（缩小版） -->
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
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { searchGrowth } from '../../api/growth'

const router = useRouter()
const goBack = () => {
  router.push('/growth')
}

const query = ref({
  childId: '',
  type: 'week'
})

const list = ref([])
const loaded = ref(false)

const chartBody = ref(null)
const chartLearnBar = ref(null)
const chartLearnLine = ref(null)
const chartLearnPie = ref(null)

let myChartBody, myChartLearnBar, myChartLearnLine, myChartLearnPie

const initCharts = () => {
  if (!chartBody.value) return
  if (!myChartBody) myChartBody = echarts.init(chartBody.value)
  if (!myChartLearnBar) myChartLearnBar = echarts.init(chartLearnBar.value)
  if (!myChartLearnLine) myChartLearnLine = echarts.init(chartLearnLine.value)
  if (!myChartLearnPie) myChartLearnPie = echarts.init(chartLearnPie.value)
}

const loadData = async () => {
  const { childId, type } = query.value
  if (!childId) return ElMessage.warning('请输入儿童ID')

  const days = type === 'day' ? 1 : 7
  try {
    const res = await searchGrowth({ childId, days })
    if (res.code === 200) {
      list.value = res.data || []
      loaded.value = true
      await nextTick()

      if (type === 'week') {
        initCharts()
        renderAllCharts()
      }
    }
  } catch (e) {
    ElMessage.error('查询失败')
  }
}

const renderAllCharts = () => {
  const days = list.value.map(i => i.recordDate)
  const height = list.value.map(i => i.height || 0)
  const weight = list.value.map(i => i.weight || 0)
  const head = list.value.map(i => i.headCirc || 0)
  const cn = list.value.map(i => i.chineseWordCount || 0)
  const en = list.value.map(i => i.englishWordCount || 0)
  const poem = list.value.map(i => i.poetryCount || 0)

  const totalCn = cn.reduce((a, b) => a + b, 0)
  const totalEn = en.reduce((a, b) => a + b, 0)
  const totalPoem = poem.reduce((a, b) => a + b, 0)

  myChartBody.setOption({
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      { name: '身高', type: 'bar', data: height },
      { name: '体重', type: 'bar', data: weight },
      { name: '头围', type: 'bar', data: head }
    ]
  })

  myChartLearnBar.setOption({
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      { name: '识字', type: 'bar', data: cn },
      { name: '单词', type: 'bar', data: en },
      { name: '诗词', type: 'bar', data: poem }
    ]
  })

  myChartLearnLine.setOption({
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      { name: '识字', type: 'line', data: cn, smooth: true },
      { name: '单词', type: 'line', data: en, smooth: true },
      { name: '诗词', type: 'line', data: poem, smooth: true }
    ]
  })

  myChartLearnPie.setOption({
    series: [
      {
        type: 'pie',
        radius: '45%',
        data: [
          { name: '识字', value: totalCn },
          { name: '单词', value: totalEn },
          { name: '诗词', value: totalPoem }
        ]
      }
    ]
  })
}
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

/* 返回按钮 固定左上角 永远能点 */
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

/* 图表缩小到正常大小 */
.chart-mini {
  width: 100%;
  height: 260px;
}

.flex-1 {
  flex: 1;
}
</style>