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

    <!-- Google 九宫格点选验证码（和用户端完全一样） -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { expertLogin } from '../api/expert'
import request from '../utils/request'

const router = useRouter()
const loading = ref(false)

// 专家登录表单
const form = ref({
  expertPhone: '',
  expertPassword: ''
})

// 验证码通用逻辑（和用户端一致）
const captchaVisible = ref(false)
const captchaKey = ref('')
const captchaTip = ref('')
const captchaImages = ref([])
const userSelect = ref([])

// 点击登录 → 先弹出验证码
const login = async () => {
  if (!form.value.expertPhone || !form.value.expertPassword) {
    return ElMessage.warning('手机号和密码不能为空')
  }
  // 先加载验证码
  await refreshCaptcha()
  captchaVisible.value = true
}

// 刷新验证码
const refreshCaptcha = async () => {
  userSelect.value = []
  try {
    const { data } = await request.get('/captcha/get-image')
    captchaKey.value = data.captchaKey
    captchaTip.value = data.tip
    captchaImages.value = data.images
  } catch (err) {
    ElMessage.error('验证码加载失败')
  }
}

// 切换选中格子
const toggleSelect = (idx) => {
  if (userSelect.value.includes(idx)) {
    userSelect.value = userSelect.value.filter(i => i !== idx)
  } else {
    userSelect.value.push(idx)
  }
}

// 验证通过 → 真正登录
const confirmCaptcha = async () => {
  if (userSelect.value.length === 0) {
    return ElMessage.warning('请选择对应的图片')
  }

  try {
    // 校验验证码
    await request.post('/captcha/check-image', {
      captchaKey: captchaKey.value,
      userSelect: userSelect.value
    })

    // 验证通过，关闭弹窗
    captchaVisible.value = false
    loading.value = true

    // 执行专家登录
    const res = await expertLogin(form.value)
    if (res.code === 200) {
      localStorage.setItem('token', res.data)
      ElMessage.success('登录成功')
      router.push('/home')
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (err) {
    ElMessage.error('验证失败或账号密码错误')
    refreshCaptcha()
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