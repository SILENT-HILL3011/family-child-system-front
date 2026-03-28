<template>
  <div class="child-page" style="padding: 30px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>儿童信息列表</h2>
      <el-button @click="goBack">返回成长中心</el-button>
    </div>

    <!-- 页码输入查询 → 和你家页面完全一样 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <span>页码：</span>
      <el-input v-model.number="pageNum" style="width: 120px" placeholder="输入页码" />
      <el-button type="primary" @click="getList">查询</el-button>
    </div>

    <!-- 儿童表格 -->
    <el-table :data="childList" border style="width: 100%; margin-bottom: 20px;">
        <el-table-column label="儿童id" prop="childId" />
        <el-table-column label="家庭id" prop="familyId" />
      <el-table-column label="儿童姓名" prop="childName" />
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">
          {{ row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" prop="idNumber" />
      <el-table-column label="年龄" prop="age" />
    </el-table>

    <!-- 分页组件 → 完全一样 -->
    <el-pagination v-model:current-page="pageNum" :page-size="10" :total="total"
      layout="total, prev, pager, next, jumper" @current-change="getList" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchChildInfo } from '../../api/growth'

const router = useRouter()

const childList = ref([])
const pageNum = ref(1)
const total = ref(0)

const getList = async () => {
  if (pageNum.value < 1) {
    ElMessage.warning('页码必须 ≥ 1')
    return
  }

  try {
    const familyId = localStorage.getItem('familyId')
    if (!familyId) {
      ElMessage.warning('未获取到家庭ID')
      return
    }

    const res = await searchChildInfo({
      familyId: familyId,
      pageNum: pageNum.value
    })

    if (res.code === 200) {
      childList.value = res.data.list
      total.value = res.data.total
    }
  } catch (err) {
    ElMessage.error('获取儿童信息失败')
  }
}

// 加载第一页
getList()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.child-page {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}
</style>