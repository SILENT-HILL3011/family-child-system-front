<template>
  <div class="growth-page">
    <div class="center-box">
      <div class="back-btn" @click="goHome">返回首页</div>
      <h2>📈 成长档案与监测</h2>

      <div class="card-list">
        <!-- 1 -->
        <div class="card">
          <span class="icon">📝</span>
          <p>添加儿童</p>
          <el-button type="primary" @click="openAddDialog">进入</el-button>
        </div>
        <!-- 2 -->
        <div class="card">
          <span class="icon">🎯 </span>
          <p>查看儿童信息</p>
          <el-button type="primary" @click="goTo('/child-list')">进入</el-button>
        </div>
        <!-- 3 -->
        <div class="card">
          <span class="icon">🏆</span>
          <p>更新儿童信息</p>
          <el-button type="primary" @click="openUpdateDialog">进入</el-button>
        </div>
        <!-- 4 -->
        <div class="card">
          <span class="icon">📊 </span>
          <p>疫苗查询</p>
          <el-button type="primary" @click="goTo('/vaccine-query')">进入</el-button>
        </div>
        <!-- 5 -->
        <div class="card">
          <span class="icon">🧩</span>
          <p>查看今年未接种疫苗</p>
          <el-button type="primary" @click="openNoVaccineDialog">进入</el-button>
        </div>
        <!-- 6 -->
        <div class="card">
          <span class="icon">🧩</span>
          <p>更新疫苗记录</p>
          <el-button type="primary" @click="openVaccineDialog">进入</el-button>
        </div>
        <!-- 7 -->
        <div class="card">
          <span class="icon">🎁 </span>
          <p>接受体检</p>
          <el-button type="primary" @click="openExamineDialog">进入</el-button>
        </div>
        <!-- 8 -->
        <div class="card">
          <span class="icon">📚 </span>
          <p>每日记录</p>
          <el-button type="primary" @click="openLiveDialog">进入</el-button>
        </div>
        <!-- 9 -->
        <div class="card">
          <span class="icon">⚡</span>
          <p>查询记录</p>
          <el-button type="primary" @click="goTo('/search-live')">进入</el-button>
        </div>

        <!-- ================== 新加 10 ================== -->
        <div class="card">
          <span class="icon">📈</span>
          <p>生长发育记录</p>
          <el-button type="primary" @click="openGrowthDialog">进入</el-button>
        </div>

        <!-- ================== 新加 11 ================== -->
        <div class="card">
          <span class="icon">📉</span>
          <p>成长趋势查询</p>
          <el-button type="primary" @click="goTo('/growth-trend')">进入</el-button>
        </div>

      </div>
    </div>
  </div>

  <!-- 原来的所有弹窗 全部保留不动 -->
  <el-dialog v-model="addDialog" title="添加孩子信息" width="500px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="家庭ID">
        <el-input v-model="form.familyId" disabled placeholder="自动获取" />
      </el-form-item>
      <el-form-item label="孩子姓名">
        <el-input v-model="form.childName" placeholder="请输入孩子姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.idNumber" placeholder="请输入身份证号码" />
      </el-form-item>
      <!-- 新增出生日期 -->
      <el-form-item label="出生日期">
        <el-input v-model="form.birthDate" placeholder="格式：yyyy-MM-dd" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="addDialog = false">取消</el-button>
      <el-button type="primary" @click="submitAdd">确认添加</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="updateIdDialog" title="编辑儿童信息" width="450px">
    <el-input v-model="editChildId" placeholder="请输入儿童ID" style="margin-bottom:10px" />
    <template #footer>
      <el-button @click="updateIdDialog = false">取消</el-button>
      <el-button type="primary" @click="getChildInfoForEdit">下一步</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialog" title="编辑儿童信息" width="550px">
  <el-form :model="editForm" label-width="100px">
    <el-form-item label="儿童ID">
      <el-input v-model="editForm.childId" disabled />
    </el-form-item>
    <el-form-item label="孩子姓名">
      <el-input v-model="editForm.childName" />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="editForm.sex">
        <el-option label="男" :value="1" />
        <el-option label="女" :value="0" />
      </el-select>
    </el-form-item>
    <el-form-item label="家庭ID">
      <el-input v-model="editForm.familyId" disabled />
    </el-form-item>
    <el-form-item label="年龄">
      <el-input v-model="editForm.age" />
    </el-form-item>
    <el-form-item label="身份证号">
      <el-input v-model="editForm.idNumber" />
    </el-form-item>

    <!-- 身高体重头围 -->
    <el-form-item label="身高">
      <el-input v-model.number="editForm.height" />
    </el-form-item>
    <el-form-item label="体重">
      <el-input v-model.number="editForm.weight" />
    </el-form-item>
    <el-form-item label="头围">
      <el-input v-model.number="editForm.headCirc" />
    </el-form-item>

    <!-- 识字、单词、诗词 -->
    <el-form-item label="认字数">
      <el-input v-model.number="editForm.chineseWordCount" />
    </el-form-item>
    <el-form-item label="单词数">
      <el-input v-model.number="editForm.englishWordCount" />
    </el-form-item>
    <el-form-item label="诗词数">
      <el-input v-model.number="editForm.poetryCount" />
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="editDialog = false">取消</el-button>
    <el-button type="primary" @click="submitEdit">保存修改</el-button>
  </template>
</el-dialog>

  <el-dialog v-model="vaccineDialog" title="更新疫苗接种记录" width="500px">
    <el-form label-width="100px">
      <el-form-item label="儿童ID">
        <el-input v-model="vaccineForm.childId" placeholder="请输入儿童ID" />
      </el-form-item>
      <el-form-item label="疫苗名称">
        <el-input v-model="vaccineForm.vaccine" placeholder="请输入疫苗信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="vaccineDialog = false">取消</el-button>
      <el-button type="primary" @click="submitVaccine">确认更新</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="noVaccineDialog" title="今年未接种疫苗" width="600px">
    <div v-if="noVaccineList.length === 0" style="text-align:center; padding:40px; color:#999;">
      暂无未接种疫苗 ✅
    </div>
    <div v-else style="padding:20px;">
      <div v-for="(name, idx) in noVaccineList" :key="idx"
        style="padding:10px; border-bottom:1px solid #eee; font-size:16px;">
        • {{ name }}
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="noVaccineDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="examineDialog" title="🏥 接受体检预约" width="520px" center>
    <div style="padding: 25px 15px 15px;">
      <el-form label-width="100px">
        <el-form-item label="儿童ID">
          <el-input v-model="examineForm.childId" placeholder="请输入儿童ID" style="width: 280px" />
        </el-form-item>
        <el-form-item label="医生ID">
          <el-input v-model="examineForm.doctorId" placeholder="请输入医生ID" style="width: 280px" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="examineDialog = false; resetExamine()">关闭</el-button>
      <el-button type="primary" @click="doExamineAppoint">确认预约</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="liveDialog" title="📝 每日生活记录" width="540px" center>
    <div style="padding: 20px">
      <el-form label-width="100px">
        <el-form-item label="儿童ID">
          <el-input v-model="liveForm.childId" placeholder="请输入" style="width:280px" />
        </el-form-item>
        <el-form-item label="记录类型">
          <el-select v-model="liveForm.time" placeholder="请选择" style="width:280px">
            <el-option label="早饭" :value="1" />
            <el-option label="午饭" :value="2" />
            <el-option label="午休" :value="3" />
            <el-option label="晚饭" :value="4" />
            <el-option label="晚休" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="饮食内容" v-if="[1, 2, 4].includes(liveForm.time)">
          <el-input v-model="liveForm.food" placeholder="请输入饮食" style="width:280px" />
        </el-form-item>
        <el-form-item label="睡眠时长" v-if="[3, 5].includes(liveForm.time)">
          <el-input v-model.number="liveForm.sleepTime" placeholder="请输入小时" style="width:280px" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="liveDialog = false">取消</el-button>
      <el-button type="primary" @click="submitLive">提交记录</el-button>
    </template>
  </el-dialog>

  <!-- ================== 新加弹窗1：生长发育记录 ================== -->
  <el-dialog v-model="growthDialog" title="📈 生长发育记录" width="520px" center>
    <div style="padding:20px">
      <el-form label-width="120px">
        <el-form-item label="儿童ID">
          <el-input v-model="growthForm.childId" placeholder="请输入儿童ID" style="width:300px" />
        </el-form-item>
        <el-form-item label="身高(mm)">
          <el-input v-model.number="growthForm.height" placeholder="可不填" style="width:300px" />
        </el-form-item>
        <el-form-item label="体重(g)">
          <el-input v-model.number="growthForm.weight" placeholder="可不填" style="width:300px" />
        </el-form-item>
        <el-form-item label="头围(mm)">
          <el-input v-model.number="growthForm.headCirc" placeholder="可不填" style="width:300px" />
        </el-form-item>
        <el-form-item label="新增识字">
          <el-input v-model.number="growthForm.chineseWordCount" placeholder="0" style="width:300px" />
        </el-form-item>
        <el-form-item label="新增单词">
          <el-input v-model.number="growthForm.englishWordCount" placeholder="0" style="width:300px" />
        </el-form-item>
        <el-form-item label="新增诗词">
          <el-input v-model.number="growthForm.poetryCount" placeholder="0" style="width:300px" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="growthDialog = false">取消</el-button>
      <el-button type="primary" @click="submitGrowth">提交记录</el-button>
    </template>
  </el-dialog>

  

</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/home')
const goTo = (path) => {
  router.push(path)
}
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 引入你所有接口
import {
  addChild,
  searchChildInfoById,
  updateChildInfo,
  updateVaccine,
  searchVaccineThisYear,
  appointExamination,
  recordLive,
  recordGrowth,
  searchGrowth
} from '../../api/growth';

// ================== 原有功能全部保留 ==================
const addDialog = ref(false)
const form = ref({ familyId: '', childName: '', sex: 1, idNumber: '', birthDate: '' })
const openAddDialog = () => {
  form.value.familyId = localStorage.getItem('familyId') || ''
  addDialog.value = true
}
const submitAdd = async () => {
  if (!form.value.childName || !form.value.idNumber) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await addChild(form.value)
    ElMessage.success('添加成功')
    addDialog.value = false
  } catch (err) {
    ElMessage.error('添加失败')
  }
}

const updateIdDialog = ref(false)
const editDialog = ref(false)
const editChildId = ref('')
const editForm = ref({
  childId: '', childName: '', sex: 1, familyId: '', idNumber: '', status: 1,
  chineseWordCount: '', englishWordCount: '', poetryCount: '', healthCondition: '', dietaryStatus: ''
})
const openUpdateDialog = () => { updateIdDialog.value = true }
const getChildInfoForEdit = async () => {
  if (!editChildId.value) return ElMessage.warning('请输入儿童ID')
  try {
    const res = await searchChildInfoById({ childId: editChildId.value })
    if (res.code === 200) {
      editForm.value = res.data
      updateIdDialog.value = false
      editDialog.value = true
    } else ElMessage.error('未找到儿童信息')
  } catch (err) { ElMessage.error('查询失败') }
}
const submitEdit = async () => {
  try {
    await updateChildInfo(editForm.value)
    ElMessage.success('更新成功')
    editDialog.value = false
  } catch (err) { ElMessage.error('更新失败') }
}

const vaccineDialog = ref(false)
const vaccineForm = ref({ childId: '', vaccine: '' })
const openVaccineDialog = () => {
  vaccineForm.value = { childId: '', vaccine: '' }
  vaccineDialog.value = true
}
const submitVaccine = async () => {
  const { childId, vaccine } = vaccineForm.value
  if (!childId || !vaccine) return ElMessage.warning('请填写完整')
  try {
    await updateVaccine({ childId, vaccine })
    ElMessage.success('更新成功')
    vaccineDialog.value = false
  } catch (e) { ElMessage.error('失败') }
}

const noVaccineDialog = ref(false)
const noVaccineList = ref([])
const openNoVaccineDialog = async () => {
  const childId = prompt('请输入儿童ID：')
  if (!childId) return
  try {
    const res = await searchVaccineThisYear({ childId })
    noVaccineList.value = res.data || []
    noVaccineDialog.value = true
  } catch (e) { ElMessage.error('失败') }
}

const examineDialog = ref(false)
const examineForm = ref({ childId: '', doctorId: '' })
const examineResult = ref(null)
const openExamineDialog = () => { examineDialog.value = true }
const doExamineAppoint = async () => {
  const { childId, doctorId } = examineForm.value
  if (!childId || !doctorId) return ElMessage.warning('请填写完整')
  try {
    const res = await appointExamination(examineForm.value)
    if (res.code === 200) {
      examineResult.value = res.data
      ElMessage.success('预约成功')
      examineDialog.value = false
    }
  } catch (e) { ElMessage.error('失败') }
}
const resetExamine = () => { examineForm.value = { childId: '', doctorId: '' } }

const liveDialog = ref(false)
const liveForm = ref({ childId: '', time: '', food: '', sleepTime: '' })
const openLiveDialog = () => {
  liveForm.value = { childId: '', time: '', food: '', sleepTime: '' }
  liveDialog.value = true
}
const submitLive = async () => {
  const { childId, time, food, sleepTime } = liveForm.value
  if (!childId || !time) return ElMessage.warning('请填写完整')
  if ([1, 2, 4].includes(time) && !food) return ElMessage.warning('请填写饮食')
  if ([3, 5].includes(time) && !sleepTime) return ElMessage.warning('请填写睡眠')
  try {
    const params = { childId, time, food: [1, 2, 4].includes(time) ? food : '', sleepTime: [3, 5].includes(time) ? sleepTime : null }
    await recordLive(params)
    ElMessage.success('记录成功')
    liveDialog.value = false
  } catch (e) { ElMessage.error('失败') }
}

// ================== 新加：生长发育记录 ==================
const growthDialog = ref(false)
const growthForm = ref({
  childId: '', height: null, weight: null, headCirc: null,
  chineseWordCount: 0, englishWordCount: 0, poetryCount: 0
})
const openGrowthDialog = () => {
  growthForm.value = { childId: '', height: null, weight: null, headCirc: null, chineseWordCount: 0, englishWordCount: 0, poetryCount: 0 }
  growthDialog.value = true
}
const submitGrowth = async () => {
  if (!growthForm.value.childId) return ElMessage.warning('请输入儿童ID')
  try {
    await recordGrowth(growthForm.value)
    ElMessage.success('记录成功（同一天自动更新）')
    growthDialog.value = false
  } catch (e) { ElMessage.error('提交失败') }
}


</script>

<style scoped>
.growth-page {
  width: 100vw;
  height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.center-box {
  width: 100%;
  max-width: 1200px;
  /* 变宽 */
  text-align: center;
}

.back-btn {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background: #f0f0f0;
}

.center-box h2 {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 500;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 4列 */
  gap: 20px;
  padding: 0 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 35px 10px;
  border: 1px solid #eee;
}

.icon {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

.card p {
  font-size: 16px;
  font-weight: 500;
}
</style>