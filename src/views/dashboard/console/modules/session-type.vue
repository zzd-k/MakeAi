<template>
  <div class="art-card p-5 mb-5 h-140">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>会话类型</h4>
      </div>
    </div>
    <div class="flex-cc h-80 overflow-visible">
      <div class="w-full h-full flex items-center justify-center">
        <ArtDoughnutChart
          height="320px"
          :data="chartData"
          :labels="chartLabels"
          :colors="chartColors"
          :showLegend="true"
          :showLabel="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * 会话类型数据
   */
  const chartData = [32, 23, 42, 12]

  /**
   * 会话类型标签
   */
  const chartLabels = ['培训教育', '通用语话', '漫课咨询', '漫课咨询中会话']

  /**
   * 图表颜色
   */
  const chartColors = ['#5DADE2', '#48C9B0', '#85C1E2', '#AED6F1']
</script>
