<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="标题">
          <ElInput v-model="searchForm.title" placeholder="请输入" clearable />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect
            v-model="searchForm.is_published"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <ElOption label="草稿" :value="false" />
            <ElOption label="已发布" :value="true" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">搜索</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 操作按钮 -->
    <div class="art-card p-5 mb-5">
      <ElButton type="primary" @click="handleAdd">新增</ElButton>
    </div>

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :border="true"
        :stripe="true"
      >
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="标题" prop="title" min-width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.title }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="作者" prop="author_name" width="120" align="center">
            <template #default="scope">
              <span>{{ scope.row.author_name }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="状态" prop="is_published" width="100" align="center">
            <template #default="scope">
              <ElTag :type="scope.row.is_published ? 'success' : 'info'">
                {{ scope.row.is_published ? '已发布' : '草稿' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="优先级" prop="priority" width="100" align="center">
            <template #default="scope">
              <span>{{ scope.row.priority }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="浏览量" prop="view_count" width="100" align="center">
            <template #default="scope">
              <span>{{ scope.row.view_count }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="内容" prop="content" min-width="200">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.content }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="创建时间" prop="created_at" width="160" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ formatDate(scope.row.created_at) }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="更新时间" prop="updated_at" width="160" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ formatDate(scope.row.updated_at) }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="220" align="center" fixed="right">
            <template #default="scope">
              <ElButton
                v-if="!scope.row.is_published"
                type="primary"
                size="small"
                link
                @click="handlePublish(scope.row)"
              >
                发布
              </ElButton>
              <ElButton v-else type="warning" size="small" link @click="handleUnpublish(scope.row)">
                取消发布
              </ElButton>
              <ElButton type="success" size="small" link @click="handleEdit(scope.row)">
                编辑
              </ElButton>
              <ElButton type="danger" size="small" link @click="handleDelete(scope.row)">
                删除
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
          <span>共 {{ total }} 条</span>
          <span>每页</span>
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
          <span>条</span>
        </div>
        <div class="flex items-center gap-2">
          <ElPagination
            small
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="fetchData"
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

    <!-- 新增/编辑对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <ElForm :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <ElFormItem label="标题" prop="title">
          <ElInput v-model="formData.title" placeholder="请输入公告标题" />
        </ElFormItem>
        <ElFormItem label="优先级" prop="priority">
          <ElInputNumber v-model="formData.priority" :min="0" :max="100" style="width: 100%" />
        </ElFormItem>
        <ElFormItem label="内容" prop="content">
          <ElInput
            v-model="formData.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit" :loading="submitLoading">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import {
    fetchAnnouncementList,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement
  } from '@/api/announcement'

  defineOptions({ name: 'AnnouncementManage' })

  const searchForm = reactive<Api.Announcement.AnnouncementListQuery>({
    title: '',
    is_published: undefined
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')
  const total = ref(0)
  const loading = ref(false)
  const tableData = ref<Api.Announcement.AnnouncementItem[]>([])

  // 对话框相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增公告')
  const submitLoading = ref(false)
  const formRef = ref<FormInstance>()
  const editingId = ref<number | null>(null)

  const formData = reactive<Api.Announcement.CreateAnnouncementParams>({
    title: '',
    content: '',
    priority: 0
  })

  const formRules: FormRules = {
    title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
  }

  /**
   * 获取数据
   */
  const fetchData = async () => {
    loading.value = true
    try {
      const res = await fetchAnnouncementList({
        page: currentPage.value,
        page_size: pageSize.value,
        title: searchForm.title || undefined,
        is_published: searchForm.is_published
      })

      tableData.value = res.items
      total.value = res.total
    } catch (error) {
      console.error('获取公告列表失败:', error)
      ElMessage.error('获取公告列表失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    currentPage.value = 1
    fetchData()
  }

  /**
   * 重置
   */
  const handleReset = () => {
    searchForm.title = ''
    searchForm.is_published = undefined
    currentPage.value = 1
    fetchData()
  }

  /**
   * 新增
   */
  const handleAdd = () => {
    dialogTitle.value = '新增公告'
    editingId.value = null
    formData.title = ''
    formData.content = ''
    formData.priority = 0
    dialogVisible.value = true
  }

  /**
   * 编辑
   */
  const handleEdit = (row: Api.Announcement.AnnouncementItem) => {
    dialogTitle.value = '编辑公告'
    editingId.value = row.id
    formData.title = row.title
    formData.content = row.content
    formData.priority = row.priority
    dialogVisible.value = true
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      submitLoading.value = true
      try {
        if (editingId.value) {
          // 编辑
          await updateAnnouncement(editingId.value, formData)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await createAnnouncement(formData)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    })
  }

  /**
   * 删除
   */
  const handleDelete = (row: Api.Announcement.AnnouncementItem) => {
    ElMessageBox.confirm(`确定要删除公告"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await deleteAnnouncement(row.id)
          ElMessage.success('删除成功')
          fetchData()
        } catch (error) {
          console.error('删除失败:', error)
        }
      })
      .catch(() => {
        // 取消删除
      })
  }

  /**
   * 发布公告
   */
  const handlePublish = async (row: Api.Announcement.AnnouncementItem) => {
    try {
      await publishAnnouncement(row.id)
      ElMessage.success('发布成功')
      fetchData()
    } catch (error) {
      console.error('发布失败:', error)
    }
  }

  /**
   * 取消发布公告
   */
  const handleUnpublish = async (row: Api.Announcement.AnnouncementItem) => {
    try {
      await unpublishAnnouncement(row.id)
      ElMessage.success('取消发布成功')
      fetchData()
    } catch (error) {
      console.error('取消发布失败:', error)
    }
  }

  /**
   * 页面大小改变
   */
  const handlePageSizeChange = () => {
    currentPage.value = 1
    fetchData()
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
      fetchData()
    }
  }

  /**
   * 格式化日期
   */
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  // 初始化加载数据
  onMounted(() => {
    fetchData()
  })
</script>
