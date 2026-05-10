<template>
  <div class="disease-manager-page">
    <!-- 头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="primary" @click="goBack">← 返回</el-button>
        <h2>疾病知识图谱维护</h2>
      </div>
    </div>

    <!-- 内容 -->
    <div class="tool-layout">
      <!-- 左侧菜单 -->
      <div class="tool-sidebar">
        <div class="side-item" :class="{active: tab === 1}" @click="tab=1">疾病管理</div>
        <div class="side-item" :class="{active: tab === 2}" @click="tab=2">症状管理</div>
        <div class="side-item" :class="{active: tab === 3}" @click="tab=3">药品管理</div>
        <div class="side-item" :class="{active: tab === 4}" @click="tab=4">关系维护</div>
      </div>

      <!-- 右侧内容 -->
      <div class="tool-content">
        <!-- 疾病 -->
        <div v-if="tab === 1">
          <div class="tool-card">
            <h3>新增疾病</h3>
            <el-form :model="diseaseForm" label-width="100px" size="small">
              <el-form-item label="疾病名称"><el-input v-model="diseaseForm.name" /></el-form-item>
              <el-form-item label="疾病描述"><el-input v-model="diseaseForm.desc" type="textarea" /></el-form-item>
              <el-form-item label="适用年龄"><el-input v-model="diseaseForm.suitAge" /></el-form-item>
            </el-form>
            <el-button type="primary" @click="doAddDisease">保存疾病</el-button>
          </div>

          <div class="tool-card">
            <h3>疾病查询</h3>
            <el-select v-model="diseaseName" placeholder="选择疾病" style="width:250px;">
              <el-option v-for="name in diseaseNameList" :key="name" :label="name" :value="name" />
            </el-select>
            <el-button type="success" @click="loadDiseaseInfo" style="margin-left:10px;">查询</el-button>
            <div class="result-box" v-if="currentDisease">
              <div>描述：{{ currentDisease.desc }}</div>
              <div>适用年龄：{{ currentDisease.suitAge }}</div>
            </div>
          </div>
        </div>

        <!-- 症状 -->
        <div v-if="tab === 2">
          <div class="tool-card">
            <h3>新增症状</h3>
            <el-form :model="symptomForm" label-width="100px" size="small">
              <el-form-item label="症状名称"><el-input v-model="symptomForm.name" /></el-form-item>
              <el-form-item label="症状描述"><el-input v-model="symptomForm.desc" type="textarea" /></el-form-item>
            </el-form>
            <el-button type="primary" @click="doAddSymptom">保存症状</el-button>
          </div>
        </div>

        <!-- 药品 -->
        <div v-if="tab === 3">
          <div class="tool-card">
            <h3>新增药品</h3>
            <el-form :model="drugForm" label-width="100px" size="small">
              <el-form-item label="药品名称"><el-input v-model="drugForm.name" /></el-form-item>
              <el-form-item label="药品说明"><el-input v-model="drugForm.desc" type="textarea" /></el-form-item>
              <el-form-item label="注意事项"><el-input v-model="drugForm.attention" type="textarea" /></el-form-item>
            </el-form>
            <el-button type="primary" @click="doAddDrug">保存药品</el-button>
          </div>
        </div>

        <!-- 关系维护 -->
        <div v-if="tab === 4">
          <div class="tool-card">
            <h3>疾病 → 症状</h3>
            <el-select v-model="relate.disease" placeholder="选择疾病" style="width:200px;margin-right:10px;">
              <el-option v-for="name in diseaseNameList" :key="name" :label="name" :value="name" />
            </el-select>
            <el-select v-model="relate.symptom" placeholder="选择症状" style="width:200px;margin-right:10px;">
              <el-option v-for="name in symptomNameList" :key="name" :label="name" :value="name" />
            </el-select>
            <el-button type="warning" @click="doRelateSymptom">关联</el-button>
          </div>

          <div class="tool-card">
            <h3>疾病 → 药品</h3>
            <el-select v-model="relate.disease" placeholder="选择疾病" style="width:200px;margin-right:10px;">
              <el-option v-for="name in diseaseNameList" :key="name" :label="name" :value="name" />
            </el-select>
            <el-select v-model="relate.drug" placeholder="选择药品" style="width:200px;margin-right:10px;">
              <el-option v-for="name in drugNameList" :key="name" :label="name" :value="name" />
            </el-select>
            <el-button type="danger" @click="doRelateDrug">关联</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 完全匹配你文件里的导出名称！！！
import {
  diseaseList,
  addDisease,
  getDisease,
  symptomList,
  addSymptom,
  drugList,
  addDrug,
  relateSymptom,
  relateDrug
} from '../../api/expertTool'

const router = useRouter()
const tab = ref(1)
const goBack = () => router.back()

// ================== 疾病 ==================
const diseaseNameList = ref([])
const diseaseName = ref('')
const diseaseForm = reactive({ name: '', desc: '', suitAge: '' })
const currentDisease = ref(null)

// ================== 症状 ==================
const symptomNameList = ref([])
const symptomForm = reactive({ name: '', desc: '' })

// ================== 药品 ==================
const drugNameList = ref([])
const drugForm = reactive({ name: '', desc: '', attention: '' })

// ================== 关系 ==================
const relate = reactive({ disease: '', symptom: '', drug: '' })

onMounted(async () => {
  diseaseNameList.value = (await diseaseList()).data || []
  symptomNameList.value = (await symptomList()).data || []
  drugNameList.value = (await drugList()).data || []
})

// 保存疾病
const doAddDisease = async () => {
  if (!diseaseForm.name || !diseaseForm.desc) return ElMessage.warning('请填写完整')
  const res = await addDisease(diseaseForm)
  if (res?.code === 200) {
    ElMessage.success('保存成功')
    Object.assign(diseaseForm, { name: '', desc: '', suitAge: '' })
    diseaseNameList.value = (await diseaseList()).data || []
  }
}

// 查询疾病
const loadDiseaseInfo = async () => {
  if (!diseaseName.value) return ElMessage.warning('请选择疾病')
  const res = await getDisease({ name: diseaseName.value })
  currentDisease.value = res?.data?.[0] || null
}

// 保存症状
const doAddSymptom = async () => {
  if (!symptomForm.name) return ElMessage.warning('请填写名称')
  const res = await addSymptom(symptomForm)
  if (res?.code === 200) {
    ElMessage.success('保存成功')
    Object.assign(symptomForm, { name: '', desc: '' })
    symptomNameList.value = (await symptomList()).data || []
  }
}

// 保存药品
const doAddDrug = async () => {
  if (!drugForm.name) return ElMessage.warning('请填写名称')
  const res = await addDrug(drugForm)
  if (res?.code === 200) {
    ElMessage.success('保存成功')
    Object.assign(drugForm, { name: '', desc: '', attention: '' })
    drugNameList.value = (await drugList()).data || []
  }
}

// 关联症状
const doRelateSymptom = async () => {
  if (!relate.disease || !relate.symptom) return ElMessage.warning('请选择')
  const res = await relateSymptom({ diseaseName: relate.disease, symptomName: relate.symptom })
  if (res?.code === 200) ElMessage.success('关联成功')
}

// 关联药品
const doRelateDrug = async () => {
  if (!relate.disease || !relate.drug) return ElMessage.warning('请选择')
  const res = await relateDrug({ diseaseName: relate.disease, drugName: relate.drug })
  if (res?.code === 200) ElMessage.success('关联成功')
}
</script>

<style scoped>
.disease-manager-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.tool-layout {
  display: flex;
  gap: 20px;
}

.tool-sidebar {
  width: 180px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.side-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 8px;
}

.side-item.active {
  background: #e8f3ff;
  color: #409eff;
}

.tool-content {
  flex: 1;
}

.tool-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.result-box {
  margin-top: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  line-height: 1.8;
}
</style>