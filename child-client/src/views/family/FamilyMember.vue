<template>
  <div class="member-page" style="padding: 30px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>家庭成员列表</h2>
      <el-button @click="goBack">返回用户中心</el-button>
    </div>

    <!-- 页码输入查询 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <span>页码：</span>
      <el-input v-model.number="pageNum" style="width: 120px" placeholder="输入页码" />
      <el-button type="primary" @click="getMemberList">查询</el-button>
    </div>

    <!-- 成员表格 -->
    <el-table :data="memberList" border style="width: 100%; margin-bottom: 20px;">
      <el-table-column label="成员ID" prop="memberId" />
      <el-table-column label="家庭ID" prop="familyId" />
      <el-table-column label="姓名" prop="memberName" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="辈分" prop="seniority" />
      <el-table-column label="角色" prop="role">
        <template #default="{ row }">
          {{ row.role === 1 ? '主力照料者' : '协同照料者' }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination v-model:current-page="pageNum" :page-size="10" :total="total"
      layout="total, prev, pager, next, jumper" @current-change="getMemberList" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchMemberList } from '../../api/User'

const router = useRouter()

// 表格数据
const memberList = ref([])
// 页码（默认1）
const pageNum = ref(1)
// 总条数
const total = ref(0)

// 获取成员列表
const getMemberList = async () => {
  if (pageNum.value < 1) {
    ElMessage.warning('页码必须 ≥ 1')
    return
  }

  try {
    const res = await searchMemberList(pageNum.value)
    if (res.code === 200) {
      // ✅ 关键修复：只取数组 list
      memberList.value = res.data.list
      total.value = res.data.total
      if (memberList.value.length > 0) {
        const familyId = memberList.value[0].familyId
        localStorage.setItem('familyId', familyId)
      } else {
        localStorage.removeItem('familyId')
      }
    }
  } catch (err) {
    ElMessage.error('获取成员失败')
  }
}

// 初始加载第一页
getMemberList()

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.member-page {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}
</style>