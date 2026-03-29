<template>
  <div class="page">
    <div class="box">
      <h2>专家注册</h2>
      <el-form label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.expertPhone" placeholder="请输入专家手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.expertPassword" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" block :loading="loading" @click="register">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="tip">
        已有账号？
        <span class="link" @click="$router.push('/login')">去登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { expertRegister } from '../api/expert'

const router = useRouter()
const loading = ref(false)
const form = ref({
  expertPhone: '',
  expertPassword: ''
})

const register = async () => {
  if (!form.value.expertPhone || !form.value.expertPassword) {
    return ElMessage.warning('请填写完整信息')
  }

  loading.value = true
  try {
    const res = await expertRegister(form.value)
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.msg || '注册失败')
    }
  } catch (err) {
    ElMessage.error('注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 样式保持不变 */
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
}
.tip {
  text-align: center;
  margin-top: 16px;
}
.link {
  color: #409eff;
  cursor: pointer;
}
</style>