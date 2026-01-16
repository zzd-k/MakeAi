<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem :label="$t('pages.conversationRecord.titleLabel')">
          <ElInput
            v-model="searchForm.title"
            :placeholder="$t('pages.conversationRecord.placeholder')"
            clearable
          />
        </ElFormItem>
        <ElFormItem :label="$t('pages.conversationRecord.type')">
          <ElInput
            v-model="searchForm.type"
            :placeholder="$t('pages.conversationRecord.placeholder')"
            clearable
          />
        </ElFormItem>
        <ElFormItem :label="$t('pages.conversationRecord.isSharedToCommunity')">
          <ElSelect
            v-model="searchForm.isShared"
            :placeholder="$t('pages.conversationRecord.all')"
            clearable
            style="width: 120px"
          >
            <ElOption :label="$t('pages.conversationRecord.all')" value="" />
            <ElOption :label="$t('pages.conversationRecord.yes')" value="1" />
            <ElOption :label="$t('pages.conversationRecord.no')" value="0" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">{{
            $t('pages.conversationRecord.search')
          }}</ElButton>
          <ElButton @click="handleReset">{{ $t('pages.conversationRecord.reset') }}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 操作按钮 -->
    <div class="art-card p-5 mb-5">
      <ElButton type="primary" @click="handleAdd">{{
        $t('pages.conversationRecord.add')
      }}</ElButton>
      <ElButton @click="handleExport">{{ $t('pages.conversationRecord.export') }}</ElButton>
    </div>

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable :data="displayData" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn
            :label="$t('pages.conversationRecord.id')"
            prop="id"
            width="80"
            align="center"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('pages.conversationRecord.creator')" prop="creator" width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.creator }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.conversationTitle')"
            prop="title"
            min-width="180"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.title }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.conversationType')"
            prop="type"
            width="120"
            align="center"
          >
            <template #default="scope">
              <ElTag type="primary">{{ scope.row.type }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.isSharedToCommunity')"
            prop="isShared"
            width="140"
            align="center"
          >
            <template #default="scope">
              <ElTag :type="scope.row.isShared ? 'success' : 'info'">
                {{
                  scope.row.isShared
                    ? $t('pages.conversationRecord.yes')
                    : $t('pages.conversationRecord.no')
                }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.shareDesc')"
            prop="shareDesc"
            min-width="200"
          >
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.shareDesc }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.createTime')"
            prop="createTime"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.createTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.views')"
            prop="views"
            width="100"
            align="center"
          >
            <template #default="scope">
              <span class="font-semibold text-primary">{{ scope.row.views }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.conversationRecord.edit')"
            width="280"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <div class="flex items-center justify-center gap-2">
                <ElButton type="info" size="small" plain @click="handleStats(scope.row)">
                  {{ $t('pages.conversationRecord.conversationDetail') }}
                </ElButton>
                <ElButton type="primary" size="small" plain @click="handleTimeline(scope.row)">
                  {{ $t('pages.conversationRecord.commentRecord') }}
                </ElButton>
                <ElButton type="success" size="small" link @click="handleEdit(scope.row)">
                  {{ $t('pages.conversationRecord.edit') }}
                </ElButton>
                <ElButton type="danger" size="small" link @click="handleDelete(scope.row)">
                  {{ $t('pages.conversationRecord.delete') }}
                </ElButton>
              </div>
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
  import { useI18n } from 'vue-i18n'
  import { fetchAdminRecords, deleteAdminRecord } from '@/api/admin'
  import { ElMessage, ElMessageBox } from 'element-plus'

  defineOptions({ name: 'ConversationRecord' })

  const { t: $t } = useI18n()

  interface ConversationItem {
    id: number
    creator: string
    title: string
    type: string
    isShared: boolean
    shareDesc: string
    createTime: string
    views: number
  }

  const searchForm = reactive({
    title: '',
    type: '',
    isShared: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')
  const loading = ref(false)

  const tableData = ref<ConversationItem[]>([])
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

  // 获取会话记录列表
  const fetchConversationRecords = async () => {
    try {
      loading.value = true
      const res = await fetchAdminRecords({
        page: currentPage.value,
        page_size: pageSize.value
      })

      console.log('后端返回的数据:', res) // 调试用，查看实际返回的数据结构

      // 将后端数据转换为前端需要的格式
      tableData.value = res.items.map((item: any) => ({
        id: item.id,
        creator: item.owner_id ? `USER-${item.owner_id}` : 'Unknown',
        title: item.meeting_name || item.title || `会议记录-${item.id}`,
        type: item.kind || item.type || '通用对话',
        isShared: item.is_shared || false,
        shareDesc: item.description || item.share_desc || '暂无描述',
        createTime: formatTime(item.created_at),
        views: item.view_count || 0
      }))

      total.value = res.total
    } catch (error) {
      ElMessage.error('获取会话记录失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    currentPage.value = 1
    fetchConversationRecords()
  }

  // 重置
  const handleReset = () => {
    searchForm.title = ''
    searchForm.type = ''
    searchForm.isShared = ''
    currentPage.value = 1
    fetchConversationRecords()
  }

  const handleAdd = () => {
    ElMessage.info('新增功能开发中')
  }

  const handleExport = () => {
    ElMessage.info('导出功能开发中')
  }

  // 查看会话详情
  const handleStats = async (row: ConversationItem) => {
    // 直接使用列表数据显示详情，避免调用可能出错的详情接口
    ElMessageBox.alert(
      `
        <div style="text-align: left; line-height: 1.8;">
          <p><strong>会话ID:</strong> ${row.id}</p>
          <p><strong>会话标题:</strong> ${row.title}</p>
          <p><strong>会话类型:</strong> ${row.type}</p>
          <p><strong>创建者:</strong> ${row.creator}</p>
          <p><strong>创建时间:</strong> ${row.createTime}</p>
          <p><strong>是否分享:</strong> ${row.isShared ? '是' : '否'}</p>
          <p><strong>分享描述:</strong> ${row.shareDesc}</p>
          <p><strong>浏览次数:</strong> ${row.views}</p>
        </div>
      `,
      '会话详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      }
    )
  }

  // 跳转到评论记录页面
  const handleTimeline = async (row: ConversationItem) => {
    // 使用 Vue Router 跳转到评论记录页面
    window.location.hash = '#/conversation/comment'
    ElMessage.success(`跳转到评论记录页面`)
  }

  const handleEdit = async (row: ConversationItem) => {
    ElMessage.info('编辑功能开发中')
  }

  // 删除
  const handleDelete = async (row: ConversationItem) => {
    try {
      await ElMessageBox.confirm('确定要删除这条会话记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await deleteAdminRecord(row.id)
      ElMessage.success('删除成功')
      fetchConversationRecords()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
        console.error(error)
      }
    }
  }

  // 分页大小改变
  const handlePageSizeChange = () => {
    currentPage.value = 1
    fetchConversationRecords()
  }

  // 跳转页面
  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(total.value / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
      fetchConversationRecords()
    }
  }

  // 监听当前页变化
  watch(currentPage, () => {
    fetchConversationRecords()
  })

  // 初始化加载数据
  onMounted(() => {
    fetchConversationRecords()
  })
</script>
