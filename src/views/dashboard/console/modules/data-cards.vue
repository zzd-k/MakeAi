<template>
  <ElRow :gutter="20" class="flex mb-5">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card relative flex flex-col justify-center h-35 px-5">
        <span class="text-g-700 text-sm">{{ item.title }}</span>
        <ArtCountTo class="text-[32px] font-bold mt-2" :target="item.value" :duration="1500" />
        <div class="flex-c mt-2">
          <span class="text-xs text-g-600">{{ item.description }}</span>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  import { fetchStatisticsOverview } from '@/api/admin'
  import { ElMessage } from 'element-plus'

  interface DataCardItem {
    title: string
    value: number
    description: string
  }

  /**
   * 数据中心顶部统计卡片
   */
  const dataList = reactive<DataCardItem[]>([
    {
      title: '会员总数',
      value: 0,
      description: '今日新增: 0'
    },
    {
      title: '会话总数',
      value: 0,
      description: '已分享: 0'
    },
    {
      title: '点赞数',
      value: 0,
      description: '评论: 0 | 转发: 0'
    },
    {
      title: '活跃用户',
      value: 0,
      description: '超级管理员: 0'
    }
  ])

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const data = await fetchStatisticsOverview()
      console.log('统计概览数据:', data)

      // 更新数据卡片 - 根据实际返回的嵌套结构
      if (data) {
        dataList[0].value = data.users.total
        dataList[1].value = data.records.total
        dataList[2].value = data.interactions.likes
        dataList[3].value = data.users.active

        // 更新描述
        dataList[0].description = `今日新增: ${data.users.today_new}`
        dataList[1].description = `已分享: ${data.records.shared}`
        dataList[2].description = `评论: ${data.interactions.comments} | 转发: ${data.interactions.forwards}`
        dataList[3].description = `超级管理员: ${data.users.superusers}`
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      ElMessage.error('获取统计数据失败')
    }
  }

  // 移除未使用的函数
  // const formatDuration = (seconds: number) => {
  //   return Math.round(seconds / 3600)
  // }

  // 页面加载时获取数据
  onMounted(() => {
    fetchStatistics()
  })
</script>
