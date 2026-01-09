<template>
  <div class="art-card p-5 mb-5 h-140">
    <div class="art-card-header mb-4">
      <div class="title flex items-center">
        <h4>用户排行榜</h4>
        <div class="ml-3 px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium">
          2
        </div>
      </div>
    </div>
    <ArtTable
      class="w-full"
      :data="tableData"
      style="width: 100%"
      size="large"
      :border="false"
      :stripe="false"
      :header-cell-style="{ background: 'transparent' }"
      max-height="400px"
    >
      <template #default>
        <ElTableColumn label="排名" prop="rank" width="80px" align="center">
          <template #default="scope">
            <span class="font-medium">{{ scope.row.rank }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="昵称" prop="nickname" width="120px" />
        <ElTableColumn label="用户ID" prop="userId" width="140px">
          <template #default="scope">
            <span class="text-g-600 text-sm">{{ scope.row.userId }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="积分" prop="points" width="100px" align="center">
          <template #default="scope">
            <span class="font-medium">{{ scope.row.points }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="验证会话" prop="verifiedSessions" width="120px" align="center">
          <template #default="scope">
            <span class="font-medium">{{ scope.row.verifiedSessions }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="分享中会话" prop="sharingSessions" width="130px" align="center">
          <template #default="scope">
            <span class="font-medium">{{ scope.row.sharingSessions }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="100px" align="center">
          <template #default>
            <ElButton type="primary" link>查看</ElButton>
          </template>
        </ElTableColumn>
      </template>
    </ArtTable>
    <div class="flex items-center justify-between  px-2 text-sm text-g-600">
      <div class="flex items-center gap-1">
        <span>共 {{ tableData.length }} 条</span>
        <span class="mx-1">每页</span>
        <ElSelect v-model="pageSize" size="small" style="width: 70px">
          <ElOption label="10" :value="10" />
          <ElOption label="20" :value="20" />
          <ElOption label="50" :value="50" />
        </ElSelect>
        <span>条</span>
      </div>
      <div class="flex items-center gap-2">
        <ElPagination
          small
          background
          layout="prev, pager, next"
          :total="tableData.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
        <div class="flex items-center gap-1">
          <span>前往</span>
          <ElInput
            v-model="jumpPage"
            size="small"
            style="width: 50px"
            @keyup.enter="handleJumpPage"
          />
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface UserRankingItem {
    rank: number
    nickname: string
    userId: string
    points: number
    verifiedSessions: number
    sharingSessions: number
  }

  /**
   * 分页相关状态
   */
  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')

  /**
   * 跳转到指定页
   */
  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(tableData.length / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
    }
  }

  /**
   * 用户排行榜数据
   */
  const tableData = reactive<UserRankingItem[]>([
    {
      rank: 1,
      nickname: '倪明',
      userId: 'uwj2212152',
      points: 2311,
      verifiedSessions: 211,
      sharingSessions: 21
    },
    {
      rank: 2,
      nickname: '焉其',
      userId: 'fsa2321d',
      points: 2111,
      verifiedSessions: 124,
      sharingSessions: 21
    },
    {
      rank: 3,
      nickname: 'Caas',
      userId: 'fas22322',
      points: 1511,
      verifiedSessions: 111,
      sharingSessions: 32
    },
    {
      rank: 4,
      nickname: 'Ben',
      userId: 'faafafww',
      points: 1211,
      verifiedSessions: 107,
      sharingSessions: 42
    },
    {
      rank: 5,
      nickname: 'Joe',
      userId: '23asdaa',
      points: 653,
      verifiedSessions: 78,
      sharingSessions: 32
    }
  ])
</script>
