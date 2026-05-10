<template>
  <div class="allergen-page">
    <div class="page-header">
      <h2>⚠️ 过敏原识别</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="module-card">
      <div class="query-row">
        <el-select v-model="food2" placeholder="选择食物">
          <el-option v-for="item in foodList2" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="warning" @click="loadAllergen">查询</el-button>
      </div>

      <div class="result-box">
        <div v-for="item in allergenList" :key="item.name" class="result-item">
          {{ item.name }} → {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { queryAllergen, getAllergenFoodList } from '../../api/util'

const food2 = ref('')
const foodList2 = ref([])
const allergenList = ref([])

onMounted(async () => {
  foodList2.value = (await getAllergenFoodList()).data || []
  loadAllergen()
})

const loadAllergen = async () => {
  const res = await queryAllergen({ food: food2.value })
  allergenList.value = res.data || []
}
</script>

<style scoped>
.allergen-page {
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