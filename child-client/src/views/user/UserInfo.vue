<template>
  <div class="user-page">
    <div class="sidebar">
      <div class="menu-item" @click="go('/home')">返回首页</div>
      <div class="menu-item" @click="openUpdateDialog">更新用户信息</div>
      <div class="menu-item" @click="createFamilyVisible = true">创建家庭</div>
      <div class="menu-item" @click="go('/family/member')">家庭成员</div>
      <div class="menu-item" @click="openInviteDialog">邀请成员</div>
    </div>

    <div class="content">
      <h2>个人中心</h2>
      <div class="avatar-box">
        <img :src="avatarUrl" alt="头像" class="avatar" />
        <el-upload
          :action="`/api/child/file/upload/avatar`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="uploadHeaders"
        >
          <el-button type="primary" size="small">更换头像</el-button>
        </el-upload>
      </div>

      <div class="info-text">
        <p>用户名：{{ form.userName }}</p>
        <p>手机号：{{ form.phoneNumber }}</p>
        <p>性别：{{ form.sexText }}</p>
        <p>年龄：{{ form.age }}</p>
        <p>邮箱：{{ form.mail }}</p>
        <p>家庭状态：{{ form.haveFamilyText }}</p>
      </div>
    </div>

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
          <el-select v-model="form.sexText">
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
      <el-form :model="familyForm" label-width="80px">
        <el-form-item label="家庭名称">
          <el-input v-model="familyForm.familyName" />
        </el-form-item>
        <el-form-item label="我的辈分">
          <el-input v-model="familyForm.seniority" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createFamilyVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreateFamily">确认创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="inviteVisible" title="邀请家庭成员" width="500px">
      <el-form :model="inviteForm" label-width="100px">
        <el-form-item label="对方手机号">
          <el-input v-model="inviteForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="家庭ID">
          <el-input v-model="inviteForm.familyId" disabled />
        </el-form-item>
        <el-form-item label="成员辈分">
          <el-input v-model="inviteForm.seniority" />
        </el-form-item>
        <el-form-item label="成员角色">
          <el-select v-model="inviteForm.role">
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserInfo, updateUserInfo, createFamily, inviteMember } from '../../api/user'

const router = useRouter()
const dialogVisible = ref(false)
const formRef = ref(null)
const avatarUrl = ref('/default-avatar.png')
const uploadHeaders = ref({})

const form = reactive({
  userId: '',
  phoneNumber: '',
  userName: '',
  age: '',
  sexText: '',
  haveFamily: '',
  haveFamilyText: '',
  address: '',
  mail: '',
  avatar: ''
})

// ✅ 修复完成！正确路径
const handleAvatarSuccess = async (res) => {
  if (res.code === 200) {
    const avatarPath = res.data
    const fileName = avatarPath.split('/').pop()
    // ✅ 正确：/api/child/file/avatar/xxx.png
    avatarUrl.value = '/api/child/file/avatar/' + fileName
    form.avatar = avatarPath

    await updateUserInfo({
      userId: form.userId,
      avatar: avatarPath
    })
    ElMessage.success('头像更新成功')
  }
}

onMounted(async () => {
  uploadHeaders.value.token = localStorage.getItem('token') || ''
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
      form.avatar = data.avatar

      // ✅ 正确
      if (data.avatar) {
        const fileName = data.avatar.split('/').pop()
        avatarUrl.value = '/api/child/file/avatar/' + fileName
      }
    }
  } catch (err) {
    ElMessage.error('获取用户信息失败')
  }
})

const openUpdateDialog = () => {
  dialogVisible.value = true
}

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
      mail: form.mail,
      avatar: form.avatar
    }
    const res = await updateUserInfo(submitData)
    if (res.code === 200) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
    } else {
      ElMessage.error('修改失败')
    }
  })
}

const createFamilyVisible = ref(false)
const familyForm = reactive({
  familyName: '',
  seniority: ''
})

const doCreateFamily = async () => {
  const res = await createFamily(familyForm)
  if (res.code === 200) {
    ElMessage.success('创建家庭成功')
    createFamilyVisible.value = false
  }
}

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
    ElMessage.warning('请先获取家庭ID')
    return
  }
  inviteForm.familyId = familyId
  inviteVisible.value = true
}

const doInvite = async () => {
  const res = await inviteMember(inviteForm)
  if (res.code === 200) {
    ElMessage.success('邀请成功')
    inviteVisible.value = false
  }
}

const go = (path) => {
  router.push(path)
}

const phoneReg = /^1[3-9]\d{9}$/
const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

const rules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: (r, v, cb) => phoneReg.test(v) ? cb() : cb(new Error('手机号格式错误')), trigger: 'blur' }
  ],
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: (r, v, cb) => emailReg.test(v) ? cb() : cb(new Error('邮箱格式错误')), trigger: 'blur' }
  ]
}
</script>

<style scoped>
.user-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #fff;
}
.sidebar {
  width: 220px;
  background: #f7f8fa;
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
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}
.avatar-box {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #eee;
}
.info-text {
  font-size: 16px;
  line-height: 2;
}
</style>