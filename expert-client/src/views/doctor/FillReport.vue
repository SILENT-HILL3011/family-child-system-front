<template>
  <div class="fill-page">
    <div class="page-header">
      <h1 class="page-title">填写体检报告</h1>
      <p class="page-subtitle">请完成儿童体检各项指标录入</p>
    </div>

    <div class="form-wrapper">
      <el-form :model="form" label-width="120px">
        
        <el-form-item label="预约ID">
          <el-input v-model="form.appointId" disabled />
        </el-form-item>

        <el-form-item label="身高">
          <el-select v-model.number="form.height" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="体重">
          <el-select v-model.number="form.weight" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="头围">
          <el-select v-model.number="form.headCirc" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="视力">
          <el-select v-model.number="form.vision" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="听力">
          <el-select v-model.number="form.hearing" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="牙齿">
          <el-select v-model.number="form.tooth" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="心脏">
          <el-select v-model.number="form.heart" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="腹部">
          <el-select v-model.number="form.abdomen" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="四肢">
          <el-select v-model.number="form.limb" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="皮肤">
          <el-select v-model.number="form.skin" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="神经">
          <el-select v-model.number="form.nerve" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="异常" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="医生建议">
          <el-input v-model="form.suggestion" type="textarea" rows="3" placeholder="请输入建议" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">提交报告</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { putExamResult } from '../../api/expert'

const route = useRoute()
const router = useRouter()
const appointId = route.query.appointId

const form = ref({
  appointId: appointId || '',
  height: null,
  weight: null,
  headCirc: null,
  vision: null,
  hearing: null,
  tooth: null,
  heart: null,
  abdomen: null,
  limb: null,
  skin: null,
  nerve: null,
  suggestion: ''
})

const submit = async () => {
  if (!form.value.appointId) {
    ElMessage.warning('预约ID不能为空')
    return
  }

  try {
    const res = await putExamResult(form.value)
    if (res.code === 200) {
      ElMessage.success('提交成功')
      router.push('/expert/doctor/my-exam')
    }
  } catch (e) {
    ElMessage.error('提交失败')
  }
}

const goBack = () => {
  router.push('/expert/doctor/my-exam')
}
</script>

<style scoped>
.fill-page {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7fa;
  overflow-x: hidden;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  font-size: 15px;
  color: #909399;
}

.form-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
</style>