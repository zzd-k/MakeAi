<template>
  <ElRow :gutter="20" class="flex mb-5">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card relative flex flex-col justify-center h-35 px-5">
        <span class="text-g-700 text-sm">{{ item.title }}</span>
        <ArtCountTo class="text-[32px] font-bold mt-2" :target="item.value" :duration="1500" />
        <div class="flex-c mt-2">
          <span class="text-xs text-g-600">据上月数据对比</span>
          <ArtSvgIcon
            :icon="item.trend === 'up' ? 'ri:arrow-up-line' : 'ri:arrow-down-line'"
            class="ml-1 text-sm"
            :class="[item.trend === 'up' ? 'text-danger' : 'text-success']"
          />
          <span
            class="ml-0.5 text-xs font-semibold"
            :class="[item.trend === 'up' ? 'text-danger' : 'text-success']"
          >
            {{ item.change }}
          </span>
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  interface DataCardItem {
    title: string
    value: number
    change: string
    trend: 'up' | 'down'
  }

  /**
   * 数据中心顶部统计卡片
   */
  const dataList = reactive<DataCardItem[]>([
    {
      title: '会员数量',
      value: 1451,
      change: '20%',
      trend: 'up'
    },
    {
      title: '社區會話',
      value: 121,
      change: '20%',
      trend: 'up'
    },
    {
      title: '會話',
      value: 13122,
      change: '20%',
      trend: 'up'
    },
    {
      title: '創建中會話',
      value: 21,
      change: '暂时列隊還沒完成創建的會話數量',
      trend: 'up'
    }
  ])
</script>
