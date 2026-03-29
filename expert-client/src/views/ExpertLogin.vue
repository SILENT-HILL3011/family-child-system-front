<template>
  <div class="page">
    <div class="box">
      <h2>专家端登录</h2>
      <el-form label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.expertPhone" placeholder="请输入注册手机号" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.expertPassword" type="password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" block :loading="loading" @click="login">
            立即登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="tip">
        还没有账号？
        <span class="link" @click="$router.push('/register')">去注册</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { expertLogin } from '../api/expert'

const router = useRouter()
const loading = ref(false)
const form = ref({
  expertPhone: '',
  expertPassword: ''
})

const login = async () => {
  if (!form.value.expertPhone || !form.value.expertPassword) {
    return ElMessage.warning('手机号和密码不能为空')
  }

  loading.value = true
  try {
    const res = await expertLogin(form.value)
    if (res.code === 200) {
      console.log("【登录成功】token =", res.data)

      // ✅ 正确存储：res.data 就是 token
      localStorage.setItem('token', res.data)

      console.log("【存储成功】读取 token =", localStorage.getItem('token'))

      // ✅ 延迟跳转，解决时序问题
      setTimeout(() => {
        ElMessage.success('登录成功')
        router.push('/home')
      }, 10)
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (err) {
    ElMessage.error('接口请求异常，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}
.tip {
  text-align: center;
  margin-top: 16px;
  color: #666;
}
.link {
  color: #409eff;
  cursor: pointer;
}
</style>