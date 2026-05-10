<template>
  <div class="chef-data-page">
    <!-- 标题 + 返回 -->
    <div class="page-header">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h1 class="page-title">食材数据维护</h1>
        <el-button type="primary" @click="goBack">← 返回上一页</el-button>
      </div>
      <p class="page-subtitle">管理食物、过敏原、营养成分</p>
    </div>

    <!-- 食物管理 -->
    <div class="data-card">
      <div class="item-group">
        <label class="group-title">食物管理</label>
        <div class="flex-row">
          <el-input v-model="foodText" placeholder="例如：芒果、鸡蛋" style="width: 200px" />
          <el-button type="primary" @click="handleAddFood">添加食物</el-button>
        </div>
        <div class="tag-list">
          <el-tag v-for="item in foods" type="warning" class="tag">{{ item }}</el-tag>
        </div>
      </div>

      <!-- 过敏原 -->
      <div class="item-group">
        <label class="group-title">过敏原管理</label>
        <div class="flex-row">
          <el-select v-model="aFood" placeholder="选择食物" style="width: 160px">
            <el-option v-for="f in foods" :key="f" :label="f" :value="f" />
          </el-select>
          <el-button type="primary" @click="loadAllergen">查询</el-button>
          <el-button type="success" @click="allergenDialog = true">新增过敏原</el-button>
        </div>
        <el-table :data="allergenData" border style="margin-top:10px">
          <el-table-column prop="name" label="过敏原" />
          <el-table-column prop="desc" label="说明" />
        </el-table>
      </div>

      <!-- 营养 -->
      <div class="item-group">
        <label class="group-title">营养成分管理</label>
        <div class="flex-row">
          <el-select v-model="nFood" placeholder="选择食物" style="width: 160px">
            <el-option v-for="f in foods" :key="f" :label="f" :value="f" />
          </el-select>
          <el-button type="primary" @click="loadNutrient">查询</el-button>
          <el-button type="success" @click="nutrientDialog = true">新增营养</el-button>
        </div>
        <el-table :data="nutrientData" border style="margin-top:10px">
          <el-table-column prop="name" label="营养成分" />
          <el-table-column prop="desc" label="说明" />
        </el-table>
      </div>
    </div>

    <!-- 弹窗：过敏原 -->
    <el-dialog v-model="allergenDialog" title="新增过敏原" width="500px">
      <el-select v-model="af" placeholder="选择食物" style="width:100%;margin-bottom:10px">
        <el-option v-for="f in foods" :label="f" :value="f" />
      </el-select>
      <el-input v-model="aname" placeholder="过敏原名称" style="margin-bottom:10px" />
      <el-input v-model="adesc" placeholder="描述" type="textarea" rows="3" />
      <template #footer>
        <el-button @click="allergenDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddAllergen">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗：营养 -->
    <el-dialog v-model="nutrientDialog" title="新增营养" width="500px">
      <el-select v-model="nf" placeholder="选择食物" style="width:100%;margin-bottom:10px">
        <el-option v-for="f in foods" :label="f" :value="f" />
      </el-select>
      <el-input v-model="nname" placeholder="营养名称" style="margin-bottom:10px" />
      <el-input v-model="ndesc" placeholder="描述" type="textarea" rows="3" />
      <template #footer>
        <el-button @click="nutrientDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddNutrient">确认添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import {
  foodList, addFood,
  allergenList, addAllergen,
  nutrientList, addNutrient
} from '../../api/expertTool'

const router = useRouter()
const goBack = () => router.go(-1)

// 食物
const foodText = ref('')
const foods = ref([])

// 过敏原
const aFood = ref('')
const allergenData = ref([])
const allergenDialog = ref(false)
const af = ref('')
const aname = ref('')
const adesc = ref('')

// 营养
const nFood = ref('')
const nutrientData = ref([])
const nutrientDialog = ref(false)
const nf = ref('')
const nname = ref('')
const ndesc = ref('')

onMounted(async () => {
  foods.value = (await foodList())?.data || []
})

// 食物
const handleAddFood = async () => {
  if (!foodText.value) return ElMessage.warning('请输入食物')
  await addFood({ foodName: foodText.value })
  foods.value = (await foodList())?.data || []
  foodText.value = ''
}

// 过敏原
const loadAllergen = async () => {
  if (!aFood.value) return ElMessage.warning('选择食物')
  const res = await allergenList({ food: aFood.value })
  allergenData.value = res?.data || []
}
const handleAddAllergen = async () => {
  await addAllergen({ food: af.value, name: aname.value, desc: adesc.value })
  allergenDialog.value = false
  loadAllergen()
}

// 营养
const loadNutrient = async () => {
  if (!nFood.value) return ElMessage.warning('选择食物')
  const res = await nutrientList({ food: nFood.value })
  nutrientData.value = res?.data || []
}
const handleAddNutrient = async () => {
  await addNutrient({ food: nf.value, name: nname.value, desc: ndesc.value })
  nutrientDialog.value = false
  loadNutrient()
}
</script>

<style scoped>
.chef-data-page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 25px;
}

.page-title {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}

.data-card {
  background: #fff;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.item-group {
  margin-bottom: 30px;
}

.group-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: #333;
}

.flex-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  margin-bottom: 5px;
}
</style>