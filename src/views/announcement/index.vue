<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="标题">
          <ElInput v-model="searchForm.title" placeholder="请输入" clearable />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElInput v-model="searchForm.type" placeholder="请输入" clearable />
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
      <ElButton @click="handleExport">导出</ElButton>
    </div>

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable :data="displayData" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn label="id" prop="id" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.id }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="标题" prop="title" min-width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.title }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="类型" prop="type" width="120" align="center">
            <template #default="scope">
              <ElTag :type="scope.row.type === '系统通知' ? 'primary' : 'success'">
                {{ scope.row.type }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="内容" prop="content" min-width="200">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.content }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="创建时间" prop="createTime" width="160" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.createTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="更新时间" prop="updateTime" width="160" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.updateTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="150" align="center" fixed="right">
            <template #default="scope">
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
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AnnouncementManage' })

  interface AnnouncementItem {
    id: number
    title: string
    type: string
    content: string
    createTime: string
    updateTime: string
  }

  const searchForm = reactive({
    title: '',
    type: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')

  const tableData = reactive<AnnouncementItem[]>([
    {
      id: 1,
      title: '平台上线通知',
      type: '系统通知',
      content: '平台已上线，欢迎使用。',
      createTime: '2025-9-2 21:55:29',
      updateTime: '2025-9-2 21:55:29'
    }
  ])

  /**
   * 总数据量
   */
  const total = computed(() => tableData.length)

  /**
   * 当前页显示的数据
   */
  const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return tableData.slice(start, end)
  })

  /**
   * 搜索
   */
  const handleSearch = () => {
    console.log('搜索', searchForm)
    currentPage.value = 1
  }

  /**
   * 重置
   */
  const handleReset = () => {
    searchForm.title = ''
    searchForm.type = ''
    currentPage.value = 1
  }

  /**
   * 新增
   */
  const handleAdd = () => {
    console.log('新增')
  }

  /**
   * 导出
   */
  const handleExport = () => {
    console.log('导出')
  }

  /**
   * 编辑
   */
  const handleEdit = (row: AnnouncementItem) => {
    console.log('编辑', row)
  }

  /**
   * 删除
   */
  const handleDelete = (row: AnnouncementItem) => {
    console.log('删除', row)
  }

  /**
   * 页面大小改变
   */
  const handlePageSizeChange = () => {
    currentPage.value = 1
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
    }
  }
</script>
