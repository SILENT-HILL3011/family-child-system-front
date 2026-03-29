<template>
  <div class="home-page">
    <!-- 左侧边栏：功能模块 -->
    <aside class="sidebar">
      <div class="sidebar-title">功能菜单</div>
      <div 
        class="menu-item" 
        v-for="(item, index) in menuList" 
        :key="index" 
        @click="handleMenuClick(item)"
      >
        {{ item.name }}
      </div>
    </aside>

    <!-- 中间主内容区 -->
    <main class="main-content">
      <div class="top-bar">专家系统主页</div>
      <div class="content-area">
        <router-view />
      </div>
    </main>

    <!-- 左下角：退出登录 -->
    <div class="bottom-left">
      <el-button type="primary" @click="handleLogout">退出登录</el-button>
    </div>

    <!-- 右下角：收件箱 -->
    <div class="bottom-right">
      <el-button type="info" @click="handleInbox">收件箱</el-button>
    </div>

    <!-- ======================
         专家信息弹窗
         ====================== -->
    <el-dialog v-model="infoDialogVisible" title="专家信息管理" width="520px">
      <el-form label-width="100px" :model="infoForm">
        <el-form-item label="专家ID">
          <el-input v-model="infoForm.expertId" disabled />
        </el-form-item>
        <el-form-item label="专家姓名">
          <el-input v-model="infoForm.expertName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="infoForm.expertPhone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="infoForm.expertEmail" />
        </el-form-item>
        <el-form-item label="工作单位">
          <el-input v-model="infoForm.workPlace" />
        </el-form-item>
        <el-form-item label="专家类型">
          <el-select v-model="infoForm.expertType" placeholder="请选择类型">
            <el-option label="医生" value="医生" />
            <el-option label="老师" value="老师" />
            <el-option label="厨师" value="厨师" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="infoDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveExpertInfo">保存</el-button>
      </template>
    </el-dialog>

    <!-- ======================
         新增：体检发布弹窗（直接写在这里！）
         ====================== -->
    <el-dialog v-model="checkupDialogVisible" title="创建体检" width="500px">
      <el-form label-width="100px" :model="checkupForm">
        <el-form-item label="体检时间">
          <el-date-picker
            v-model="checkupForm.examinationTime"
            type="datetime"
            placeholder="选择体检时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="checkupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="checkupLoading" @click="submitCheckup">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchExpertInfo, updateExpertInfo, createPersonalExamination } from '../api/expert'

const router = useRouter()

// 菜单

const menuList = ref([
  { name: '专家信息管理', type: 'dialog' },
  { name: '体检发布', type: 'dialog' },
  { name: '实用工具', path: '/expert/tools' },
  { name: '用户咨询', path: '/expert/chat-list' }
])

// ==================
// 专家信息
// ==================
const infoDialogVisible = ref(false)
const infoForm = ref({})
const saving = ref(false)

// ==================
// 体检发布（新增）
// ==================
const checkupDialogVisible = ref(false)
const checkupForm = ref({
  examinationTime: ''
})
const checkupLoading = ref(false)

// ==================
// 菜单点击
// ==================
const handleMenuClick = async (item) => {
  if (item.name === '专家信息管理') {
    await loadExpertInfo()
    infoDialogVisible.value = true
  } else if (item.name === '体检发布') {
    // 打开体检弹窗
    checkupDialogVisible.value = true
  } else {
    router.push(item.path)
  }
}

// ==================
// 加载专家信息
// ==================
const loadExpertInfo = async () => {
  console.log("当前token =", localStorage.getItem('token'))
  try {
    const res = await searchExpertInfo()
    if (res.code === 200) {
      infoForm.value = { ...res.data }
    }
  } catch (e) {
    ElMessage.error('加载信息失败')
  }
}

// ==================
// 保存专家信息
// ==================
const saveExpertInfo = async () => {
  saving.value = true
  try {
    const res = await updateExpertInfo(infoForm.value)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      infoDialogVisible.value = false
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// ==================
// 提交体检（新增）
// ==================
const submitCheckup = async () => {
  if (!checkupForm.value.examinationTime) {
    return ElMessage.warning('请选择体检时间')
  }

  checkupLoading.value = true
  try {
    const res = await createPersonalExamination(checkupForm.value.examinationTime)
    if (res.code === 200) {
      ElMessage.success('创建体检成功')
      checkupDialogVisible.value = false
    } else {
      ElMessage.error(res.msg || '创建失败')
    }
  } catch (e) {
    ElMessage.error('请求失败')
  } finally {
    checkupLoading.value = false
  }
}

// ==================
// 退出 & 收件箱
// ==================
const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}

const handleInbox = () => {
  router.push('/expert/mail')
}
</script>

<style scoped>
/* 你的原有样式 100% 不变 */
.home-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
}

.sidebar {
  width: 220px;
  height: 100%;
  background: #f7f8fa;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
}

.sidebar-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.menu-item:hover {
  background: #e8f3ff;
  color: #409eff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 70px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 40px;
  overflow: auto;
}

.bottom-left {
  position: fixed;
  left: 30px;
  bottom: 30px;
}

.bottom-right {
  position: fixed;
  right: 30px;
  bottom: 30px;
}
</style>