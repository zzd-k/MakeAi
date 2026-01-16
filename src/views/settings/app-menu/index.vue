<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem :label="$t('pages.appMenuSettings.name')">
          <ElInput
            v-model="searchForm.name"
            :placeholder="$t('pages.appMenuSettings.placeholder')"
            clearable
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">{{
            $t('pages.appMenuSettings.search')
          }}</ElButton>
          <ElButton @click="handleReset">{{ $t('pages.appMenuSettings.reset') }}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 操作按钮 -->
    <div class="art-card p-5 mb-5">
      <ElButton type="primary" @click="handleAdd">{{ $t('pages.appMenuSettings.add') }}</ElButton>
      <ElButton @click="handleExport">{{ $t('pages.appMenuSettings.export') }}</ElButton>
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
          <ElTableColumn :label="$t('pages.appMenuSettings.menuName')" prop="name" min-width="150">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.name }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.appMenuSettings.icon')"
            prop="icon"
            width="100"
            align="center"
          >
            <template #default="scope">
              <div class="flex items-center justify-center">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i :class="scope.row.icon" class="text-xl text-primary"></i>
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.appMenuSettings.pathResource')"
            prop="path"
            min-width="200"
          >
            <template #default="scope">
              <span class="text-g-600 font-mono text-sm">{{ scope.row.path }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.appMenuSettings.createTime')"
            prop="createTime"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.createTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="$t('pages.appMenuSettings.edit')"
            width="150"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <ElButton type="success" size="small" link @click="handleEdit(scope.row)">
                {{ $t('pages.appMenuSettings.edit') }}
              </ElButton>
              <ElButton type="danger" size="small" link @click="handleDelete(scope.row)">
                {{ $t('pages.appMenuSettings.delete') }}
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
  import { ref, reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  defineOptions({ name: 'AppMenuSetting' })

  const { t: $t } = useI18n()

  interface AppMenuItem {
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

  const tableData = reactive<AppMenuItem[]>([
    {
      id: 121,
      name: '验证会话',
      icon: 'ri:file-list-3-line',
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

  const handleEdit = (row: AppMenuItem) => {
    console.log('编辑', row)
  }

  const handleDelete = (row: AppMenuItem) => {
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
