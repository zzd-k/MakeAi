<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem :label="$t('pages.commentRecord.user')">
          <ElInput
            v-model="searchForm.user"
            :placeholder="$t('pages.commentRecord.placeholder')"
            clearable
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">{{
            $t('pages.commentRecord.search')
          }}</ElButton>
          <ElButton @click="handleReset">{{ $t('pages.commentRecord.reset') }}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable :data="displayData" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn :label="$t('pages.commentRecord.id')" prop="id" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.conversationTitle')"
            prop="title"
            min-width="180"
          >
            <template #default="scope">
              <span class="font-medium">{{ scope.row.title }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.conversationId')"
            prop="conversationId"
            width="120"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600 font-mono">{{ scope.row.conversationId }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('pages.commentRecord.user')" prop="user" width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.user }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('pages.commentRecord.content')" prop="content" min-width="200">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.content }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.commentTime')"
            prop="commentTime"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.commentTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.actionType')"
            prop="actionType"
            width="120"
            align="center"
          >
            <template #default="scope">
              <ElTag type="warning">{{ scope.row.actionType }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.operation')"
            width="250"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <ElButton type="primary" size="small" link @click="handleViewComments(scope.row)">
                {{ $t('pages.commentRecord.viewComments') }}
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

    <!-- 评论查看弹窗 -->
    <ElDialog v-model="commentsDialogVisible" title="评论列表" width="70%" :destroy-on-close="true">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <span class="text-g-600">会话：</span>
          <span class="font-medium">{{ currentRecord?.title }}</span>
        </div>
        <ElInput
          v-model="commentSearchKeyword"
          placeholder="搜索用户或评论内容"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <ElIcon><Search /></ElIcon>
          </template>
        </ElInput>
      </div>
      <div v-if="commentsDialogLoading" class="text-center py-10">
        <ElIcon class="is-loading"><Loading /></ElIcon>
        <p class="mt-2 text-g-500">加载中...</p>
      </div>
      <div v-else-if="filteredCommentsList.length === 0" class="text-center text-g-500 py-10">
        {{ commentSearchKeyword ? '没有找到匹配的评论' : '暂无评论' }}
      </div>
      <ArtTable
        v-else
        :data="filteredCommentsList"
        style="width: 100%"
        :border="true"
        :stripe="true"
      >
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center" />
          <ElTableColumn label="用户" width="150">
            <template #default="scope">
              <span>{{ scope.row.user }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="评论内容" min-width="300">
            <template #default="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="评论时间" width="180" align="center">
            <template #default="scope">
              {{
                scope.row.created_at ? new Date(scope.row.created_at).toLocaleString('zh-CN') : '-'
              }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="150" align="center" fixed="right">
            <template #default="scope">
              <ElButton type="success" size="small" link @click="handleEditComment(scope.row)">
                编辑
              </ElButton>
              <ElButton type="danger" size="small" link @click="handleDeleteComment(scope.row)">
                删除
              </ElButton>
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
  import { fetchAdminRecords } from '@/api/admin'
  import { fetchComments, updateComment, deleteComment } from '@/api/social'
  import { ElMessage, ElMessageBox, ElIcon } from 'element-plus'
  import { Loading, ArrowDown, Search } from '@element-plus/icons-vue'

  defineOptions({ name: 'CommentRecord' })

  const { t: $t } = useI18n()

  interface CommentItem {
    id: number
    title: string
    conversationId: string
    user: string
    content: string
    commentTime: string
    actionType: string
    recordId?: number
  }

  const searchForm = reactive({
    user: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')
  const loading = ref(false)

  const tableData = ref<CommentItem[]>([])
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

  const fetchCommentRecords = async () => {
    try {
      loading.value = true

      // 构建查询参数
      const params: any = {
        page: currentPage.value,
        page_size: pageSize.value
      }

      // 添加搜索参数
      if (searchForm.user) {
        params.search = searchForm.user
      }

      const recordsRes = await fetchAdminRecords(params)

      console.log('会话记录:', recordsRes)

      // 检查返回数据是否有效
      if (!recordsRes || !Array.isArray(recordsRes.items)) {
        console.warn('返回数据格式不正确:', recordsRes)
        tableData.value = []
        total.value = 0
        return
      }

      // 转换数据格式，并过滤出已分享的会话
      const filteredData = recordsRes.items
        .filter((item: any) => item.is_shared) // 前端过滤已分享的会话
        .map((item: any) => ({
          id: item.id,
          title: item.meeting_name || `会话记录-${item.id}`,
          conversationId: String(item.id),
          user: item.owner_id ? `USER-${item.owner_id}` : 'Unknown',
          content: '评论',
          commentTime: formatTime(item.created_at),
          actionType: '会话',
          recordId: item.id
        }))

      tableData.value = filteredData
      total.value = recordsRes.total || 0

      console.log('数据条数:', tableData.value.length, '总数:', total.value)
    } catch (error) {
      console.error('获取评论记录失败:', error)
      ElMessage.error('获取评论记录失败')
      tableData.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    currentPage.value = 1
    fetchCommentRecords()
  }

  // 重置
  const handleReset = () => {
    searchForm.user = ''
    currentPage.value = 1
    fetchCommentRecords()
  }

  const handleExport = () => {
    ElMessage.info('导出功能开发中')
  }

  // 查看评论弹窗
  const commentsDialogVisible = ref(false)
  const commentsDialogLoading = ref(false)
  const commentsList = ref<any[]>([])
  const currentRecord = ref<CommentItem | null>(null)

  // 评论搜索关键词
  const commentSearchKeyword = ref('')
  // 所有评论数据
  const allCommentsList = ref<any[]>([])
  // 过滤后的评论列表
  const filteredCommentsList = computed(() => {
    if (!commentSearchKeyword.value) {
      return allCommentsList.value
    }
    const keyword = commentSearchKeyword.value.toLowerCase()
    return allCommentsList.value.filter(
      (item) =>
        item.user.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword)
    )
  })

  const handleViewComments = async (row: CommentItem) => {
    currentRecord.value = row
    commentsDialogVisible.value = true
    commentsDialogLoading.value = true
    commentSearchKeyword.value = '' // 重置搜索

    try {
      const response = await fetchComments(row.recordId!, {
        page: 1,
        page_size: 100
      })

      console.log('评论API返回数据:', response)

      if (response && Array.isArray(response.comments)) {
        allCommentsList.value = response.comments.map((item: any) => ({
          id: item.id,
          user:
            item.user?.nickname ||
            item.user?.username ||
            (item.user_id ? `USER-${item.user_id}` : '未知用户'),
          content: item.content,
          created_at: item.created_at,
          like_count: item.like_count || 0,
          replies: item.replies || []
        }))
      } else if (response && Array.isArray(response.items)) {
        // 兼容 items 字段
        allCommentsList.value = response.items.map((item: any) => ({
          id: item.id,
          user:
            item.user?.nickname ||
            item.user?.username ||
            (item.user_id ? `USER-${item.user_id}` : '未知用户'),
          content: item.content,
          created_at: item.created_at,
          like_count: item.like_count || 0,
          replies: item.replies || []
        }))
      } else if (response && Array.isArray(response)) {
        // 如果直接返回数组
        allCommentsList.value = response.map((item: any) => ({
          id: item.id,
          user:
            item.user?.nickname ||
            item.user?.username ||
            (item.user_id ? `USER-${item.user_id}` : '未知用户'),
          content: item.content,
          created_at: item.created_at,
          like_count: item.like_count || 0,
          replies: item.replies || []
        }))
      } else {
        console.warn('评论数据格式不正确:', response)
        allCommentsList.value = []
      }

      console.log('评论列表:', allCommentsList.value)
    } catch (error) {
      console.error('获取评论失败:', error)
      ElMessage.error('获取评论失败')
      allCommentsList.value = []
    } finally {
      commentsDialogLoading.value = false
    }
  }

  // 编辑评论
  const handleEditComment = async (comment: any) => {
    try {
      const { value: newContent } = await ElMessageBox.prompt('请输入新的评论内容', '编辑评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: comment.content,
        inputType: 'textarea',
        inputValidator: (value) => {
          if (!value || value.trim() === '') {
            return '评论内容不能为空'
          }
          return true
        }
      })

      if (newContent) {
        // 调用更新评论接口，使用 comment_id
        await updateComment(comment.id, { content: newContent })
        ElMessage.success('编辑成功')
        // 重新加载评论列表
        if (currentRecord.value) {
          handleViewComments(currentRecord.value)
        }
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('编辑评论失败:', error)
        ElMessage.error('编辑评论失败')
      }
    }
  }

  // 删除评论
  const handleDeleteComment = async (comment: any) => {
    try {
      await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // 调用删除评论接口，使用 comment_id
      await deleteComment(comment.id)
      ElMessage.success('删除成功')
      // 重新加载评论列表
      if (currentRecord.value) {
        handleViewComments(currentRecord.value)
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除评论失败:', error)
        ElMessage.error('删除评论失败')
      }
    }
  }

  // 分页大小改变
  const handlePageSizeChange = () => {
    currentPage.value = 1
    fetchCommentRecords()
  }

  // 跳转页面
  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(total.value / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
      fetchCommentRecords()
    }
  }

  // 监听当前页变化
  watch(currentPage, () => {
    fetchCommentRecords()
  })

  // 初始化加载数据
  onMounted(() => {
    fetchCommentRecords()
  })
</script>
