<template>
  <div class="knowledge-page">
    <div class="page-header">
      <h2>📚 儿童发育知识</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="module-card">
      <div class="query-row">
        <el-select v-model="age" placeholder="选择年龄">
          <el-option v-for="item in ageList" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="subject" placeholder="选择学科">
          <el-option v-for="item in subjectList" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" @click="loadKnowledge">查询</el-button>
      </div>

      <div class="result-box">
        <div v-for="item in knowledgeList" :key="item.name" class="result-item">
          {{ item.name }} → {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { queryKnowledge, getAges, getSubjects } from '../../api/util'

const age = ref('')
const subject = ref('')
const ageList = ref([])
const subjectList = ref([])
const knowledgeList = ref([])

onMounted(async () => {
  ageList.value = (await getAges()).data || []
  subjectList.value = (await getSubjects()).data || []
  loadKnowledge()
})

const loadKnowledge = async () => {
  const res = await queryKnowledge({ age: age.value, subject: subject.value })
  knowledgeList.value = res.data || []
}
</script>

<style scoped>
.knowledge-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.module-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px #00000010;
}

.query-row {
  display: flex;
  gap: 12px;
  margin: 15px 0;
}

.result-box {
  margin-top: 10px;
}

.result-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
</style>