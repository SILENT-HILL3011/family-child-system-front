<template>
    <div class="family-page">
        <!-- 左侧菜单 -->
        <div class="sidebar">
            <div class="menu-item" @click="go('/home')">返回首页</div>
            <div class="menu-item" @click="openPublishDialog">发布任务</div>
            <div class="menu-item" @click="loadTaskProgress">查看任务进度</div>
            <div class="menu-item" @click="go('/family/task-list')">查看任务</div>
            <div class="menu-item" @click="go('/family/my-task')">查看我的任务</div>
            <div class="menu-item" @click="go('/family/moment')">家庭朋友圈</div>
            <div class="menu-item" @click="openPermissionDialog">权限分配</div>
        </div>

        <!-- 右侧内容：直接展示任务进度 -->
        <div class="content">
            <h2>家庭协同管理中心</h2>

            <!-- 任务进度展示 -->
            <div class="task-wrapper" v-if="taskList.length > 0">
                <h3>📊 今日家庭任务完成情况</h3>
                <div class="task-list">
                    <div class="task-item" v-for="item in taskList" :key="item.taskId">
                        <div class="name">{{ item.memberName }}</div>
                        <div class="task">{{ item.taskName }}</div>
                        <div class="state">
                            <el-tag :type="item.isFinished === 1 ? 'success' : 'warning'">
                                {{ item.finishStatus }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="empty-tip" style="margin-top:20px;">
                点击左侧【查看任务进度】加载数据
            </div>
        </div>

        <!-- 发布任务弹窗 -->
        <el-dialog v-model="publishVisible" title="发布家庭任务" width="500px">
            <el-form :model="taskForm" label-width="100px">
                <el-form-item label="任务名称">
                    <el-input v-model="taskForm.taskName" placeholder="请输入任务名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="publishVisible = false">取消</el-button>
                <el-button type="primary" @click="doPublishTask">确认发布</el-button>
            </template>
        </el-dialog>

        <!-- 权限弹窗 -->
        <el-dialog v-model="permissionVisible" title="权限分配" width="500px">
            <el-form label-width="100px">
                <el-form-item label="手机号">
                    <el-input v-model="roleForm.phoneNumber" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="roleForm.role" style="width:100%">
                        <el-option label="主力照料者" :value="1"></el-option>
                        <el-option label="协同照料者" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="permissionVisible = false">取消</el-button>
                <el-button type="primary" @click="doChangeRole">确认修改</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { publishFamilyTask, changeRole, searchAllTask } from '../../api/family'

const router = useRouter()

// 从本地存储拿 familyId（你登录时一定存了）
const familyId = localStorage.getItem('familyId')

// 任务列表
const taskList = ref([])

// 发布任务
const publishVisible = ref(false)
const taskForm = reactive({ taskName: '' })

// 权限
const permissionVisible = ref(false)
const roleForm = reactive({ phoneNumber: '', role: null })

// 加载任务进度（自动带 familyId 参数）
const loadTaskProgress = async () => {
    if (!familyId) {
        ElMessage.warning('未获取到家庭信息')
        return
    }

    const res = await searchAllTask(familyId)
    if (res.code === 200) {
        taskList.value = res.data
        ElMessage.success('加载成功')
    } else {
        ElMessage.error('加载失败')
    }
}

// 跳转
const go = (path) => router.push(path)

// 打开弹窗
const openPublishDialog = () => publishVisible.value = true
const openPermissionDialog = () => {
    roleForm.phoneNumber = ''
    roleForm.role = null
    permissionVisible.value = true
}

// 发布任务
const doPublishTask = async () => {
    if (!taskForm.taskName) return ElMessage.warning('请输入任务名')
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const res = await publishFamilyTask({
        taskName: taskForm.taskName,
        publishDate: now
    })
    if (res.code === 200) {
        ElMessage.success('发布成功')
        publishVisible.value = false
        taskForm.taskName = ''
        loadTaskProgress() // 发布后自动刷新
    }
}

// 修改角色
const doChangeRole = async () => {
    if (!roleForm.phoneNumber || roleForm.role == null)
        return ElMessage.warning('请填写完整')

    const res = await changeRole({
        phoneNumber: roleForm.phoneNumber,
        role: roleForm.role
    })
    if (res.code === 200) {
        ElMessage.success('修改成功')
        permissionVisible.value = false
    }
}
</script>

<style scoped>
.family-page {
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

.content {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
}

.task-wrapper {
    max-width: 800px;
    margin: 0 auto;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.task-item {
    background: #f9f9f9;
    padding: 14px 18px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #eee;
}

.task-item .name {
    font-weight: bold;
    width: 120px;
}

.task-item .task {
    flex: 1;
}
</style>