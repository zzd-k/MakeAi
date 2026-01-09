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
  /**
   * 用户数量数据
   */
  const userData = [150, 515, 232, 251, 442, 322, 422, 336, 521]

  /**
   * 会话数量数据
   */
  const sessionData = [150, 232, 201, 154, 190, 330, 410, 420, 520]

  /**
   * X 轴日期标签
   */
  const xAxisData = ['25-8', '25-9', '25-10', '25-11', '25-8-12']
</script>
