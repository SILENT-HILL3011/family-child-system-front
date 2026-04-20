<template>
    <div class="family-page">
        <!-- 左侧菜单（按你要的5个功能+返回首页） -->
        <div class="sidebar">
            <div class="menu-item" @click="go('/home')">返回首页</div>
            <div class="menu-item" @click="openPublishDialog">发布任务</div>
            <div class="menu-item" @click="go('/family/task-list')">查看任务</div>
            <div class="menu-item" @click="go('/family/my-task')">查看我的任务</div>
            <div class="menu-item" @click="go('/family/moment')">家庭朋友圈</div>
            <!-- 权限分配 点击弹出弹窗 -->
            <div class="menu-item" @click="openPermissionDialog">权限分配</div>
        </div>

        <!-- 右侧空内容区域 -->
        <div class="content">
            <h2>家庭协同管理中心</h2>
            <p>请点击左侧菜单选择对应功能</p>
        </div>

        <el-dialog v-model="publishVisible" title="发布家庭任务" width="500px">
            <el-form :model="taskForm" label-width="100px" style="margin-top:20px;">
                <el-form-item label="任务名称">
                    <el-input v-model="taskForm.taskName" placeholder="请输入任务名称" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="publishVisible = false">取消</el-button>
                <el-button type="primary" @click="doPublishTask">确认发布</el-button>
            </template>
        </el-dialog>


        <el-dialog v-model="permissionVisible" title="权限分配" width="500px">
            <el-form label-width="100px" style="margin-top:20px;">
                <el-form-item label="手机号">
                    <el-input v-model="roleForm.phoneNumber" placeholder="请输入家庭成员手机号" maxlength="11" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="roleForm.role" placeholder="请选择角色" style="width:100%">
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
import { publishFamilyTask, changeRole } from '../../api/family'

const router = useRouter()

// 发布任务（你原来的）
const publishVisible = ref(false)
const taskForm = reactive({
    taskName: '',
    publishDate: ''
})

// 权限分配（新增）
const permissionVisible = ref(false)
const roleForm = reactive({
    phoneNumber: '',
    role: null
})

// 打开发布任务
const openPublishDialog = () => {
    publishVisible.value = true
}

// 打开权限弹窗
const openPermissionDialog = () => {
    roleForm.phoneNumber = ''
    roleForm.role = null
    permissionVisible.value = true
}

// 跳转
const go = (path) => {
    router.push(path)
}

// 发布任务（你原来的）
const doPublishTask = async () => {
    if (!taskForm.taskName) {
        ElMessage.warning('请输入任务名称')
        return
    }

    try {
        const now = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')

        const res = await publishFamilyTask({
            taskName: taskForm.taskName,
            publishDate: now
        })

        if (res.code === 200) {
            ElMessage.success('发布成功')
            publishVisible.value = false
            taskForm.taskName = ''
        } else {
            ElMessage.error(res.msg || '失败')
        }
    } catch (e) {
        ElMessage.error('请求失败')
    }
}


const doChangeRole = async () => {
    if (!roleForm.phoneNumber || roleForm.role === null || roleForm.role === '') {
        ElMessage.warning('请填写完整信息')
        return
    }

    try {
        const res = await changeRole({
            phoneNumber: roleForm.phoneNumber,
            role: roleForm.role
        })

        if (res.code === 200) {
            ElMessage.success('权限修改成功')
            permissionVisible.value = false
        } else {
            ElMessage.error(res.msg || '修改失败')
        }
    } catch (e) {
        ElMessage.error('请求失败')
    }
}
</script>

<style scoped>
/* 完全照搬你原有样式，一字不改 */
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
</style>