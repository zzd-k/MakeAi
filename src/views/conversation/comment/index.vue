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

    <!-- 操作按钮 -->
    <div class="art-card p-5 mb-5">
      <ElButton type="primary" @click="handleAdd">{{ $t('pages.commentRecord.add') }}</ElButton>
      <ElButton @click="handleExport">{{ $t('pages.commentRecord.export') }}</ElButton>
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
            :label="$t('pages.commentRecord.edit')"
            width="150"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <ElButton type="success" size="small" link @click="handleEdit(scope.row)">
                {{ $t('pages.commentRecord.edit') }}
              </ElButton>
              <ElButton type="danger" size="small" link @click="handleDelete(scope.row)">
                {{ $t('pages.commentRecord.delete') }}
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
  import { useI18n } from 'vue-i18n'

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
  }

  const searchForm = reactive({
    user: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')

  const tableData = reactive<CommentItem[]>([
    {
      id: 121,
      title: 'Ben会话金融2025-2-11',
      conversationId: '12311',
      user: 'HY-211232131',
      content: '很棒',
      commentTime: '2025-9-2 21:55:29',
      actionType: '评论'
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
    searchForm.user = ''
    currentPage.value = 1
  }

  const handleAdd = () => {
    console.log('新增')
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleEdit = (row: CommentItem) => {
    console.log('编辑', row)
  }

  const handleDelete = (row: CommentItem) => {
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
