<template>
  <div class="mail-box">
    <div class="page-header">
      <!-- 返回上一页 -->
      <el-button @click="goBack">← 返回</el-button>
      <h2>📥 收件箱</h2>
      <el-button type="primary" @click="handleReadAll">一键全部已读</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isRead === 0 ? 'danger' : 'success'">
            {{ row.isRead === 0 ? '未读' : '已读' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sendUserId" label="发件人" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="createTime" label="发送时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="toDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="loadList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchMailList, readAllMail } from '../../api/mail'

const router = useRouter()
const tableData = ref([])
const pageNum = ref(1)
const total = ref(0)

// 加载列表
const loadList = async () => {
  const res = await searchMailList({ pageNum: pageNum.value })
  tableData.value = res.data.list
  total.value = res.data.total
}

// 去详情
const toDetail = (row) => {
  router.push({
    path: `/mail/detail/${row.id}`,
    query: {
      title: row.title,
      sendUserId: row.sendUserId,
      createTime: row.createTime
    }
  })
}

// 全部已读
const handleReadAll = async () => {
  await readAllMail()
  loadList()
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(() => loadList())
</script>

<style scoped>
.mail-box { padding: 20px; }
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}
</style>