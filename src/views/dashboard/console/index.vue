<!-- 数据中心页面 -->
<template>
  <div>
    <!-- 顶部统计卡片 -->
    <DataCards />

    <!-- 系统数据统计图表 -->
    <SystemStats />

    <!-- 用户排行榜和会话类型 -->
    <ElRow :gutter="20">
      <ElCol :sm="24" :md="24" :lg="16">
        <UserRanking />
      </ElCol>
      <ElCol :sm="24" :md="24" :lg="8">
        <SessionType />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import DataCards from './modules/data-cards.vue'
  import SystemStats from './modules/system-stats.vue'
  import UserRanking from './modules/user-ranking.vue'
  import SessionType from './modules/session-type.vue'

  defineOptions({ name: 'DataCenter' })
</script>
