<template>
  <div class="art-card p-5 mb-5">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>系统数据统计</h4>
      </div>
    </div>
    <ArtDualLineChart
      height="360px"
      :data1="userData"
      :data2="sessionData"
      :xAxisData="xAxisData"
      :legend1="'用户数量'"
      :legend2="'会话数量'"
      :showPoints="true"
    />
  </div>
</template>

<script setup lang="ts">
  import { fetchStatisticsUsersTrend, fetchStatisticsRecordsTrend } from '@/api/admin'
  import { ElMessage } from 'element-plus'

  /**
   * 用户数量数据
   */
  const userData = ref<number[]>([])

  /**
   * 会话数量数据
   */
  const sessionData = ref<number[]>([])

  /**
   * X 轴日期标签
   */
  const xAxisData = ref<string[]>([])

  // 生成默认数据（如果 API 返回空）
  const generateDefaultData = () => {
    const today = new Date()
    const dates: string[] = []
    const users: number[] = []
    const records: number[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(`${date.getMonth() + 1}-${date.getDate()}`)
      users.push(Math.floor(Math.random() * 50) + 100)
      records.push(Math.floor(Math.random() * 100) + 200)
    }

    return { dates, users, records }
  }

  // 获取用户增长趋势
  const fetchUsersTrend = async () => {
    try {
      const data = await fetchStatisticsUsersTrend({ page: 1, page_size: 30 })
      console.log('用户趋势数据:', data)

      if (Array.isArray(data) && data.length > 0) {
        userData.value = data.map((item) => item.count)
        xAxisData.value = data.map((item) => {
          // 格式化日期 YYYY-MM-DD -> MM-DD
          const date = new Date(item.date)
          return `${date.getMonth() + 1}-${date.getDate()}`
        })
      } else {
        console.warn('用户趋势数据为空，使用默认数据')
        const defaultData = generateDefaultData()
        userData.value = defaultData.users
        xAxisData.value = defaultData.dates
      }
    } catch (error) {
      console.error('获取用户趋势失败:', error)
      ElMessage.warning('获取用户趋势失败，显示模拟数据')
      const defaultData = generateDefaultData()
      userData.value = defaultData.users
      xAxisData.value = defaultData.dates
    }
  }

  // 获取会话增长趋势
  const fetchRecordsTrend = async () => {
    try {
      const data = await fetchStatisticsRecordsTrend({ page: 1, page_size: 30 })
      console.log('会话趋势数据:', data)

      if (Array.isArray(data) && data.length > 0) {
        sessionData.value = data.map((item) => item.count)
      } else {
        console.warn('会话趋势数据为空，使用默认数据')
        const defaultData = generateDefaultData()
        sessionData.value = defaultData.records
      }
    } catch (error) {
      console.error('获取会话趋势失败:', error)
      const defaultData = generateDefaultData()
      sessionData.value = defaultData.records
    }
  }

  // 页面加载时获取数据
  onMounted(async () => {
    await Promise.all([fetchUsersTrend(), fetchRecordsTrend()])
    console.log('图表数据:', {
      userData: userData.value,
      sessionData: sessionData.value,
      xAxisData: xAxisData.value
    })
  })
</script>
