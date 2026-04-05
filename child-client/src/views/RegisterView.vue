<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <!-- 注册表单卡片 -->
    <el-card class="register-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>家庭育儿助手</h2>
          <p class="sub-title">新用户注册</p>
        </div>
      </template>

      <!-- 注册表单 -->
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px"
        class="register-form">
        <!-- 手机号输入 -->
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input 
            v-model="registerForm.phoneNumber" 
            placeholder="请输入11位手机号" 
            maxlength="11" 
            clearable
            size="large"
            prefix-icon="Phone"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码（6-20位）" 
            show-password
            maxlength="20" 
            clearable
            size="large"
            prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            show-password
            maxlength="20" 
            clearable
            size="large"
            prefix-icon="Lock"
          />
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item class="btn-group">
          <el-button 
            type="primary" 
            @click="handleRegister" 
            :loading="isLoading" 
            size="large"
            style="width: 100%"
          >
            注册
          </el-button>
        </el-form-item>

        <el-form-item class="login-link">
          <el-button type="text" @click="goToLogin">
            已有账号？立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userRegister } from '../api/user'
import router from '../router'

// 表单引用
const registerFormRef = ref(null)

// 加载状态
const isLoading = ref(false)

// 注册表单数据
const registerForm = ref({
  phoneNumber: '', // 手机号
  password: '',     // 密码
  confirmPassword: ''
})

const validatePasswordSame = (rule, value, callback) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单校验规则
const registerRules = ref({
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePasswordSame, trigger: 'blur' } // 密码一致校验
  ]
})

/**
 * 处理注册逻辑
 */
const handleRegister = async () => {
  // 先校验表单
  try {
    await registerFormRef.value.validate()
    isLoading.value = true

    // 调用注册接口
    const res = await userRegister({
      phoneNumber: registerForm.value.phoneNumber,
      password: registerForm.value.password
    })

    // 注册成功提示（可根据后端返回调整）
    ElMessage.success('注册成功！')
    console.log('注册成功返回数据：', res)

    // 注册成功后可跳转（比如跳转到登录页/首页）
    router.push('/login')

  } catch (error) {
    // 表单校验失败或接口请求失败
    console.error('注册失败：', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 跳转到登录页（预留方法，后续可扩展）
 */
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 全屏居中 + 温暖背景 */
.register-container {
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

/* 注册卡片：更大、更圆润、更稳重 */
.register-card {
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
.register-form {
  margin-top: 20px;
  padding: 0 20px;
}

.register-form :deep(.el-form-item__label) {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 40px;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 12px 16px;
}

.register-form :deep(.el-input__inner) {
  font-size: 15px;
  color: #333;
}

/* 按钮组 */
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

/* 登录链接 */
.login-link {
  text-align: center;
  padding-top: 10px;
}

.login-link :deep(.el-button--text) {
  color: #409eff;
  font-size: 14px;
}

.login-link :deep(.el-button--text:hover) {
  color: #66b1ff;
}
</style>