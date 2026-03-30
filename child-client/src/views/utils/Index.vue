<template>
  <div style="padding: 30px; max-width: 1200px; margin: 0 auto;">
    <!-- 新增：返回上一页按钮 -->
    <div style="margin-bottom: 20px;">
      <el-button type="info" @click="goBack">← 返回上一页</el-button>
    </div>

    <h2 style="text-align:center; margin-bottom:30px;">儿童健康知识图谱系统</h2>

    <!-- 下面是你原来的三个模块代码，保持不变 -->
    <!-- 模块1：儿童发育知识 -->
    <div class="module-card">
      <h3>📚 儿童发育知识</h3>
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
        <div v-for="item in knowledgeList" :key="item?.name || Math.random()" class="result-item">
          {{ item?.name || '' }} → {{ item?.desc || '' }}
        </div>
      </div>
    </div>

    <!-- 模块2：营养成分 -->
    <div class="module-card">
      <h3>🍚 营养成分查询</h3>
      <div class="query-row">
        <el-select v-model="food1" placeholder="选择食物">
          <el-option v-for="item in foodList1" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="success" @click="loadNutrient">查询</el-button>
      </div>
      <div class="result-box">
        <div v-for="item in nutrientList" :key="item?.name || Math.random()" class="result-item">
          {{ item?.name || '' }} → {{ item?.desc || '' }}
        </div>
      </div>
    </div>

    <!-- 模块3：过敏原识别 -->
    <div class="module-card">
      <h3>⚠️ 过敏原识别</h3>
      <div class="query-row">
        <el-select v-model="food2" placeholder="选择食物">
          <el-option v-for="item in foodList2" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="warning" @click="loadAllergen">查询</el-button>
      </div>
      <div class="result-box">
        <div v-for="item in allergenList" :key="item?.name || Math.random()" class="result-item">
          {{ item?.name || '' }} → {{ item?.desc || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 引入路由
import {
  queryKnowledge, getAges, getSubjects,
  queryNutrient, getNutrientFoodList,
  queryAllergen, getAllergenFoodList
} from '../../api/util'

// 获取路由实例
const router = useRouter()

// 返回上一页方法
const goBack = () => {
  router.go(-1) // 等价于浏览器的后退按钮
}

// ============== 下面是你原来的 JS 代码，保持不变 ==============
const age = ref('')
const subject = ref('')
const ageList = ref([])
const subjectList = ref([])
const knowledgeList = ref([])

const food1 = ref('')
const foodList1 = ref([])
const nutrientList = ref([])

const food2 = ref('')
const foodList2 = ref([])
const allergenList = ref([])

onMounted(async () => {
  try {
    ageList.value = ((await getAges())?.data || []).filter(Boolean)
    subjectList.value = ((await getSubjects())?.data || []).filter(Boolean)
    foodList1.value = ((await getNutrientFoodList())?.data || []).filter(Boolean)
    foodList2.value = ((await getAllergenFoodList())?.data || []).filter(Boolean)

    loadKnowledge()
    loadNutrient()
    loadAllergen()
  } catch (err) {
    console.log("加载下拉列表失败", err)
  }
})

const loadKnowledge = async () => {
  const res = await queryKnowledge({ age: age.value, subject: subject.value })
  knowledgeList.value = (res?.data || []).filter(Boolean)
}

const loadNutrient = async () => {
  const res = await queryNutrient({ food: food1.value })
  nutrientList.value = (res?.data || []).filter(Boolean)
}

const loadAllergen = async () => {
  const res = await queryAllergen({ food: food2.value })
  allergenList.value = (res?.data || []).filter(Boolean)
}
</script>

<style scoped>
.module-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px #00000010;
}
.query-row {
  display: flex; gap: 12px; margin: 15px 0;
}
.result-box {
  margin-top: 10px;
}
.result-item {
  padding: 10px; border-bottom: 1px solid #f0f0f0;
}
</style>