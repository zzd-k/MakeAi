<template>
  <div class="art-card p-5 mb-5 h-140">
    <div class="art-card-header mb-4">
      <div class="title flex items-center gap-2">
        <h4>{{ $t('pages.dataCenter.userRanking.title') }}</h4>
      </div>
    </div>
    <div class="overflow-hidden">
      <ArtTable
        class="w-full"
        :data="displayData"
        style="width: 100%"
        size="large"
        :border="false"
        :stripe="true"
        :header-cell-style="{ background: 'transparent', fontWeight: '600' }"
      >
        <template #default>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.rank')"
            prop="rank"
            width="80px"
            align="center"
          >
            <template #default="scope">
              <div
                class="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold"
                :class="getRankClass(scope.row.rank)"
              >
                {{ scope.row.rank }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.nickname')"
            prop="nickname"
            min-width="100px"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.nickname }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.userId')"
            prop="userId"
            min-width="120px"
          >
            <template #default="scope">
              <span class="text-g-500 text-sm font-mono">{{ scope.row.userId }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.points')"
            prop="points"
            width="100px"
            align="center"
          >
            <template #default="scope">
              <span class="font-semibold text-primary">{{ scope.row.points }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.verifiedSessions')"
            prop="verifiedSessions"
            width="100px"
            align="center"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.verifiedSessions }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.sharingSessions')"
            prop="sharingSessions"
            width="110px"
            align="center"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.sharingSessions }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.dataCenter.userRanking.columns.operation')"
            width="80px"
            align="center"
            fixed="right"
          >
            <template #default>
              <ElButton type="primary" link size="small">{{
                $t('pages.dataCenter.userRanking.actions.view')
              }}</ElButton>
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>
    </div>
    <div
      class="flex items-center justify-between mt-4 pt-3 border-t border-g-200 text-sm text-g-600"
    >
      <div class="flex items-center gap-2">
        <span
          >{{ $t('pages.dataCenter.userRanking.pagination.totalPrefix') }} {{ total }}
          {{ $t('pages.dataCenter.userRanking.pagination.items') }}</span
        >
        <span>{{ $t('pages.dataCenter.userRanking.pagination.perPage') }}</span>
        <ElSelect
          v-model="pageSize"
          size="small"
          style="width: 70px"
          @change="handlePageSizeChange"
        >
          <ElOption label="10" :value="10" />
          <ElOption label="20" :value="20" />
          <ElOption label="50" :value="50" />
        </ElSelect>
        <span>{{ $t('pages.dataCenter.userRanking.pagination.items') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <ElPagination
          small
          background
          layout="prev, pager, next"
          :total="total"
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
  import { fetchAdminUsers } from '@/api/admin'
  import { ElMessage } from 'element-plus'

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
  const loading = ref(false)

  /**
   * 用户排行榜数据
   */
  const tableData = ref<UserRankingItem[]>([])

  /**
   * 总数据量
   */
  const total = ref(0)

  /**
   * 当前页显示的数据
   */
  const displayData = computed(() => {
    return tableData.value
  })

  /**
   * 获取用户排行榜数据
   */
  const fetchRankingData = async () => {
    try {
      loading.value = true
      const res = await fetchAdminUsers({
        page: currentPage.value,
        page_size: pageSize.value
      })

      console.log('用户列表数据:', res)

      // 将用户数据转换为排行榜格式
      tableData.value = res.items.map((user, index) => ({
        rank: (currentPage.value - 1) * pageSize.value + index + 1,
        nickname: user.nickname || user.username || '未设置',
        userId: `USER-${user.id}`,
        points: 0, // 后端没有积分字段，暂时设为0
        verifiedSessions: 0, // 后端没有验证会话数，暂时设为0
        sharingSessions: 0 // 后端没有分享会话数，暂时设为0
      }))

      total.value = res.total
    } catch (error) {
      console.error('获取用户排行榜失败:', error)
      ElMessage.error('获取用户排行榜失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取排名样式
   */
  const getRankClass = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-600'
    if (rank === 2) return 'bg-gray-100 text-gray-600'
    if (rank === 3) return 'bg-orange-100 text-orange-600'
    return 'bg-g-100 text-g-600'
  }

  /**
   * 页面大小改变
   */
  const handlePageSizeChange = () => {
    currentPage.value = 1
    fetchRankingData()
  }

  /**
   * 跳转到指定页
   */
  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(total.value / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
      fetchRankingData()
    }
  }

  /**
   * 监听当前页变化
   */
  watch(currentPage, () => {
    fetchRankingData()
  })

  /**
   * 页面加载时获取数据
   */
  onMounted(() => {
    fetchRankingData()
  })
</script>
