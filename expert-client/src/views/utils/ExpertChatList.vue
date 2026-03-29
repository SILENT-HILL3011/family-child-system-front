<template>
    <div class="chat-list-page">
        <!-- 返回按钮 -->
        <el-button type="primary" @click="goBack" style="margin-bottom: 20px;">
            ← 返回
        </el-button>

        <h3>用户咨询列表</h3>

        <!-- 空数据提示 -->
        <div v-if="messageList.length === 0" style="text-align:center; padding:40px; color:#999;">
            暂无用户咨询消息
        </div>

        <!-- 消息列表 -->
        <div class="message-item" v-for="item in messageList" :key="item.boardId">
            <div class="item-info">
                <p><strong>会话ID：</strong>{{ item.boardId }}</p>
                <p><strong>用户ID：</strong>{{ item.userId }}</p>
                <p><strong>消息数：</strong>{{ item.messageCount }}</p>
                <p><strong>状态：</strong>{{ item.isFinished === 1 ? '已完成' : '聊天中' }}</p>
            </div>
            <el-button type="success" size="default" @click="goChat(item.boardId)">
                进入聊天
            </el-button>
        </div>

        <!-- 完整分页 -->
        <el-pagination v-model:current-page="pageNum" :page-size="pageSize" :total="total" :current-page="pageNum"
            layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange" background />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchMessage } from '../../api/expertUtil'

const router = useRouter()

// 分页
const pageNum = ref(1)
const pageSize = ref(6)
const total = ref(0)
const messageList = ref([])

// 获取列表
const loadList = async () => {
    try {
        const res = await searchMessage(pageNum.value)
        if (res.code === 200) {
            messageList.value = res.data.list
            total.value = res.size || 0
            pageNum.value = res.pageNum || 1
            pageSize.value = res.pageSize || 6
        } else {
            ElMessage.error(res.msg || '加载失败')
        }
    } catch (err) {
        ElMessage.error('请求异常')
    }
}

// 切换页码
const handlePageChange = (val) => {
    pageNum.value = val
    loadList()
}

// 返回
const goBack = () => {
    router.go(-1)
}

const goChat = (boardId) => {
    router.push({
        path: '/expert/chat',
        query: { boardId }
    })
}

onMounted(() => {
    loadList()
})
</script>

<style scoped>
.chat-list-page {
    padding: 20px;
}

.message-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 18px;
    margin-bottom: 12px;
}

.item-info p {
    margin: 6px 0;
}
</style>