<template>
    <div class="consult-page">
        <!-- 左侧边栏 -->
        <div class="sidebar">
            <div class="menu-item" @click="go('/home')">返回首页</div>
            <div class="menu-item" :class="{ active: currentMenu === 'find' }" @click="currentMenu = 'find'">
                寻找专家
            </div>
            <div class="menu-item" :class="{ active: currentMenu === 'history' }" @click="goToHistory">
                历史咨询
            </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="content">
            <!-- 1. 寻找专家 -->
            <div v-if="currentMenu === 'find'" class="panel">
                <h2>寻找专家</h2>

                <el-radio-group v-model="type" style="margin-bottom:20px;">
                    <el-radio :label="1">医生</el-radio>
                    <el-radio :label="2">老师</el-radio>
                    <el-radio :label="3">厨师</el-radio>
                </el-radio-group>

                <div class="expert-list">
                    <div class="expert-card" v-for="expert in expertList" :key="expert.expertId">
                        <div class="expert-info">
                            <div class="expert-name">{{ expert.expertName }}</div>
                            <div class="expert-detail">
                                <p>ID：{{ expert.expertId }}</p>
                                <p>电话：{{ expert.expertPhone }}</p>
                                <p>工作单位：{{ expert.workPlace }}</p>
                            </div>
                        </div>
                        <el-button type="primary" size="small" @click="goToChat(expert)">
                            立即咨询
                        </el-button>
                    </div>
                </div>

                <div v-if="expertList.length === 0" class="empty-placeholder">
                    <p>暂无该类型专家</p>
                </div>
            </div>

            <!-- 2. 咨询专家 -->
            <div v-if="currentMenu === 'chat'" class="panel">
                <h2>咨询专家</h2>
                <div class="empty-placeholder">
                    <p>选择专家后可发起在线咨询</p>
                </div>
            </div>

            <!-- 3. 历史咨询 -->
            <div v-if="currentMenu === 'history'" class="panel">
                <h2>历史咨询</h2>
                <div class="empty-placeholder">
                    <p>展示历史咨询记录</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getExpertByType } from '../../api/consult'

const router = useRouter()
const currentMenu = ref('find')

const type = ref(1)
const expertList = ref([])

// ✅✅✅ 这里修复了！！！
const fetchExpertList = async () => {
    try {
        const res = await getExpertByType({ type: type.value })
        if (res.code === 200) {
            // 正确路径：res.data.list
            expertList.value = res.data.list || []
        }
    } catch (err) {
        ElMessage.error('获取专家信息失败')
    }
}

watch(type, fetchExpertList)
onMounted(fetchExpertList)

const go = (path) => {
    router.push(path)
}

const goToChat = (expert) => {
    router.push({
        path: '/consult/chat',
        query: {
            expertId: expert.expertId,
            expertName: expert.expertName,
            boardId: null // 第一次咨询，boardId 为 null
        }
    })
}
const goToHistory = () => {
  router.push('/consult/history')
}
</script>

<style scoped>
.consult-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    
}

.sidebar {
    width: 220px;
    background: #f7f8fa;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
}

.menu-item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: 0.3s;
}

.menu-item:hover {
    background: #409eff;
    color: #fff;
    border-color: #409eff;
}

.menu-item.active {
    background: #409eff;
    color: #fff;
    border-color: #409eff;
}

.content {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
}

.panel {
    max-width: 1000px;
}

.expert-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
}

.expert-card {
    background: #fff;
    padding: 18px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.expert-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
}

.expert-detail p {
    margin: 4px 0;
    font-size: 14px;
    color: #666;
}

.empty-placeholder {
    margin-top: 60px;
    text-align: center;
    color: #999;
    font-size: 16px;
}
</style>