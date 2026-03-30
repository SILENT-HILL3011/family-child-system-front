<template>
  <div style="padding: 30px; max-width: 1200px; margin: 0 auto;">
    <el-button style="margin-bottom: 20px" @click="goBack">← 返回上一页</el-button>
    <h2 style="text-align: center; margin-bottom: 30px">专家端 - 图谱数据维护工具</h2>

    <!-- ====================== 知识模块 ====================== -->
    <el-card shadow="hover" style="margin-bottom: 25px">
      <template #header>🧠 儿童知识维护</template>

      <div style="margin: 15px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-input v-model="ageText" placeholder="年龄：如 3岁" />
          <el-button type="primary" @click="handleAddAge">添加年龄</el-button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag v-for="item in ages" type="primary" style="margin-bottom: 5px">{{ item }}</el-tag>
        </div>
      </div>

      <div style="margin: 15px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-input v-model="subText" placeholder="学科：如 语文" />
          <el-button type="primary" @click="handleAddSub">添加学科</el-button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag v-for="item in subjects" type="success" style="margin-bottom: 5px">{{ item }}</el-tag>
        </div>
      </div>

      <div style="margin: 20px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-select v-model="cAge" placeholder="年龄" style="width: 120px">
            <el-option v-for="a in ages" :key="a" :label="a" :value="a" />
          </el-select>
          <el-select v-model="cSub" placeholder="学科" style="width: 120px">
            <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" @click="loadContent">查询内容</el-button>
          <el-button type="success" @click="contentDialog = true">新增内容</el-button>
        </div>

        <el-table :data="contentData" border size="small">
          <el-table-column prop="name" label="内容名称" />
          <el-table-column prop="desc" label="描述" />
        </el-table>
      </div>
    </el-card>

    <!-- ====================== 过敏原模块 ====================== -->
    <el-card shadow="hover" style="margin-bottom: 25px">
      <template #header>🥜 过敏原维护</template>

      <div style="margin: 15px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-input v-model="foodText" placeholder="食物：如 芒果" />
          <el-button type="primary" @click="handleAddFood">添加食物</el-button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <el-tag v-for="item in foods" type="warning" style="margin-bottom: 5px">{{ item }}</el-tag>
        </div>
      </div>

      <div style="margin: 20px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-select v-model="aFood" placeholder="选择食物" style="width: 150px">
            <el-option v-for="f in foods" :key="f" :label="f" :value="f" />
          </el-select>
          <el-button type="primary" @click="loadAllergen">查询过敏原</el-button>
          <el-button type="success" @click="allergenDialog = true">新增过敏原</el-button>
        </div>

        <el-table :data="allergenData" border size="small">
          <el-table-column prop="name" label="过敏原" />
          <el-table-column prop="desc" label="说明" />
        </el-table>
      </div>
    </el-card>

    <!-- ====================== 营养模块 ====================== -->
    <el-card shadow="hover" style="margin-bottom: 25px">
      <template #header>🥚 营养成分维护</template>

      <div style="margin: 20px 0">
        <div style="display: flex; gap: 10px; margin-bottom: 10px">
          <el-select v-model="nFood" placeholder="选择食物" style="width: 150px">
            <el-option v-for="f in foods" :key="f" :label="f" :value="f" />
          </el-select>
          <el-button type="primary" @click="loadNutrient">查询营养</el-button>
          <el-button type="success" @click="nutrientDialog = true">新增营养</el-button>
        </div>

        <el-table :data="nutrientData" border size="small">
          <el-table-column prop="name" label="营养" />
          <el-table-column prop="desc" label="说明" />
        </el-table>
      </div>
    </el-card>

    <!-- ====================== 弹窗 ====================== -->
    <el-dialog v-model="contentDialog" title="新增内容" width="500px">
      <el-select v-model="ca" placeholder="年龄" style="width:100%;margin-bottom:10px">
        <el-option v-for="a in ages" :label="a" :value="a" />
      </el-select>
      <el-select v-model="cs" placeholder="学科" style="width:100%;margin-bottom:10px">
        <el-option v-for="s in subjects" :label="s" :value="s" />
      </el-select>
      <el-input v-model="cname" placeholder="内容名称" style="margin-bottom:10px" />
      <el-input v-model="cdesc" placeholder="描述" type="textarea" rows="3" />
      <template #footer>
        <el-button @click="contentDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddContent">确认添加</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="allergenDialog" title="新增过敏原" width="500px">
      <el-select v-model="af" placeholder="食物" style="width:100%;margin-bottom:10px">
        <el-option v-for="f in foods" :label="f" :value="f" />
      </el-select>
      <el-input v-model="aname" placeholder="过敏原名称" style="margin-bottom:10px" />
      <el-input v-model="adesc" placeholder="描述" type="textarea" rows="3" />
      <template #footer>
        <el-button @click="allergenDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddAllergen">确认添加</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="nutrientDialog" title="新增营养" width="500px">
      <el-select v-model="nf" placeholder="食物" style="width:100%;margin-bottom:10px">
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
import {
  ageList, addAge,
  subjectList, addSubject,
  contentList, addContent,
  foodList, addFood,
  allergenList, addAllergen,
  nutrientFoodList, nutrientList, addNutrient
} from '../../api/expertTool'

const router = useRouter()
const goBack = () => router.go(-1)

// ====================== 修复：变量重命名 ======================
const ageText = ref('')
const subText = ref('')
const ages = ref([])
const subjects = ref([])
const cAge = ref('')
const cSub = ref('')
const contentData = ref([])
const contentDialog = ref(false)
const ca = ref('')
const cs = ref('')
const cname = ref('')
const cdesc = ref('')

const foodText = ref('')
const foods = ref([])
const aFood = ref('')
const allergenData = ref([])
const allergenDialog = ref(false)
const af = ref('')
const aname = ref('')
const adesc = ref('')

const nFood = ref('')
const nutrientData = ref([])
const nutrientDialog = ref(false)
const nf = ref('')
const nname = ref('')
const ndesc = ref('')

onMounted(async () => {
  ages.value = (await ageList())?.data || []
  subjects.value = (await subjectList())?.data || []
  foods.value = (await foodList())?.data || []
})

// 年龄
const handleAddAge = async () => {
  await addAge({ ageName: ageText.value })
  ages.value = (await ageList())?.data || []
}

// 学科
const handleAddSub = async () => {
  await addSubject({ subName: subText.value })
  subjects.value = (await subjectList())?.data || []
}

// 内容
const loadContent = async () => {
  const res = await contentList({ age: cAge.value, subject: cSub.value })
  contentData.value = res?.data || []
}
const handleAddContent = async () => {
  await addContent({ age: ca.value, subject: cs.value, name: cname.value, desc: cdesc.value })
  contentDialog.value = false
  loadContent()
}

// 食物
const handleAddFood = async () => {
  await addFood({ foodName: foodText.value })
  foods.value = (await foodList())?.data || []
}

// 过敏原
const loadAllergen = async () => {
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
</style>