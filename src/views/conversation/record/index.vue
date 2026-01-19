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
    <!-- <div class="art-card p-5 mb-5">
      <ElButton type="primary" @click="handleAdd">{{
        $t('pages.conversationRecord.add')
      }}</ElButton>
      <ElButton @click="handleExport">{{ $t('pages.conversationRecord.export') }}</ElButton>
    </div> -->

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
              <span class="font-semibold text-primary">{{ scope.row.views || 0 }}</span>
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
                <ElButton
                  v-if="scope.row.isShared"
                  type="info"
                  size="small"
                  plain
                  @click="handleStats(scope.row)"
                >
                  {{ $t('pages.conversationRecord.conversationDetail') }}
                </ElButton>
                <ElButton
                  v-if="scope.row.isShared"
                  type="primary"
                  size="small"
                  plain
                  @click="handleComments(scope.row)"
                >
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

    <!-- 评论记录弹窗 -->
    <ElDialog v-model="commentsVisible" title="评论记录" width="70%" :destroy-on-close="true">
      <div class="mb-4">
        <span class="text-g-600">会话：</span>
        <span class="font-medium">{{ currentConversation?.title }}</span>
      </div>
      <div v-if="commentsLoading" class="text-center py-10">
        <ElIcon class="is-loading"><Loading /></ElIcon>
        <p class="mt-2 text-g-500">加载中...</p>
      </div>
      <div v-else-if="commentsList.length === 0" class="text-center text-g-500 py-10">
        暂无评论
      </div>
      <ArtTable v-else :data="commentsList" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center" />
          <ElTableColumn label="用户" prop="user" width="150" />
          <ElTableColumn label="评论内容" prop="content" min-width="300" />
          <ElTableColumn label="评论时间" prop="created_at" width="180" align="center">
            <template #default="scope">
              {{
                scope.row.created_at ? new Date(scope.row.created_at).toLocaleString('zh-CN') : '-'
              }}
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { fetchAdminRecords, deleteAdminRecord, updateAdminRecord } from '@/api/admin'
  import { fetchComments } from '@/api/social'
  import { ElMessage, ElMessageBox, ElIcon } from 'element-plus'
  import { Loading } from '@element-plus/icons-vue'

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
    shareId?: string | null
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

      // 构建查询参数
      const params: any = {
        page: currentPage.value,
        page_size: pageSize.value
      }

      // 添加搜索条件
      if (searchForm.title) {
        params.meeting_name = searchForm.title
      }
      if (searchForm.type) {
        params.kind = searchForm.type
      }
      if (searchForm.isShared !== '') {
        params.is_shared = searchForm.isShared === '1'
      }

      const res = await fetchAdminRecords(params)

      console.log('后端返回的数据:', res)

      // 将后端数据转换为前端需要的格式
      tableData.value = res.items.map((item: any) => ({
        id: item.id,
        creator: item.owner_id ? `USER-${item.owner_id}` : 'Unknown',
        title: item.meeting_name || item.title || `会议记录-${item.id}`,
        type: item.kind || item.type || '通用对话',
        isShared: item.is_shared || false,
        shareDesc: item.description || item.share_desc || '暂无描述',
        createTime: formatTime(item.created_at),
        views: item.view_count || 0,
        shareId: item.share_id || null
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
    try {
      if (!row.id) {
        ElMessage.warning('会话ID无效')
        return
      }

      console.log('点击会话详情，会话ID:', row.id, '分享ID:', row.shareId)

      // 如果有 share_id，直接构建后端H5分享页URL
      if (row.shareId) {
        const apiUrl = import.meta.env.VITE_API_URL || ''

        let backendUrl = ''
        if (apiUrl.startsWith('http')) {
          // 如果是完整URL，直接使用
          backendUrl = apiUrl
        } else {
          backendUrl = 'https://www.finecv.cn' // 默认后端地址，请根据实际情况修改
        }

        // 移除末尾的 /api 等路径
        backendUrl = backendUrl.replace(/\/api\/?$/, '')

        const h5Url = `${backendUrl}/share/h5/${row.shareId}`
        console.log('打开H5分享页:', h5Url)
        window.open(h5Url, '_blank')
        return
      }

      // 如果没有 share_id，提示用户
      ElMessage.warning('该会话暂未生成分享链接，请先生成分享链接')
    } catch (error: any) {
      console.error('打开分享页失败:', error)
      ElMessage.error('打开分享页失败')
    }
  }

  // 跳转到评论记录页面
  const handleTimeline = async (row: ConversationItem) => {
    // 使用 Vue Router 跳转到评论记录页面
    window.location.hash = '#/conversation/comment'
    ElMessage.success(`跳转到评论记录页面`)
  }

  // 查看评论记录（弹窗显示）
  const commentsVisible = ref(false)
  const commentsLoading = ref(false)
  const commentsList = ref<any[]>([])
  const currentConversation = ref<ConversationItem | null>(null)

  const handleComments = async (row: ConversationItem) => {
    currentConversation.value = row
    commentsVisible.value = true
    commentsLoading.value = true

    try {
      // 调用获取评论列表的API
      const response = await fetchComments(row.id, {
        page: 1,
        page_size: 100 // 获取所有评论
      })

      // 转换数据格式
      commentsList.value = response.items.map((item: any) => ({
        id: item.id,
        user: item.user_id ? `USER-${item.user_id}` : '未知用户',
        content: item.content,
        created_at: item.created_at
      }))

      console.log('评论列表:', commentsList.value)
    } catch (error) {
      console.error('获取评论失败:', error)
      ElMessage.error('获取评论失败')
      commentsList.value = []
    } finally {
      commentsLoading.value = false
    }
  }

  const handleEdit = async (row: ConversationItem) => {
    try {
      const { value: newTitle } = await ElMessageBox.prompt('请输入新的会话标题', '编辑会话', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.title,
        inputValidator: (value) => {
          if (!value || value.trim() === '') {
            return '会话标题不能为空'
          }
          return true
        }
      })

      if (newTitle) {
        // 调用更新会议记录接口
        await updateAdminRecord(row.id, { meeting_name: newTitle })
        ElMessage.success('编辑成功')
        fetchConversationRecords()
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('编辑失败:', error)
        ElMessage.error('编辑失败')
      }
    }
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
