<template>
  <div class="health-page">
    <div class="page-header">
      <h2>🏥 儿童健康问诊</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="health-box">
      <h3>第一步：选择症状</h3>
      <el-select v-model="selectedSymptom" placeholder="请选择症状" style="width: 230px; margin-right: 10px;">
        <el-option
          v-for="item in symptomList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button type="primary" @click="searchDisease">查询疾病</el-button>
    </div>

    <div class="health-box" v-if="diseaseList.length > 0">
      <h3>第二步：匹配疾病</h3>
      <div class="disease-list">
        <div
          class="disease-item"
          v-for="item in diseaseList"
          :key="item.name"
          @click="selectDisease(item)"
        >
          <div class="disease-name">{{ item.name }}</div>
          <div class="disease-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <div class="health-box" v-if="drugList.length > 0">
      <h3>第三步：推荐药品</h3>
      <div class="drug-list">
        <div class="drug-item" v-for="item in drugList" :key="item.name">
          <div class="drug-name">{{ item.name }}</div>
          <div class="drug-desc">功效：{{ item.desc }}</div>
          <div class="drug-desc">注意：{{ item.attention }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSymptomList, queryDisease, queryDrug } from '../../api/util'

const selectedSymptom = ref('')
const symptomList = ref([])
const diseaseList = ref([])
const drugList = ref([])

const loadSymptoms = async () => {
  const res = await getSymptomList()
  if (res.code === 200) {
    symptomList.value = res.data
  }
}

const searchDisease = async () => {
  if (!selectedSymptom.value) {
    ElMessage.warning('请选择症状')
    return
  }
  const res = await queryDisease({ symptom: selectedSymptom.value })
  if (res.code === 200) {
    diseaseList.value = res.data
    drugList.value = []
  }
}

const selectDisease = async (disease) => {
  const res = await queryDrug({ disease: disease.name })
  if (res.code === 200) {
    drugList.value = res.data
  }
}

onMounted(() => {
  loadSymptoms()
})
</script>

<style scoped>
.health-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.health-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.disease-list, .drug-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.disease-item, .drug-item {
  width: 220px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.disease-name, .drug-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.disease-desc, .drug-desc {
  font-size: 13px;
  color: #666;
}
</style>