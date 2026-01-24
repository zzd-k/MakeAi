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
            :label="$t('pages.conversationRecord.operation')"
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
      <div class="mb-4 flex items-center justify-between">
        <div>
          <span class="text-g-600">会话：</span>
          <span class="font-medium">{{ currentConversation?.title }}</span>
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
      <div v-if="commentsLoading" class="text-center py-10">
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
  import {
    fetchAdminRecords,
    deleteAdminRecord,
    updateAdminRecord,
    fetchAdminRecordDetail
  } from '@/api/admin'
  import { fetchComments, updateComment, deleteComment } from '@/api/social'
  import { ElMessage, ElMessageBox, ElIcon } from 'element-plus'
  import { Loading, Search } from '@element-plus/icons-vue'

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
    transcript?: string | null
    analysisStatus?: string
    analysis?: {
      task_id?: string
      raw_result?: any[]
      gemini_error?: string
      speaker_segments?: any[]
      transcript?: string
      summary?: string
      audio_url?: string
      status?: string
    } | null
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
        page_size: pageSize.value,
        include_analysis: true
      }

      // 添加搜索参数
      if (searchForm.title) {
        params.search = searchForm.title
      }

      // 添加会话类型参数
      if (searchForm.type) {
        params.meeting_type = searchForm.type
      }

      const res = await fetchAdminRecords(params)

      console.log('后端返回的数据:', res)

      const convertedData = res.items.map((item: any) => ({
        id: item.id,
        creator: item.owner_id ? `USER-${item.owner_id}` : 'Unknown',
        title: item.meeting_name || item.title || `会议记录-${item.id}`,
        type: item.kind || item.type || '通用对话',
        isShared: item.is_shared || false,
        shareDesc: item.description || item.share_desc || '暂无描述',
        createTime: formatTime(item.created_at),
        views: item.view_count || 0,
        shareId: item.share_id || null,
        transcript: item.transcript || null,
        analysisStatus: item.analysis_status || null,
        analysis: item.analysis || null
      }))

      // 前端过滤是否分享（后端可能不支持这个参数）
      let filteredData = convertedData
      if (searchForm.isShared !== '') {
        const isSharedBool = searchForm.isShared === '1'
        filteredData = convertedData.filter((item) => item.isShared === isSharedBool)
      }

      tableData.value = filteredData
      total.value = res.total || 0

      console.log('数据条数:', tableData.value.length, '总数:', total.value)
    } catch (error) {
      ElMessage.error('获取会话记录失败')
      console.error(error)
      tableData.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 搜索（使用后端接口）
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

      // 如果有 share_id，先获取完整的记录详情（包含 analysis 数据）
      if (row.shareId) {
        // 显示加载提示
        const loadingMessage = ElMessage({
          message: '正在加载会话详情...',
          type: 'info',
          duration: 0
        })

        try {
          // 获取完整的记录详情，确保包含 analysis 数据
          const recordDetail = await fetchAdminRecordDetail(row.id)
          console.log('获取到的记录详情:', recordDetail)

          loadingMessage.close()

          // 详细检查 analysis 数据
          if (recordDetail.analysis) {
            console.log('Analysis 数据:', recordDetail.analysis)

            // 检查是否有错误信息
            if (recordDetail.analysis.gemini_error) {
              ElMessage.warning(`分析出现问题: ${recordDetail.analysis.gemini_error}`)
            }

            // 检查转录文本
            if (
              !recordDetail.transcript &&
              (!recordDetail.analysis.raw_result || recordDetail.analysis.raw_result.length === 0)
            ) {
              ElMessage.warning('该会话的转录文本为空，可能是音频识别失败或音频内容为空')
            }
          } else {
            console.warn('该会话暂无 analysis 数据')
            ElMessage.warning('该会话暂无分析数据，可能还在处理中')
          }

          // 构建后端H5分享页URL
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
        } catch (error) {
          loadingMessage.close()
          console.error('获取记录详情失败:', error)
          ElMessage.error('获取记录详情失败，但仍尝试打开分享页')

          // 即使获取详情失败，也尝试打开分享页
          const apiUrl = import.meta.env.VITE_API_URL || ''
          let backendUrl = ''
          if (apiUrl.startsWith('http')) {
            backendUrl = apiUrl
          } else {
            backendUrl = 'https://www.finecv.cn'
          }
          backendUrl = backendUrl.replace(/\/api\/?$/, '')
          const h5Url = `${backendUrl}/share/h5/${row.shareId}`
          window.open(h5Url, '_blank')
        }
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

  const handleComments = async (row: ConversationItem) => {
    currentConversation.value = row
    commentsVisible.value = true
    commentsLoading.value = true
    commentSearchKeyword.value = '' // 重置搜索

    try {
      // 调用获取评论列表的API
      const response = await fetchComments(row.id, {
        page: 1,
        page_size: 100 // 改为合理的数值
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
      commentsLoading.value = false
    }
  }

  // 编辑会话
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
        // 重新加载数据
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
        if (currentConversation.value) {
          handleComments(currentConversation.value)
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
      if (currentConversation.value) {
        handleComments(currentConversation.value)
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除评论失败:', error)
        ElMessage.error('删除评论失败')
      }
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
