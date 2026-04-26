<template>
  <div class="child-page" style="padding: 30px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>儿童信息列表</h2>
      <el-button @click="goBack">返回成长中心</el-button>
    </div>

    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <span>页码：</span>
      <el-input v-model.number="pageNum" style="width: 120px" placeholder="输入页码" />
      <el-button type="primary" @click="getList">查询</el-button>
    </div>

    <el-table :data="childList" border style="width: 100%; margin-bottom: 20px;">
      <el-table-column label="家庭" prop="familyName" />
      <el-table-column label="儿童姓名" prop="childName" />
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">
          {{ row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>

      <!-- ✅ 这里修复为驼峰 idNumber -->
      <el-table-column label="身份证号" prop="idNumber" />

      <el-table-column label="年龄" prop="age" />
      <el-table-column label="操作" width="100">
        <template #default="{row}">
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNum" :page-size="10" :total="total"
      layout="total, prev, pager, next, jumper" @current-change="getList" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchChildInfo, delChild } from '../../api/growth'

const router = useRouter()

const childList = ref([])
const pageNum = ref(1)
const total = ref(0)

const getList = async () => {

  try {
    const familyId = localStorage.getItem('familyId')
    if (!familyId) {
      ElMessage.warning('未获取到家庭ID')
      return
    }

    const res = await searchChildInfo({
      familyId: familyId
    })

    if (res.code === 200) {
      childList.value = res.data
    }
  } catch (err) {
    ElMessage.error('获取儿童信息失败')
  }
}

const handleDelete = async(row)=>{
  await ElMessageBox.confirm('删除后儿童信息及关联数据将无法恢复，确定删除吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  try {
    await delChild({ childId: row.childId })
    ElMessage.success('删除成功')
    getList()
  }catch (err) {
    ElMessage.error('删除失败')
  }
}

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