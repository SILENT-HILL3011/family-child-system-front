<template>
  <div class="register-container">
    <!-- 注册表单卡片 -->
    <el-card class="register-card">
      <div slot="header" class="card-header">
        <h2>用户注册</h2>
      </div>

      <!-- 注册表单 -->
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px"
        class="register-form">
        <!-- 手机号输入 -->
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="registerForm.phoneNumber" placeholder="请输入11位手机号" maxlength="11" clearable />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（6-20位）" show-password
            maxlength="20" clearable />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password
            maxlength="20" clearable />
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item class="btn-group">
          <el-button type="primary" @click="handleRegister" :loading="isLoading">
            注册
          </el-button>
          <!-- 可选：跳转到登录页（后续可扩展） -->
          <el-button link type="primary" @click="goToLogin">已有账号？去登录</el-button>
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
/* 1. 铺满整个屏幕，无空白、无滚动条、禁止拖动 */
.register-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  background-color: #f5f7fa;
  overflow: hidden;
  /* 禁止滚动条 + 禁止拖动页面 */
  position: fixed;
  /* 固定屏幕，不能拖动 */
  top: 0;
  left: 0;
}

/* 2. 注册卡片 */
.register-card {
  width: 450px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

/* 3. 表单 */
.register-form {
  margin-top: 20px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>