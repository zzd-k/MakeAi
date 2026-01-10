<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="名称">
          <ElInput v-model="searchForm.name" placeholder="请输入" clearable />
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
          <ElTableColumn label="类型名称" prop="name" min-width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.name }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="图标" prop="icon" width="100" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i :class="scope.row.icon" class="text-xl text-primary"></i>
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="路径资源" prop="path" min-width="200">
            <template #default="scope">
              <span class="text-g-600 font-mono text-sm">{{ scope.row.path }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="创建时间" prop="createTime" width="160" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.createTime }}</span>
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
  defineOptions({ name: 'SessionTypeManage' })

  interface SessionTypeItem {
    id: number
    name: string
    icon: string
    path: string
    createTime: string
  }

  const searchForm = reactive({
    name: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')

  const tableData = reactive<SessionTypeItem[]>([
    {
      id: 121,
      name: '验证会话',
      icon: 'ri:chat-check-line',
      path: '/adsa/sjja/cssaa/aaksa/asaab',
      createTime: '2025-9-2 21:11'
    }
  ])

  const total = computed(() => tableData.length)

  const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return tableData.slice(start, end)
  })

  const handleSearch = () => {
    console.log('搜索', searchForm)
    currentPage.value = 1
  }

  const handleReset = () => {
    searchForm.name = ''
    currentPage.value = 1
  }

  const handleAdd = () => {
    console.log('新增')
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleEdit = (row: SessionTypeItem) => {
    console.log('编辑', row)
  }

  const handleDelete = (row: SessionTypeItem) => {
    console.log('删除', row)
  }

  const handlePageSizeChange = () => {
    currentPage.value = 1
  }

  const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    const totalPages = Math.ceil(total.value / pageSize.value)
    if (page && page > 0 && page <= totalPages) {
      currentPage.value = page
      jumpPage.value = ''
    }
  }
</script>
