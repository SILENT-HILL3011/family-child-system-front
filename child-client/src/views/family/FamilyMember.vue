<template>
  <div class="member-page" style="padding: 30px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>家庭成员列表</h2>
      <el-button @click="goBack">返回用户中心</el-button>
    </div>

    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <span>页码：</span>
      <el-input v-model.number="pageNum" style="width: 120px" placeholder="输入页码" />
      <el-button type="primary" @click="getMemberList">查询</el-button>
    </div>

    <el-table :data="memberList" border style="width: 100%; margin-bottom: 20px;">
      <el-table-column label="成员ID" prop="memberId" />
      <el-table-column label="姓名" prop="memberName" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="辈分" prop="seniority" />
      <el-table-column label="角色" prop="role">
        <template #default="{ row }">
          {{ row.role === 1 ? '主力照料者' : '协同照料者' }}
        </template>
      </el-table-column>
      <el-table-column label="用户头像" align="center">
        <template #default="{ row }">
          <img :src="row.avatar ? '/api/child/file/avatar/' + row.avatar.split('/').pop() : '/default-avatar.png'"
            class="table-avatar" alt="头像" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="kickOutMember(row.memberId)" :disabled="row.role === 1">
            移除成员
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination v-model:current-page="pageNum" :page-size="10" :total="total"
      layout="total, prev, pager, next, jumper" @current-change="getMemberList" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchMemberList, kickOut } from '../../api/User'
import { el } from 'element-plus/es/locale/index.mjs'

const router = useRouter()

const memberList = ref([])
const pageNum = ref(1)
const total = ref(0)

const getMemberList = async () => {
  if (pageNum.value < 1) {
    ElMessage.warning('页码必须 ≥ 1')
    return
  }
  try {
    const res = await searchMemberList(pageNum.value)
    if (res.code === 200) {
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

const kickOutMember = async (memberId) => {
  try {
    await ElMessageBox.confirm('确定移除？')
    const res = await kickOut(memberId)
    ElMessage.success('移除成功')
    getMemberList()
  } catch (e) {
    ElMessage.info('取消')
  }
}

getMemberList()

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

.table-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}
</style>