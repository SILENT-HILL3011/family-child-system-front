<template>
  <div class="schedule-page">
    <div class="page-header">
      <h2>📅 智能日程管理</h2>
      <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>

    <div class="calendar-box">
      <el-calendar v-model="selectedDate">
        <template #date-cell="{ data }">
          <!-- 🔥 点击事件写在这里，绑定在每一天上 -->
          <div class="date-cell" @click="!isBeforeToday(data.date) && handleDateClick(data.date)"
            :class="{ disabled: isBeforeToday(data.date) }">
            <span class="day">{{ data.day }}</span>

            <div v-if="hasImportantSchedule(formatDay(data.date))" class="red-dot"></div>

            <div v-if="getDayItem(formatDay(data.date))" class="schedule-info">
              <span class="type-text">{{ getFormText(getDayItem(formatDay(data.date)).form) }}</span>
              <span class="work-text">{{ getDayItem(formatDay(data.date)).work }}</span>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>

    <div class="tips" v-if="selectDay">
      ✅ 当前选中：{{ selectDay }}
    </div>

    <!-- ========== 创建日程弹窗 ========== -->
    <el-dialog v-model="dialogVisible" title="创建日程" width="450px" @close="resetForm">
      <el-form :model="form" label-width="80px">
        <el-form-item label="日程类型">
          <el-select v-model="form.scheduleForm" placeholder="请选择类型">
            <el-option label="健康" value="健康"></el-option>
            <el-option label="养育" value="养育"></el-option>
            <el-option label="发展" value="发展"></el-option>
            <el-option label="自定义" value="自定义"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="重要程度">
          <el-select v-model="form.importance" placeholder="请选择">
            <el-option label="重要" value="重要"></el-option>
            <el-option label="次要" value="次要"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-input v-model="form.date" disabled></el-input>
        </el-form-item>

        <el-form-item label="日程内容">
          <el-input v-model="form.work" placeholder="请输入内容（读书/运动等）"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getMonthSchedule, createSchedule } from '../../api/schedule'

const selectedDate = ref('')
const selectDay = ref('')
const monthScheduleList = ref([])
const dialogVisible = ref(false)
const isBeforeToday = (date) => {
  let now = dayjs().format('YYYY-MM-DD')
  return dayjs(date).isBefore(now)
}

// 表单
const form = ref({
  scheduleForm: '',
  importance: '',
  date: '',
  work: ''
})

// 重置表单
const resetForm = () => {
  form.value = {
    scheduleForm: '',
    importance: '',
    date: '',
    work: ''
  }
}

// 点击日期 → 打开弹窗
const handleDateClick = (date) => {
  const day = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  selectDay.value = day
  form.value.date = day
  dialogVisible.value = true  // 打开弹窗
}

// 格式化日期
const formatDay = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 加载日程
const loadMonthSchedule = async (month) => {
  try {
    const res = await getMonthSchedule({ month })
    if (res.code === 200) {
      monthScheduleList.value = res.data
    }
  } catch (err) {
    console.error('请求失败', err)
  }
}

// 切换月份刷新
watch(
  () => selectedDate.value,
  (newVal) => {
    if (newVal) {
      const month = dayjs(newVal).format('YYYY-MM')
      loadMonthSchedule(month)
    }
  },
  { immediate: true }
)

// 判断重要日程
const hasImportantSchedule = (date) => {
  return monthScheduleList.value.some(item => {
    return item.date.includes(date) && item.importance === 1
  })
}

// 获取当天日程
const getDayItem = (date) => {
  return monthScheduleList.value.find(item => {
    return item.date.includes(date)
  })
}

// 类型翻译
const getFormText = (form) => {
  const map = {
    1: '健康',
    2: '养育',
    3: '发展',
    4: '自定义'
  }
  return map[form] || '其他'
}

// ========== 提交创建日程 ==========
const submitCreate = async () => {
  if (!form.value.scheduleForm || !form.value.importance || !form.value.work) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    // 🔥 强制按后端接收的名字传参
    const params = {
      scheduleForm: form.value.scheduleForm, // 确保传递
      importance: form.value.importance,
      date: form.value.date,
      work: form.value.work
    }

    console.log("提交给后端的数据：", params) // 看控制台！

    let res = await createSchedule(params)
    ElMessage.success('创建成功！')
    dialogVisible.value = false
    loadMonthSchedule(dayjs(selectedDate.value).format('YYYY-MM'))
  } catch (err) {
    ElMessage.error('创建失败')
    console.error(err)
  }
}

onMounted(() => {
  selectedDate.value = dayjs().format('YYYY-MM-DD')
})
</script>

<style scoped>
.schedule-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.tips {
  margin-top: 15px;
  font-size: 16px;
  color: #333;
}

.date-cell {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 70px !important;
  padding: 4px;
  box-sizing: border-box;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.day {
  font-size: 14px;
  margin-bottom: 2px;
}

.red-dot {
  position: absolute !important;
  top: 6px !important;
  right: 6px !important;
  width: 7px !important;
  height: 7px !important;
  background: #ff4d4f !important;
  border-radius: 50% !important;
  z-index: 10 !important;
}

.schedule-info {
  font-size: 10px !important;
  line-height: 1.1 !important;
  text-align: center !important;
}

.type-text {
  color: #1989fa !important;
  font-weight: 500 !important;
  display: block !important;
}

.work-text {
  color: #666 !important;
  display: block !important;
}
.date-cell.disabled {
  background: #f5f5f5 !important;
  color: #ccc !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
</style>