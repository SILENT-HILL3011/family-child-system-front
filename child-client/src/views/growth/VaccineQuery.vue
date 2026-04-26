<template>
    <div style="padding: 30px; width: 100%; box-sizing: border-box">
        <div style="margin-bottom: 20px">
            <el-button @click="$router.back()">返回成长中心</el-button>
        </div>

        <div style="display: flex; gap: 20px; align-items: flex-start">
            <div class="card">
                <span class="icon">🗓️</span>
                <p>疫苗时间轴</p>
                <el-button type="primary" @click="goTo('/vaccine-timeline')">进入</el-button>
            </div>

            <div style="flex:1">
                <h3>查询儿童疫苗</h3>
                
                <el-select 
                    v-model="childId" 
                    placeholder="请选择儿童"
                    style="width:300px; margin-right:10px"
                >
                    <el-option
                        v-for="item in childList"
                        :key="item.childId"
                        :label="item.childName"
                        :value="item.childId"
                    />
                </el-select>

                <el-button type="primary" @click="getVaccineRecord">查询</el-button>
            </div>

            <div style="flex:2">
                <el-card shadow="hover">
                    <h3>疫苗接种记录</h3>
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="乙肝疫苗">
                            接种次数：{{ data.hbvTimes }} ｜ 最后接种：{{ data.hbvLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="甲肝疫苗">
                            接种次数：{{ data.havTimes }} ｜ 最后接种：{{ data.havLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="卡介苗">
                            接种次数：{{ data.bcgvTimes }} ｜ 最后接种：{{ data.bcgvLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="脊髓灰质炎">
                            接种次数：{{ data.opvTimes }} ｜ 最后接种：{{ data.opvLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="百白破">
                            接种次数：{{ data.dtapTimes }} ｜ 最后接种：{{ data.dtapLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="白破">
                            接种次数：{{ data.dtTimes }} ｜ 最后接种：{{ data.dtLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="麻腮风">
                            接种次数：{{ data.mmrTimes }} ｜ 最后接种：{{ data.mmrLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="乙脑减毒">
                            接种次数：{{ data.jevlTimes }} ｜ 最后接种：{{ data.jevlLastTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="A群C群流脑">
                            接种次数：{{ data.gacpvTimes }} ｜ 最后接种：{{ data.gacpvLastTime }}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { 
  searchVaccineByChildId,
  searchChildInfo  
} from '../../api/growth'

const router = useRouter()

const childId = ref('')
const childList = ref([]) 

const data = reactive({
    hbvTimes: '', hbvLastTime: '',
    havTimes: '', havLastTime: '',
    bcgvTimes: '', bcgvLastTime: '',
    opvTimes: '', opvLastTime: '',
    dtapTimes: '', dtapLastTime: '',
    dtTimes: '', dtLastTime: '',
    mmrTimes: '', mmrLastTime: '',
    jevlTimes: '', jevlLastTime: '',
    gacpvTimes: '', gacpvLastTime: '',
})

onMounted(async () => {
  try {
    const familyId = localStorage.getItem('familyId')
    const res = await searchChildInfo({
      familyId: familyId
    })
    if (res.code === 200) {
      childList.value = res.data || []
    }
  } catch (e) {
    ElMessage.error('加载儿童列表失败')
  }
})

const getVaccineRecord = async () => {
  if (!childId.value) {
    ElMessage.warning('请选择儿童')
    return
  }

  try {
    const res = await searchVaccineByChildId({
      childId: childId.value
    })

    if (res.code === 200) {
      data.hbvTimes = res.data.hbvtimes ?? ''
      data.hbvLastTime = res.data.hbvlastTime ?? ''
      
      data.havTimes = res.data.havtimes ?? ''
      data.havLastTime = res.data.havlastTime ?? ''
      
      data.bcgvTimes = res.data.bcgvtimes ?? ''
      data.bcgvLastTime = res.data.bcglastTime ?? ''
      
      data.opvTimes = res.data.opvtimes ?? ''
      data.opvLastTime = res.data.opvlastTime ?? ''
      
      data.dtapTimes = res.data.dtatimes ?? ''
      data.dtapLastTime = res.data.dtaPLastTime ?? ''
      
      data.dtTimes = res.data.dttimes ?? ''
      data.dtLastTime = res.data.dtlastTime ?? ''
      
      data.mmrTimes = res.data.mmrtimes ?? ''
      data.mmrLastTime = res.data.mmrlastTime ?? ''
      
      data.jevlTimes = res.data.jevltimes ?? ''
      data.jevlLastTime = res.data.jevllastTime ?? ''
      
      data.gacpvTimes = res.data.gacpvtimes ?? ''
      data.gacpvLastTime = res.data.gacpvlastTime ?? ''

      ElMessage.success('查询成功')
    } else {
      ElMessage.error('查询失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('请求异常')
  }
}

const goTo = (path) => {
  router.push(path)
}
</script>