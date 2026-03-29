<template>
  <div class="tools-page">
    <el-button type="primary" @click="goBack" style="margin-bottom:20px;"> ← 返回主页 </el-button>

    <div class="layout">
      <!-- 左侧菜单 -->
      <div class="left-menu">
        <el-menu
          default-active="allergy"
          router
          style="height:100%"
        >
          <el-menu-item index="/expert/tools/allergy">🥼 过敏识别</el-menu-item>
          <el-menu-item index="/expert/tools/recipe">🍽 食谱规划</el-menu-item>
          <el-menu-item index="/expert/tools/knowledge">🧠 知识图谱</el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容 -->
      <div class="right-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => router.go(-1)
</script>

<style scoped>
.tools-page { padding: 20px; }
.layout { display: flex; height: 550px; border:1px solid #eee; border-radius:8px; overflow:hidden; }
.left-menu { width: 200px; border-right:1px solid #eee; }
.right-content { flex:1; padding:20px; overflow-y:auto; }
</style>