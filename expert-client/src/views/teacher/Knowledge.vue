<template>
  <div class="knowledge-page">
    <!-- 标题 + 返回 -->
    <div class="page-header">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h1 class="page-title">知识维护</h1>
        <el-button type="primary" @click="goBack">← 返回上一页</el-button>
      </div>
      <p class="page-subtitle">管理儿童成长知识、年龄、学科</p>
    </div>

    <!-- 内容卡片 -->
    <div class="knowledge-card">
      <!-- 年龄 -->
      <div class="item-group">
        <label class="group-title">添加年龄</label>
        <div class="flex-row">
          <el-input v-model="ageText" placeholder="例如：3岁" style="width: 200px" />
          <el-button type="primary" @click="handleAddAge">确认添加</el-button>
        </div>
        <div class="tag-list">
          <el-tag v-for="item in ages" type="primary" class="tag">{{ item }}</el-tag>
        </div>
      </div>

      <!-- 学科 -->
      <div class="item-group">
        <label class="group-title">添加学科</label>
        <div class="flex-row">
          <el-input v-model="subText" placeholder="例如：语文" style="width: 200px" />
          <el-button type="primary" @click="handleAddSub">确认添加</el-button>
        </div>
        <div class="tag-list">
          <el-tag v-for="item in subjects" type="success" class="tag">{{ item }}</el-tag>
        </div>
      </div>

      <!-- 知识内容 -->
      <div class="item-group">
        <label class="group-title">知识内容管理</label>
        <div class="flex-row">
          <el-select v-model="cAge" placeholder="选择年龄" style="width: 130px">
            <el-option v-for="a in ages" :key="a" :label="a" :value="a" />
          </el-select>
          <el-select v-model="cSub" placeholder="选择学科" style="width: 130px">
            <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" @click="loadContent">查询内容</el-button>
          <el-button type="success" @click="contentDialog = true">新增内容</el-button>
        </div>

        <el-table :data="contentData" border style="width: 100%; margin-top: 15px">
          <el-table-column prop="name" label="知识名称" />
          <el-table-column prop="desc" label="知识描述" />
        </el-table>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog v-model="contentDialog" title="新增知识内容" width="500px">
      <el-select v-model="ca" placeholder="选择年龄" style="width: 100%; margin-bottom: 10px">
        <el-option v-for="a in ages" :label="a" :value="a" />
      </el-select>
      <el-select v-model="cs" placeholder="选择学科" style="width: 100%; margin-bottom: 10px">
        <el-option v-for="s in subjects" :label="s" :value="s" />
      </el-select>
      <el-input v-model="cname" placeholder="内容名称" style="margin-bottom: 10px" />
      <el-input v-model="cdesc" placeholder="内容描述" type="textarea" rows="3" />

      <template #footer>
        <el-button @click="contentDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddContent">确认添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import {
  ageList, addAge,
  subjectList, addSubject,
  contentList, addContent,
} from '../../api/expertTool'

const router = useRouter()
const goBack = () => router.go(-1)

// 年龄
const ageText = ref('')
const ages = ref([])

// 学科
const subText = ref('')
const subjects = ref([])

// 内容
const cAge = ref('')
const cSub = ref('')
const contentData = ref([])
const contentDialog = ref(false)
const ca = ref('')
const cs = ref('')
const cname = ref('')
const cdesc = ref('')

// 加载数据
onMounted(async () => {
  ages.value = (await ageList())?.data || []
  subjects.value = (await subjectList())?.data || []
})

// 1. 添加年龄
const handleAddAge = async () => {
  if (!ageText.value) return ElMessage.warning('请输入年龄')
  await addAge({ ageName: ageText.value })
  ages.value = (await ageList())?.data || []
  ageText.value = ''
}

// 2. 添加学科
const handleAddSub = async () => {
  if (!subText.value) return ElMessage.warning('请输入学科')
  await addSubject({ subName: subText.value })
  subjects.value = (await subjectList())?.data || []
  subText.value = ''
}

// 3. 加载内容
const loadContent = async () => {
  if (!cAge.value || !cSub.value) return ElMessage.warning('请选择年龄和学科')
  const res = await contentList({ age: cAge.value, subject: cSub.value })
  contentData.value = res?.data || []
}

// 4. 添加内容
const handleAddContent = async () => {
  if (!ca.value || !cs.value || !cname.value) return ElMessage.warning('请填写完整')
  await addContent({
    age: ca.value,
    subject: cs.value,
    name: cname.value,
    desc: cdesc.value
  })
  contentDialog.value = false
  loadContent()
  ca.value = ''
  cs.value = ''
  cname.value = ''
  cdesc.value = ''
}
</script>

<style scoped>
.knowledge-page {
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

.knowledge-card {
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