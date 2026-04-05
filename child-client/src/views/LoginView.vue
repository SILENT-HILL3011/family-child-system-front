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
                    <el-input 
                        v-model="loginForm.phoneNumber" 
                        placeholder="请输入11位手机号" 
                        maxlength="11" 
                        clearable
                        size="large"
                        prefix-icon="Phone"
                    />
                </el-form-item>

                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input 
                        v-model="loginForm.password" 
                        type="password" 
                        placeholder="请输入密码" 
                        show-password
                        maxlength="20" 
                        clearable
                        size="large"
                        prefix-icon="Lock"
                    />
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item class="btn-group">
                    <el-button type="primary" @click="handleLogin" :loading="isLoading" style="width: 100%" size="large">
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
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { userLogin,getFamilyId } from '../api/user'

const router = useRouter()
const loginFormRef = ref(null)
const isLoading = ref(false)

// 登录表单
const loginForm = ref({
    phoneNumber: '',
    password: ''
})

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

// 登录逻辑
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    isLoading.value = true

    const { phoneNumber, password } = loginForm.value

    // 1. 登录获取token
    const res = await userLogin({
      phoneNumber: phoneNumber.trim(),
      password: password.trim()
    })
    const token = res.data
    localStorage.setItem('token', token)

    // 2. 登录成功后，自动获取familyId
    const familyRes = await getFamilyId()
    const familyId = familyRes.data
    localStorage.setItem('familyId', familyId) // 存入本地

    ElMessage.success('登录成功')
    console.log('token:', token)
    console.log('familyId:', familyId)

    // 跳转到首页
    router.push('/home')
  } catch (err) {
    ElMessage.error('登录失败：手机号或密码错误')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// 去注册页
const goToRegister = () => {
    router.push('/register')
}


</script>

<style scoped>
/* 全屏居中 + 温暖背景 */
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
    margin: 0;
    padding: 0;
}

/* 背景装饰（柔和不抢戏） */
.bg-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
    pointer-events: none;
}

/* 登录卡片：更大、更圆润、更稳重 */
.login-card {
    width: 480px;
    border-radius: 16px;
    border: none;
    background: #ffffff;
    z-index: 10;
}

/* 卡片头部：更有温度的标题 */
.card-header {
    text-align: center;
    padding: 10px 0;
}

.card-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1a3a69;
    letter-spacing: 2px;
}

.sub-title {
    margin: 8px 0 0;
    font-size: 14px;
    color: #666;
    font-weight: 400;
}

/* 表单样式：更大的输入框、更清晰的间距 */
.login-form {
    margin-top: 20px;
    padding: 0 20px;
}

.login-form :deep(.el-form-item__label) {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    line-height: 40px;
}

.login-form :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 12px 16px;
}

.login-form :deep(.el-input__inner) {
    font-size: 15px;
    color: #333;
}

/* 按钮组：更大的按钮、更柔和的主色 */
.btn-group {
    padding-top: 20px;
    margin-top: 10px;
}

.btn-group :deep(.el-button--primary) {
    background: #409eff;
    border-color: #409eff;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    height: 48px;
    transition: all 0.3s;
}

.btn-group :deep(.el-button--primary:hover) {
    background: #66b1ff;
    border-color: #66b1ff;
}

/* 注册链接：居中、更醒目 */
.register-link {
    text-align: center;
    padding-top: 10px;
}

.register-link :deep(.el-button--text) {
    color: #409eff;
    font-size: 14px;
}

.register-link :deep(.el-button--text:hover) {
    color: #66b1ff;
}
</style>