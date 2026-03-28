<template>
  <div style="padding: 30px; width: 100%; box-sizing: border-box; text-align: center;">
    <el-button @click="$router.back()" style="margin-bottom: 20px;">返回</el-button>
    <h2 style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 30px;">
      <span class="icon">🗓️</span> 0-6岁儿童疫苗接种时间轴
    </h2>


    <!-- 时间轴主体：纵向疫苗 + 连线 -->
    <div style="display: flex; justify-content: center; position: relative; max-width: 1200px; margin: 0 auto;">
      <!-- 中间竖线 -->
      <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: #e5e7eb; transform: translateX(-50%);"></div>

      <div style="width: 100%;">
        <div v-for="(group, idx) in timelineData" :key="idx" 
             style="display: flex; align-items: center; margin-bottom: 30px; position: relative;">
          
          <!-- 左侧：疫苗名称 -->
          <div style="width: 45%; text-align: right; padding-right: 20px;">
            <span style="font-size: 16px; font-weight: 500;">{{ group.vaccine }}</span>
          </div>

          <!-- 中间：圆点 + 连线 -->
          <div style="width: 10%; display: flex; justify-content: center; position: relative;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #409eff; z-index: 2;"></div>
            <div style="position: absolute; left: 50%; top: 12px; bottom: -30px; width: 2px; background: #e5e7eb; transform: translateX(-50%);"
                 v-if="idx !== timelineData.length - 1"></div>
          </div>

          <!-- 右侧：对应时间点 -->
          <div style="width: 45%; text-align: left; padding-left: 20px;">
            <el-tag :type="getTimeType(group.time)" size="small">{{ group.time }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const timePoints = [
  { label: '出生时', type: 'info' },
  { label: '1月龄', type: 'primary' },
  { label: '2月龄', type: 'success' },
  { label: '3月龄', type: 'warning' },
  { label: '4月龄', type: 'danger' },
  { label: '5月龄', type: 'info' },
  { label: '6月龄', type: 'primary' },
  { label: '8月龄', type: 'success' },
  { label: '9月龄', type: 'warning' },
  { label: '18月龄', type: 'danger' },
  { label: '2岁', type: 'info' },
  { label: '3岁', type: 'primary' },
  { label: '4岁', type: 'success' },
  { label: '6岁', type: 'warning' }
]

const timelineData = [
  { vaccine: '第1针卡介苗、第1针乙肝', time: '出生时' },
  { vaccine: '第2针乙肝', time: '1月龄' },
  { vaccine: '第1针脊灰、第1针百白破', time: '2月龄' },
  { vaccine: '第2针脊灰、第2针百白破', time: '3月龄' },
  { vaccine: '第3针脊灰、第3针百白破', time: '4月龄' },
  { vaccine: '第4针百白破', time: '5月龄' },
  { vaccine: '第3针乙肝、第1针A群流脑', time: '6月龄' },
  { vaccine: '第1针麻腮风、第1针乙脑', time: '8月龄' },
  { vaccine: '第2针A群流脑', time: '9月龄' },
  { vaccine: '第4针百白破、第2针麻腮风、第1针甲肝、第2针乙脑', time: '18月龄' },
  { vaccine: '第3针乙脑', time: '2岁' },
  { vaccine: '第1针A+C群流脑', time: '3岁' },
  { vaccine: '第4针脊灰', time: '4岁' },
  { vaccine: '第1针白破、第2针A+C群流脑', time: '6岁' }
]

const getTimeType = (time) => {
  const map = {
    '出生时': 'info',
    '1月龄': 'primary',
    '2月龄': 'success',
    '3月龄': 'warning',
    '4月龄': 'danger',
    '5月龄': 'info',
    '6月龄': 'primary',
    '8月龄': 'success',
    '9月龄': 'warning',
    '18月龄': 'danger',
    '2岁': 'info',
    '3岁': 'primary',
    '4岁': 'success',
    '6岁': 'warning'
  }
  return map[time] || 'info'
}
</script>

<style scoped>
.icon {
  font-size: 28px;
}
</style>