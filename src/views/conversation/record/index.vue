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

  const tableData = reactive<ConversationItem[]>([
    {
      id: 1211,
      creator: 'Hy-1231122',
      title: '阿Ben金融绘画记录',
      type: '通用对话',
      isShared: true,
      shareDesc: '这是我最喜欢的会话，会跟谁睡觉呢，可提供参考',
      createTime: '2025-9-2 21:55:29',
      views: 2131
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
    searchForm.title = ''
    searchForm.type = ''
    searchForm.isShared = ''
    currentPage.value = 1
  }

  const handleAdd = () => {
    console.log('新增')
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleStats = (row: ConversationItem) => {
    console.log('会话统计', row)
  }

  const handleTimeline = (row: ConversationItem) => {
    console.log('时间轴', row)
  }

  const handleEdit = (row: ConversationItem) => {
    console.log('编辑', row)
  }

  const handleDelete = (row: ConversationItem) => {
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
