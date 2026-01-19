<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem :label="$t('pages.likeRecord.user')">
          <ElInput
            v-model="searchForm.user"
            :placeholder="$t('pages.likeRecord.placeholder')"
            clearable
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">{{
            $t('pages.likeRecord.search')
          }}</ElButton>
          <ElButton @click="handleReset">{{ $t('pages.likeRecord.reset') }}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable :data="displayData" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn :label="$t('pages.likeRecord.id')" prop="id" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.likeRecord.conversationTitle')"
            prop="title"
            min-width="180"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.title }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.likeRecord.conversationId')"
            prop="conversationId"
            width="120"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600 font-mono">{{ scope.row.conversationId }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('pages.likeRecord.user')" prop="user" width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.user }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.likeRecord.likeTime')"
            prop="likeTime"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.likeTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.likeRecord.actionType')"
            prop="actionType"
            width="120"
            align="center"
          >
            <template #default="scope">
              <ElTag
                :type="scope.row.actionType === $t('pages.likeRecord.like') ? 'success' : 'info'"
              >
                {{ scope.row.actionType }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="100" align="center" fixed="right">
            <template #default="scope">
              <ElButton type="primary" size="small" link @click="handleView(scope.row)">
                查看
              </ElButton>
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>

      <!-- 分页 -->
      <div
        class="flex items-center justify-between mt-4 pt-3 border-t border-g-200 text-sm text-g-600"
      >
        <div class="flex items-center gap-2">
          <span
            >{{ $t('pages.pagination.total') }} {{ total }} {{ $t('pages.pagination.items') }}</span
          >
          <span>{{ $t('pages.pagination.perPage') }}</span>
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
          <span>{{ $t('pages.pagination.items') }}</span>
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
            <span>{{ $t('pages.pagination.goTo') }}</span>
            <ElInput
              v-model="jumpPage"
              size="small"
              style="width: 50px"
              @keyup.enter="handleJumpPage"
            />
            <span>{{ $t('pages.pagination.page') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { fetchAdminRecords, deleteAdminRecord } from '@/api/admin'
  import { ElMessage, ElMessageBox } from 'element-plus'

  defineOptions({ name: 'LikeRecord' })

  const { t: $t } = useI18n()

  interface LikeItem {
    id: number
    title: string
    conversationId: string
    user: string
    likeTime: string
    actionType: string
  }

  const searchForm = reactive({
    user: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')
  const loading = ref(false)

  const tableData = ref<LikeItem[]>([])
  const total = ref(0)

  const displayData = computed(() => {
    return tableData.value
  })

  // 格式化时间
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-'
    try {
      const date = new Date(timeStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    } catch {
      return timeStr
    }
  }

  // 获取点赞记录列表
  const fetchLikeRecords = async () => {
    try {
      loading.value = true

      // 构建查询参数
      const params: any = {
        page: currentPage.value,
        page_size: pageSize.value
      }

      const res = await fetchAdminRecords(params)

      console.log('后端返回的数据:', res)

      let filteredData = res.items.map((item: any) => ({
        id: item.id,
        title: item.meeting_name || item.title || `会议记录-${item.id}`,
        conversationId: String(item.id),
        user: item.owner_id ? `USER-${item.owner_id}` : 'Unknown',
        likeTime: formatTime(item.created_at),
        actionType: '点赞'
      }))

      // 前端过滤搜索（根据用户ID或标题）
      if (searchForm.user) {
        filteredData = filteredData.filter(
          (item) =>
            item.user.toLowerCase().includes(searchForm.user.toLowerCase()) ||
            item.title.toLowerCase().includes(searchForm.user.toLowerCase())
        )
      }

      tableData.value = filteredData
      total.value = filteredData.length

      console.log('过滤后数据条数:', tableData.value.length)
    } catch (error) {
      ElMessage.error('获取点赞记录失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    currentPage.value = 1
    fetchLikeRecords()
  }

  // 重置
  const handleReset = () => {
    searchForm.user = ''
    currentPage.value = 1
    fetchLikeRecords()
  }

  const handleExport = () => {
    ElMessage.info('导出功能开发中')
  }

  const handleView = async (row: LikeItem) => {
    try {
      // 打开详情弹窗显示点赞记录详情
      await ElMessageBox.alert(
        `
        <div style="line-height: 1.8;">
          <p><strong>ID：</strong>${row.id}</p>
          <p><strong>会话标题：</strong>${row.title}</p>
          <p><strong>会话ID：</strong>${row.conversationId}</p>
          <p><strong>用户：</strong>${row.user}</p>
          <p><strong>点赞时间：</strong>${row.likeTime}</p>
          <p><strong>操作类型：</strong>${row.actionType}</p>
        </div>
      `,
        '点赞记录详情',
        {
          confirmButtonText: '关闭',
          dangerouslyUseHTMLString: true
        }
      )
    } catch (error) {
      // 用户点击关闭按钮
    }
  }

  // 分页大小改变
  const handlePageSizeChange = () => {
    currentPage.value = 1
    fetchLikeRecords()
  }

  // 跳转页面
  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(total.value / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
      fetchLikeRecords()
    }
  }

  // 监听当前页变化
  watch(currentPage, () => {
    fetchLikeRecords()
  })

  // 初始化加载数据
  onMounted(() => {
    fetchLikeRecords()
  })
</script>
