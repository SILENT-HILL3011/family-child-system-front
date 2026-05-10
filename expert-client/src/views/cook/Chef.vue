<template>
  <div class="chef-page">
    <!-- 页面标题 + 返回首页 -->
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1 class="page-title">厨师模块</h1>
        <el-button type="primary" @click="goHome">← 返回首页</el-button>
      </div>
      <p class="page-subtitle">过敏原管理、营养成分维护、食谱数据维护</p>
    </div>

    <!-- 功能卡片 -->
    <div class="func-cards">
      <!-- 过敏原 + 营养维护 -->
      <div class="func-card" @click="goToDataManager">
        <div class="card-icon green-icon">
          <el-icon size="40"><Dish /></el-icon>
        </div>
        <div class="card-content">
          <h3 class="card-title">食材数据维护</h3>
          <p class="card-desc">过敏原、营养成分统一管理</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dish } from '@element-plus/icons-vue'

const router = useRouter()

// 进入数据维护页
const goToDataManager = () => router.push('/expert/chef/data-manager')

// 返回首页
const goHome = () => router.push('/home')
</script>

<style scoped>
.chef-page {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  min-height: 100%;
  padding: 20px;
  background: #f5f7fa;
  overflow-x: hidden;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 15px;
  color: #909399;
  margin: 0;
}

.func-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.func-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.func-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.green-icon { background: linear-gradient(135deg, #67c23a, #85e085); }

.card-content { flex: 1; }
.card-title { font-size: 20px; font-weight: 600; margin:0 0 6px; }
.card-desc { font-size:15px; color:#909399; margin:0; }
</style>