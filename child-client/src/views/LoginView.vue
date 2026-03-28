<template>
    <div class="login-container">
        <el-card class="login-card">
            <div slot="header" class="card-header">
                <h2>用户登录</h2>
            </div>

            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
                <!-- 手机号 -->
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="loginForm.phoneNumber" placeholder="请输入11位手机号" maxlength="11" clearable />
                </el-form-item>

                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
                        maxlength="20" clearable />
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item class="btn-group">
                    <el-button type="primary" @click="handleLogin" :loading="isLoading" style="width: 100%">
                        登录
                    </el-button>
                </el-form-item>

                <el-form-item style="text-align: center">
                    <el-button type="text" @click="goToRegister">
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
import { userLogin } from '../api/user'

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

    const res = await userLogin({ 
      phoneNumber: phoneNumber.trim(),
      password: password.trim()
    })
    const token = res.data

    console.log("获取到的 token：", token);

    localStorage.setItem('token', token)
    ElMessage.success('登录成功')
    router.push('/home') // 跳首页

  } catch (err) {
    ElMessage.error('登录失败：手机号或密码错误')
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
/* 全屏居中 + 无滚动 + 不可拖动 */
.login-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

/* 登录卡片 */
.login-card {
    width: 420px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
}

.login-form {
    margin-top: 20px;
}

.btn-group {
    padding-top: 10px;
}
</style>