<template>
    <div style="padding: 30px; width: 100%; box-sizing: border-box">
        <div style="margin-bottom: 20px">
            <el-button @click="$router.back()">返回成长中心</el-button>
        </div>

        <div style="display: flex; gap: 20px; align-items: flex-start">
            <!-- 左侧图标 -->
            <div class="card">
                <span class="icon">🗓️</span>
                <p>疫苗时间轴</p>
                <el-button type="primary" @click="goTo('/vaccine-timeline')">进入</el-button>
            </div>

            <!-- 中间输入儿童ID -->
            <div style="flex:1">
                <h3>查询儿童疫苗</h3>
                <el-input v-model="childId" placeholder="请输入儿童ID" style="width:300px; margin-right:10px" />
                <el-button type="primary" @click="getVaccineRecord">查询</el-button>
            </div>

            <!-- 右侧疫苗记录表单 -->
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { searchVaccineByChildId } from '../../api/growth'
import { useRouter } from 'vue-router'
const router = useRouter()

const childId = ref('')
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

const getVaccineRecord = async () => {
  if (!childId.value) {
    ElMessage.warning('请输入儿童ID')
    return
  }

  try {
    const res = await searchVaccineByChildId({
      childId: childId.value
    })

    if (res.code === 200) {
      // ✅ 手动映射后端小驼峰 → 前端变量
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
