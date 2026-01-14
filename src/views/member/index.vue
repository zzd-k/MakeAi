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
      <ArtTable :data="displayData" style="width: 100%" :border="true" :stripe="true">
        <template #default>
          <ElTableColumn label="序号" type="index" width="80" align="center" />
          <ElTableColumn label="会员号" prop="memberId" width="100" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.memberId }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="用户昵称" prop="nickname" width="120">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.nickname }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="用户头像" prop="avatar" width="100" align="center">
            <template #default="scope">
              <img :src="scope.row.avatar" class="size-12 rounded-lg object-cover" alt="avatar" />
            </template>
          </ElTableColumn>
          <ElTableColumn label="手机号" prop="phone" width="130">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.phone }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="邮箱" prop="email" width="100" align="center">
            <template #default="scope">
              <span class="text-g-500">{{ scope.row.email }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="我的职位" prop="position" width="120">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.position }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="会话数量" prop="sessionCount" width="100" align="center">
            <template #default="scope">
              <span class="font-semibold text-primary">{{ scope.row.sessionCount }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="点赞" prop="likes" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.likes }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="分享" prop="shares" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.shares }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="评论" prop="comments" width="80" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.comments }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="注册时间" prop="registerTime" width="120" align="center">
            <template #default="scope">
              <span class="text-g-600">{{ scope.row.registerTime }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="备注" prop="remark" width="100" align="center">
            <template #default="scope">
              <span class="text-g-500">{{ scope.row.remark }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="450" align="center" fixed="right">
            <template #default="scope">
              <div class="flex items-center justify-center gap-2">
                <ElButton type="info" size="small" plain @click="handleSessionStats(scope.row)">
                  会话统计
                </ElButton>
                <ElButton type="primary" size="small" plain @click="handleShareRead(scope.row)">
                  分享/阅读
                </ElButton>
                <ElButton type="warning" size="small" plain @click="handlePersonalCard(scope.row)">
                  卡片管理
                </ElButton>
                <ElButton type="success" size="small" link @click="handleEdit(scope.row)">
                  编辑
                </ElButton>
                <ElButton type="danger" size="small" link @click="handleDelete(scope.row)">
                  删除
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
    <!-- 卡片管理弹窗 -->
    <ElDialog
      v-model="cardDialogVisible"
      title="卡片管理"
      width="80%"
      @close="handleCloseCardDialog"
    >
      <template #default>
        <!-- 卡片管理内容 -->
        <div class="p-5">
          <!-- 搜索 + 操作栏 -->
          <div class="p-5 mb-5 flex items-center flex-nowrap gap-4">
            <ElForm :inline="true" class="flex items-center gap-4 flex-1">
              <ElFormItem>
                <ElInput v-model="cardSearch" placeholder="请输入" clearable />
              </ElFormItem>
              <ElFormItem>
                <ElButton type="primary">搜索</ElButton>
                <ElButton type="primary">新增</ElButton>
                <ElButton>导出</ElButton>
              </ElFormItem>
            </ElForm>
          </div>
          <!-- 表格 -->
          <ArtTable :data="cardTableData" style="width: 100%" :border="true" :stripe="true">
            <template #default>
              <ElTableColumn label="ID" prop="id" width="80" align="center" />
              <ElTableColumn label="名片称谓" prop="title" width="120" />
              <ElTableColumn label="自我介绍" prop="intro" width="120">
                <template #default="scope">
                  <img :src="scope.row.intro" class="size-12 rounded-lg object-cover" />
                </template>
              </ElTableColumn>
              <ElTableColumn label="英文名" prop="firstNameEn" width="120" />
              <ElTableColumn label="英文姓氏" prop="lastNameEn" width="120" />
              <ElTableColumn label="中文名" prop="firstName" width="120" />
              <ElTableColumn label="中文姓氏" prop="lastName" width="120" />
              <ElTableColumn label="联系电话" prop="phone" width="140" />
              <ElTableColumn label="邮箱" prop="email" width="160" />
              <ElTableColumn label="公司信息" prop="company" width="200" />
              <ElTableColumn label="产品" prop="product" width="100" align="center" />
              <ElTableColumn label="动态" prop="trend" width="100" align="center" />
              <ElTableColumn label="操作" width="200" align="center" fixed="right">
                <template #default="scope">
                  <ElButton type="primary" size="small" link @click="handleCardPreview(scope.row)"
                    >预览</ElButton
                  >
                  <ElButton type="success" size="small" link @click="handleCardEdit(scope.row)"
                    >编辑</ElButton
                  >
                  <ElButton type="danger" size="small" link>删除</ElButton>
                </template>
              </ElTableColumn>
            </template>
          </ArtTable>
          <!-- 分页 -->
          <div
            class="flex items-center justify-between mt-4 pt-3 border-t border-g-200 text-sm text-g-600"
          >
            <div class="flex items-center gap-2">
              <span>共 {{ cardTotal }} 条</span>
              <span>每页</span>
              <ElSelect v-model="cardPageSize" size="small" style="width: 70px">
                <ElOption label="10" :value="10" />
                <ElOption label="20" :value="20" />
                <ElOption label="50" :value="50" />
              </ElSelect>
              <span>条</span>
            </div>
            <ElPagination
              small
              background
              layout="prev, pager, next"
              :total="cardTotal"
              :page-size="cardPageSize"
              v-model:current-page="cardCurrentPage"
            />
          </div>
        </div>
      </template>
    </ElDialog>

    <!-- 卡片新增/编辑弹窗 -->
    <CardDetailForm
      v-model:visible="editVisible"
      :dialog-title="editMode === 'create' ? '新增名片' : '卡片详情'"
      @save="handleSaveCard"
    />
  </div>
</template>

<script setup lang="ts">
  import avatar1 from '@/assets/images/avatar/avatar1.webp'
  import CardDetailForm from './CardDetailForm.vue'

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
    registerTime: string
    remark: string
  }

  const searchForm = reactive({
    memberId: '',
    nickname: ''
  })

  const pageSize = ref(10)
  const currentPage = ref(1)
  const jumpPage = ref('')

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
      registerTime: '2025-9-2',
      remark: '-'
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
    searchForm.memberId = ''
    searchForm.nickname = ''
    currentPage.value = 1
  }

  /**
   * 新增
   */
  const editVisible = ref(false)
  const editMode = ref<'create' | 'edit'>('create')
  const currentCard = ref<CardItem | null>(null)

  const handleCardEdit = (row: CardItem) => {
    currentCard.value = row
    editMode.value = 'edit'
    editVisible.value = true
  }

  const handleAdd = () => {
    currentCard.value = null
    editMode.value = 'create'
    editVisible.value = true
  }

  /**
   * 导出
   */
  const handleSaveCard = (data: CardItem) => {
    if (editMode.value === 'create') {
      cardTableData.push({ id: Date.now(), ...data })
    } else if (currentCard.value) {
      Object.assign(currentCard.value, data)
    }
  }

  const handleExport = () => {
    console.log('导出')
  }

  /**
   * 会话统计
   */
  const handleSessionStats = (row: MemberItem) => {
    console.log('会话统计', row)
  }

  /**
   * 分享/阅读
   */
  const handleShareRead = (row: MemberItem) => {
    console.log('分享/阅读', row)
  }

  /**
   * 卡片管理
   */
  /**
   * 卡片管理 - 打开弹窗
   */
  const cardDialogVisible = ref(false)

  const handlePersonalCard = (row: MemberItem) => {
    console.log('卡片管理', row)
    cardDialogVisible.value = true
  }

  /**
   * 关闭卡片管理弹窗
   */
  const handleCloseCardDialog = () => {
    cardDialogVisible.value = false
  }

  /**
   * 编辑
   */
  const handleEdit = (row: MemberItem) => {
    console.log('编辑', row)
  }

  /**
   * 删除
   */
  const handleDelete = (row: MemberItem) => {
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
  /**
   * 卡片管理表格数据
   */
  interface CardItem {
    id?: number
    title: string
    intro: string
    firstNameEn: string
    lastNameEn: string
    firstName: string
    lastName: string
    phone: string
    email: string
    company: string
    product: number
    trend: number
  }

  const cardSearch = ref('')
  const cardPageSize = ref(10)
  const cardCurrentPage = ref(1)

  const cardTableData = reactive<CardItem[]>([
    {
      id: 1,
      title: '【範例】陳嘉欣',
      intro: avatar1,
      firstNameEn: 'Jack',
      lastNameEn: 'Ma',
      firstName: '马',
      lastName: '云',
      phone: '123456789',
      email: 'jack@example.com',
      company: '阿里巴巴',
      product: 12,
      trend: 3
    }
  ])
  const cardTotal = computed(() => cardTableData.length)

  const handleCardPreview = (row: CardItem) => {
    console.log('预览', row)
  }
  // const handleCardDelete = (row: CardItem) => {
  //   const idx = cardTableData.indexOf(row)
  //   if (idx > -1) cardTableData.splice(idx, 1)
  // }
</script>
