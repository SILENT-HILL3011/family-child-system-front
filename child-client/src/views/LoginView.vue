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
        <el-dialog v-model="captchaVisible" title="安全验证" width="340px" :close-on-click-modal="false"
            :close-on-press-escape="false" center>
            <div class="slider-captcha-box">
                <!-- 背景图 -->
                <img :src="captchaBg" class="captcha-bg" />
                <!-- 滑块 -->
                <img :src="captchaBlock" class="captcha-block" :style="{ top: `${captchaY}px`, left: `${blockX}px` }"
                    @mousedown="startDrag" />
            </div>

            <div style="text-align:center; margin-top:15px;">
                <el-button type="primary" @click="confirmCaptcha">完成验证</el-button>
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

// 滑动拼图弹窗
const captchaVisible = ref(false)
const captchaBg = ref('')
const captchaBlock = ref('')
const captchaY = ref(0)
const captchaKey = ref('')
const blockX = ref(0)
let startX = 0

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

// 点击登录 → 弹出拼图
const handleLogin = async () => {
  await loginFormRef.value.validate()

  // 获取滑动验证码
  const { data: res } = await request.get('/child/user/slider/get')
  captchaBg.value = res.bg
  captchaBlock.value = res.block
  captchaY.value = res.y
  captchaKey.value = res.key
  blockX.value = 0

  // 打开弹窗
  captchaVisible.value = true
}

// 滑块拖动
const startDrag = (e) => {
  startX = e.clientX - blockX.value
  document.onmousemove = (ev) => {
    let x = ev.clientX - startX
    x = Math.max(0, Math.min(x, 250))
    blockX.value = x
  }
  document.onmouseup = () => {
    document.onmousemove = null
  }
}

// 验证通过 → 真正登录
const confirmCaptcha = async () => {
  captchaVisible.value = false
  isLoading.value = true

  try {
    const res = await userLogin({
      phoneNumber: loginForm.value.phoneNumber.trim(),
      password: loginForm.value.password.trim(),
      captchaKey: captchaKey.value,
      moveX: blockX.value
    })

    localStorage.setItem('token', res.data)
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (err) {
    ElMessage.error('登录失败：验证失败或账号密码错误')
  } finally {
    isLoading.value = false
  }
}

// 去注册
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

/* 滑动拼图样式 */
.slider-captcha-box {
  position: relative;
  width: 300px;
  height: 180px;
  margin: 0 auto;
}

.captcha-bg {
  width: 100%;
  height: 100%;
  user-select: none;
}

.captcha-block {
  position: absolute;
  width: 50px;
  height: 50px;
  cursor: pointer;
  user-select: none;
}
</style>