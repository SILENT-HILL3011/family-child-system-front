<template>
  <div class="nutrient-page">
    <div class="page-header">
      <h2>🍚 营养成分查询</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="module-card">
      <div class="query-row">
        <el-select v-model="food1" placeholder="选择食物">
          <el-option v-for="item in foodList1" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="success" @click="loadNutrient">查询</el-button>
      </div>

      <div class="result-box">
        <div v-for="item in nutrientList" :key="item.name" class="result-item">
          {{ item.name }} → {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { queryNutrient, getNutrientFoodList } from '../../api/util'

const food1 = ref('')
const foodList1 = ref([])
const nutrientList = ref([])

onMounted(async () => {
  foodList1.value = (await getNutrientFoodList()).data || []
  loadNutrient()
})

const loadNutrient = async () => {
  const res = await queryNutrient({ food: food1.value })
  nutrientList.value = res.data || []
}
</script>

<style scoped>
.nutrient-page {
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