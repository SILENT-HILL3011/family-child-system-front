<template>
  <div class="user-page">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="menu-item" @click="go('/home')">返回首页</div>
      <div class="menu-item" @click="openUpdateDialog">更新用户信息</div>
      <div class="menu-item" @click="createFamilyVisible = true">创建家庭</div>
      <div class="menu-item" @click="go('/family/member')">家庭成员</div>
      <div class="menu-item" @click="openInviteDialog">邀请成员</div>
    </div>

    <!-- 右侧内容 -->
    <div class="content">
      <h2>用户管理中心</h2>
      <p>请使用左侧功能菜单</p>
    </div>

    <!-- 更新用户信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="更新用户信息" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="form.userId" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" type="number" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sexText" placeholder="请选择">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="家庭状态">
          <el-select v-model="form.haveFamilyText" disabled>
            <el-option label="无家庭" value="无" />
            <el-option label="有家庭" value="有" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="form.mail" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdate">确认修改</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="createFamilyVisible" title="创建家庭" width="450px">
      <el-form :model="familyForm" label-width="80px" style="margin-top:20px;">
        <el-form-item label="家庭名称">
          <el-input v-model="familyForm.familyName" placeholder="请输入家庭名称" />
        </el-form-item>
        <el-form-item label="我的辈分">
          <el-input v-model="familyForm.seniority" placeholder="例如：父亲、母亲、儿子、女儿" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createFamilyVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreateFamily">确认创建</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="inviteVisible" title="邀请家庭成员" width="500px">
      <el-form :model="inviteForm" label-width="100px" style="margin-top:10px;">
        <el-form-item label="对方手机号">
          <el-input v-model="inviteForm.phoneNumber" placeholder="请输入被邀请人手机号" />
        </el-form-item>
        <el-form-item label="家庭ID">
          <el-input v-model="inviteForm.familyId" disabled placeholder="当前家庭ID" />
        </el-form-item>
        <el-form-item label="成员辈分">
          <el-input v-model="inviteForm.seniority" placeholder="例如：儿子、女儿、妻子、丈夫" />
        </el-form-item>
        <el-form-item label="成员角色">
          <el-select v-model="inviteForm.role" placeholder="请选择角色">
            <el-option label="协同照料者" :value="0" />
            <el-option label="主力照料者" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="inviteVisible = false">取消</el-button>
        <el-button type="primary" @click="doInvite">确认邀请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { getUserInfo, updateUserInfo, createFamily, inviteMember } from '../../api/user'
const router = useRouter()
const dialogVisible = ref(false)
const formRef = ref(null)
// 表单数据
const form = reactive({
  userId: '',
  phoneNumber: '',
  userName: '',
  age: '',
  sex: '',
  sexText: '',
  haveFamily: '',
  haveFamilyText: '',
  address: '',
  mail: ''
})

const inviteVisible = ref(false)
const inviteForm = reactive({
  phoneNumber: '',
  familyId: '',     
  seniority: '',
  role: 0          
})

const openInviteDialog = () => {
  const familyId = localStorage.getItem('familyId')
  if (!familyId) {
    ElMessage.warning('请先进入家庭成员页面获取家庭ID')
    return
  }
  inviteForm.familyId = familyId // 从你的用户信息里取
  inviteVisible.value = true
}

const doInvite = async () => {
  if (!inviteForm.phoneNumber) {
    ElMessage.warning('请输入对方手机号')
    return
  }
  if (!inviteForm.seniority) {
    ElMessage.warning('请输入成员辈分')
    return
  }

  try {
    const res = await inviteMember(inviteForm)
    if (res.code === 200) {
      ElMessage.success('邀请成功！')
      inviteVisible.value = false
      // 清空
      inviteForm.phoneNumber = ''
      inviteForm.seniority = ''
      inviteForm.role = 0
    } else {
      ElMessage.error(res.msg || '邀请失败')
    }
  } catch (err) {
    ElMessage.error('邀请请求失败')
  }
}

// 手机号正则
const phoneReg = /^1[3-9]\d{9}$/

// 邮箱正则
const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

// 表单校验规则
const rules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (rule, value, cb) => {
        if (!phoneReg.test(value)) cb(new Error('手机号格式不正确'))
        else cb()
      }, trigger: 'blur'
    }
  ],
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (rule, value, cb) => {
        if (!emailReg.test(value)) cb(new Error('邮箱格式不正确'))
        else cb()
      }, trigger: 'blur'
    }
  ]
}

// 跳转
const go = (path) => {
  router.push(path)
}

// 打开弹窗 + 查询用户信息
const openUpdateDialog = async () => {
  dialogVisible.value = true
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      const data = res.data
      form.userId = data.userId
      form.phoneNumber = data.phoneNumber
      form.userName = data.userName
      form.age = data.age
      form.sexText = data.sex === 1 ? '男' : '女'
      form.haveFamily = data.haveFamily
      form.haveFamilyText = data.haveFamily === 1 ? '有' : '无'
      form.address = data.address
      form.mail = data.mail
    }
  } catch (err) {
    ElMessage.error('获取用户信息失败')
  }
}

// 提交更新
const submitUpdate = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    const submitData = {
      userId: form.userId,
      phoneNumber: form.phoneNumber,
      userName: form.userName,
      age: form.age,
      sex: form.sexText === '男' ? 1 : 0,
      haveFamily: form.haveFamily,
      address: form.address,
      mail: form.mail
    }

    try {
      const res = await updateUserInfo(submitData)
      if (res.code === 200) {
        ElMessage.success('修改成功')
        dialogVisible.value = false
      } else {
        ElMessage.error(res.msg || '修改失败')
      }
    } catch (err) {
      ElMessage.error('请求失败')
    }
  })
}

const handleCreateFamily = async () => {
  try {
    const res = await createFamily({
      familyName: '老张家', // 你可以改成表单输入的值
      seniority: '父亲'
    })
    if (res.code === 200) {
      ElMessage.success('创建家庭成功！')
      // 可以在这里刷新家庭信息或跳转页面
    } else {
      ElMessage.error(res.msg || '创建家庭失败')
    }
  } catch (err) {
    ElMessage.error('请求失败')
  }
}

const createFamilyVisible = ref(false)

const familyForm = reactive({
  familyName: '',
  seniority: ''
})

const doCreateFamily = async () => {
  if (!familyForm.familyName || !familyForm.seniority) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    const res = await createFamily(familyForm)
    if (res.code === 200) {
      ElMessage.success('创建家庭成功！')
      createFamilyVisible.value = false
      // 清空
      familyForm.familyName = ''
      familyForm.seniority = ''
    } else {
      ElMessage.error(res.msg || '创建失败')
    }
  } catch (err) {
    ElMessage.error('创建家庭请求失败')
  }
}
</script>

<style scoped>
.user-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #f7f8fa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
}

.menu-item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.3s;
}

.menu-item:hover {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>