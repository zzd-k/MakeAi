<template>
  <div class="p-5">
    <!-- 搜索栏 -->
    <div class="art-card p-5 mb-5">
      <ElForm :inline="true" :model="searchForm">
        <ElFormItem label="会员号">
          <ElInput v-model="searchForm.memberId" placeholder="请输入" clearable />
        </ElFormItem>
        <ElFormItem label="昵称">
          <ElInput v-model="searchForm.nickname" placeholder="请输入" clearable />
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
      <ArtTable
        :data="tableData"
        style="width: 100%"
        :border="true"
        :stripe="true"
      >
        <template #default>
          <ElTableColumn label="序号" type="index" width="80" align="center" />
          <ElTableColumn label="会员号" prop="memberId" width="120" align="center" />
          <ElTableColumn label="用户昵称" prop="nickname" width="120" />
          <ElTableColumn label="用户头像" prop="avatar" width="100" align="center">
            <template #default="scope">
              <img :src="scope.row.avatar" class="size-10 rounded-lg" alt="avatar" />
            </template>
          </ElTableColumn>
          <ElTableColumn label="手机号" prop="phone" width="140" />
          <ElTableColumn label="邮箱" prop="email" width="180" />
          <ElTableColumn label="我的职位" prop="position" width="120" />
          <ElTableColumn label="会话数量" prop="sessionCount" width="100" align="center" />
          <ElTableColumn label="点赞" prop="likes" width="80" align="center" />
          <ElTableColumn label="分享" prop="shares" width="80" align="center" />
          <ElTableColumn label="评论" prop="comments" width="80" align="center" />
          <ElTableColumn label="活跃时间" prop="activeTime" width="120" />
          <ElTableColumn label="备注" prop="remark" width="120" />
          <ElTableColumn label="操作" width="280" align="center" fixed="right">
            <template #default="scope">
              <ElButton type="primary" size="small" plain>会话统计</ElButton>
              <ElButton type="success" size="small" plain>分享/阅读</ElButton>
              <ElButton type="warning" size="small" plain>个人名片</ElButton>
              <ElButton type="info" size="small" link @click="handleEdit(scope.row)">
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
      <div class="flex items-center justify-between mt-4 text-sm text-g-600">
        <div class="flex items-center">
          <span>共 {{ total }} 条</span>
          <span class="mx-2">每页</span>
          <ElSelect v-model="pageSize" size="small" style="width: 80px">
            <ElOption label="10" :value="10" />
            <ElOption label="20" :value="20" />
            <ElOption label="50" :value="50" />
          </ElSelect>
          <span class="ml-1">条</span>
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
          <span>前往</span>
          <ElInput
            v-model="jumpPage"
            size="small"
            style="width: 60px"
            @keyup.enter="handleJumpPage"
          />
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import avatar1 from '@/assets/images/avatar/avatar1.webp'

  defineOptions({ name: 'MemberCenter' })

  interface MemberItem {
    memberId: string
    nickname: string
    avatar: string
    phone: string
    email: string
    position: string
    sessionCount: number
    likes: number
    shares: number
    comments: number
    activeTime: string
    remark: string
  }

  const searchForm = reactive({
    memberId: '',
    nickname: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')
  const total = ref(1)

  const tableData = reactive<MemberItem[]>([
    {
      memberId: '12551',
      nickname: '12班',
      avatar: avatar1,
      phone: '8528291822',
      email: '-',
      position: '产品经理',
      sessionCount: 121,
      likes: 21,
      shares: 21,
      comments: 12,
      activeTime: '2025-9-2',
      remark: '-'
    }
  ])

  total.value = tableData.length

  const handleSearch = () => {
    console.log('搜索', searchForm)
  }

  const handleReset = () => {
    searchForm.memberId = ''
    searchForm.nickname = ''
  }

  const handleAdd = () => {
    console.log('新增')
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleEdit = (row: MemberItem) => {
    console.log('编辑', row)
  }

  const handleDelete = (row: MemberItem) => {
    console.log('删除', row)
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
