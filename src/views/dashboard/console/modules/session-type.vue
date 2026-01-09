<template>
  <div class="art-card p-5 mb-5 h-140 flex flex-col">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>会话类型</h4>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center overflow-visible min-h-0 -mx-2 left-12 relative">
      <div class="w-full max-w-md h-full flex items-center justify-center py-2">
        <ArtDoughnutChart
          height="260px"
          :data="chartData"
          :labels="chartLabels"
          :colors="chartColors"
          :showLegend="true"
          :showLabel="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * 会话类型数据
   */
  const chartData = [23, 42, 12, 32]

  /**
   * 会话类型标签
   */
  const chartLabels = ['通用对话', '销售咨询', '演课研讨会', '培训教育']

  /**
   * 图表颜色
   */
  const chartColors = ['#48C9B0', '#5DADE2', '#85C1E2', '#AED6F1']
</script>
