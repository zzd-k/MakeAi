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
      <div class="mb-4">
        <span class="text-g-600">会话：</span>
        <span class="font-medium">{{ currentRecord?.title }}</span>
      </div>
      <div v-if="commentsDialogLoading" class="text-center py-10">
        <ElIcon class="is-loading"><Loading /></ElIcon>
        <p class="mt-2 text-g-500">加载中...</p>
      </div>
      <div v-else-if="commentsList.length === 0" class="text-center text-g-500 py-10">
        暂无评论
      </div>
      <ArtTable v-else :data="commentsList" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center" />
          <ElTableColumn label="用户" prop="user_id" width="120">
            <template #default="scope">
              <span>USER-{{ scope.row.user_id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="评论内容" prop="content" min-width="300" />
          <ElTableColumn label="评论时间" prop="created_at" width="180" align="center">
            <template #default="scope">
              {{
                scope.row.created_at ? new Date(scope.row.created_at).toLocaleString('zh-CN') : '-'
              }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.commentRecord.operation')"
            width="200"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <ElDropdown @command="(command) => handleCommentCommand(command, scope.row)">
                <ElButton type="primary" size="small">
                  {{ $t('pages.commentRecord.operation') }}
                  <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="edit">
                      {{ $t('pages.commentRecord.edit') }}
                    </ElDropdownItem>
                    <ElDropdownItem command="delete">
                      {{ $t('pages.commentRecord.delete') }}
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
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
  import { Loading, ArrowDown } from '@element-plus/icons-vue'

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

  const handleViewComments = async (row: CommentItem) => {
    currentRecord.value = row
    commentsDialogVisible.value = true
    commentsDialogLoading.value = true

    try {
      const res = await fetchComments(row.recordId!, {
        page: 1,
        page_size: 100
      })

      commentsList.value = res.items || []
      console.log('评论列表:', commentsList.value)
    } catch (error) {
      console.error('获取评论失败:', error)
      ElMessage.error('获取评论失败')
      commentsList.value = []
    } finally {
      commentsDialogLoading.value = false
    }
  }

  // 编辑评论
  const handleEdit = async (comment: any) => {
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
        await updateComment(comment.id, { content: newContent })
        ElMessage.success('编辑成功')
        // 重新加载评论列表
        if (currentRecord.value) {
          handleViewComments(currentRecord.value)
        }
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('编辑失败:', error)
        ElMessage.error('编辑失败')
      }
    }
  }

  // 删除评论
  const handleDelete = async (comment: any) => {
    try {
      await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await deleteComment(comment.id)
      ElMessage.success('删除成功')
      // 重新加载评论列表
      if (currentRecord.value) {
        handleViewComments(currentRecord.value)
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
        console.error(error)
      }
    }
  }

  // 处理评论下拉菜单命令
  const handleCommentCommand = (command: string, comment: any) => {
    if (command === 'edit') {
      handleEdit(comment)
    } else if (command === 'delete') {
      handleDelete(comment)
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
