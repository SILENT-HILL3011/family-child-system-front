<template>
    <div class="login-container">
        <!-- 背景装饰 -->
        <div class="bg-decoration"></div>

        <el-card class="login-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <h2>家庭育儿助手</h2>
                    <p class="sub-title">守护孩子健康成长</p>
                </div>
            </template>

            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
                <!-- 手机号 -->
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="loginForm.phoneNumber" placeholder="请输入11位手机号" maxlength="11" clearable
                        size="large" prefix-icon="Phone" />
                </el-form-item>

                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
                        maxlength="20" clearable size="large" prefix-icon="Lock" />
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item class="btn-group">
                    <el-button type="primary" @click="handleLogin" :loading="isLoading" style="width: 100%"
                        size="large">
                        登录
                    </el-button>
                </el-form-item>

                <el-form-item class="register-link">
                    <el-button type="text" @click="goToRegister" style="font-size: 14px">
                        没有账号？去注册
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- Google 九宫格点选验证码弹窗 -->
        <el-dialog v-model="captchaVisible" title="安全验证" width="400px"
            :close-on-click-modal="false" :close-on-press-escape="false" center>
            <div style="text-align:center; margin-bottom:10px; font-weight:bold;">
                {{ captchaTip }}
            </div>
            <div class="grid-3x3">
                <div
                    v-for="(img, idx) in captchaImages"
                    :key="idx"
                    class="grid-item"
                    :class="{ selected: userSelect.includes(idx) }"
                    @click="toggleSelect(idx)"
                >
                    <img :src="img" alt="captcha" />
                </div>
            </div>
            <div style="text-align:center; margin-top:15px; display:flex; gap:10px; justify-content:center;">
                <el-button @click="refreshCaptcha">刷新</el-button>
                <el-button type="primary" @click="confirmCaptcha">确认验证</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { userLogin } from '../api/user'
import request from '../utils/request'

const router = useRouter()
const loginFormRef = ref(null)
const isLoading = ref(false)

// 登录表单
const loginForm = ref({
  phoneNumber: '',
  password: ''
})

// 九宫格验证码
const captchaVisible = ref(false)
const captchaKey = ref('')
const captchaTip = ref('')
const captchaImages = ref([])
const userSelect = ref([])

// 校验规则
const loginRules = ref({
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  await loginFormRef.value.validate()
  refreshCaptcha()
  captchaVisible.value = true
}

const refreshCaptcha = async () => {
  userSelect.value = []
  const { data } = await request.get('/captcha/get-image')
  captchaKey.value = data.captchaKey
  captchaTip.value = data.tip
  captchaImages.value = data.images
}

const toggleSelect = (idx) => {
  if (userSelect.value.includes(idx)) {
    userSelect.value = userSelect.value.filter(i => i !== idx)
  } else {
    userSelect.value.push(idx)
  }
}

const confirmCaptcha = async () => {
  if (userSelect.value.length === 0) {
    ElMessage.warning('请选择对应的图片')
    return
  }
  try {
    await request.post('/captcha/check-image', {
      captchaKey: captchaKey.value,
      userSelect: userSelect.value
    })
    captchaVisible.value = false
    isLoading.value = true

    const res = await userLogin({
      phoneNumber: loginForm.value.phoneNumber.trim(),
      password: loginForm.value.password.trim()
    })

    localStorage.setItem('token', res.data)
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (err) {
    ElMessage.error('验证失败或账号密码错误')
    refreshCaptcha()
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 50%);
  pointer-events: none;
}

.login-card {
  width: 480px;
  border-radius: 16px;
  background: #fff;
  z-index: 10;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  font-size: 24px;
  color: #1a3a69;
}

.sub-title {
  color: #666;
  font-size: 14px;
}

.login-form {
  margin-top: 20px;
}

.btn-group {
  padding-top: 10px;
}

.register-link {
  text-align: center;
}

/* 九宫格样式 */
.grid-3x3 {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 4px;
  justify-content: center;
}
.grid-item {
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  cursor: pointer;
  overflow: hidden;
  border-radius: 4px;
}
.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.grid-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}
</style>