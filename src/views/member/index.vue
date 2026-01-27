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

    <!-- 数据表格 -->
    <div class="art-card p-5">
      <ArtTable
        :data="displayData"
        style="width: 100%"
        :border="true"
        :stripe="true"
        v-loading="loading"
      >
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
                  分享会话
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
                <ElButton type="primary" @click="handleCardSearch">搜索</ElButton>
                <ElButton type="primary" @click="handleCardAdd">新增</ElButton>
                <ElButton @click="handleExport">导出</ElButton>
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
                  <ElButton type="success" size="small" link @click="handleCardEditItem(scope.row)"
                    >编辑</ElButton
                  >
                  <ElButton type="danger" size="small" link @click="handleCardDelete(scope.row)"
                    >删除</ElButton
                  >
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

    <!-- 会话统计弹窗 -->
    <ElDialog v-model="sessionStatsVisible" title="会话统计" width="80%">
      <div class="mb-4">
        <span class="text-g-600">用户：</span>
        <span class="font-medium">{{ currentUser?.nickname }}</span>
      </div>
      <ArtTable
        :data="sessionList"
        style="width: 100%"
        :border="true"
        :stripe="true"
        v-loading="sessionLoading"
      >
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center" />
          <ElTableColumn label="会话标题" prop="meeting_name" min-width="200" />
          <ElTableColumn label="类型" prop="kind" width="120" align="center" />
          <ElTableColumn label="时长" prop="duration" width="100" align="center">
            <template #default="scope">
              <span v-if="scope.row.duration && scope.row.duration > 0">
                {{ Math.floor(scope.row.duration / 60) }}分{{ scope.row.duration % 60 }}秒
              </span>
              <span v-else class="text-g-400">暂无数据</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="创建时间" prop="created_at" width="180" align="center">
            <template #default="scope">
              {{ new Date(scope.row.created_at).toLocaleString('zh-CN') }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="描述" prop="description" min-width="200">
            <template #default="scope">
              <span v-if="scope.row.description" class="text-g-600">{{
                scope.row.description
              }}</span>
              <span v-else class="text-g-400">暂无描述</span>
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>
      <div class="flex justify-end mt-4">
        <ElPagination
          small
          background
          layout="prev, pager, next, total"
          :total="sessionTotal"
          :page-size="10"
          v-model:current-page="sessionPage"
          @current-change="fetchSessionStats"
        />
      </div>
    </ElDialog>

    <!-- 分享记录弹窗 -->
    <ElDialog v-model="shareReadVisible" title="分享中的会话" width="80%">
      <div class="mb-4">
        <span class="text-g-600">用户：</span>
        <span class="font-medium">{{ currentUser?.nickname }}</span>
      </div>
      <ArtTable
        :data="sharedList"
        style="width: 100%"
        :border="true"
        :stripe="true"
        v-loading="shareLoading"
      >
        <template #default>
          <ElTableColumn label="ID" prop="id" width="80" align="center" />
          <ElTableColumn label="会话标题" prop="meeting_name" min-width="200" />
          <ElTableColumn label="浏览量" prop="view_count" width="100" align="center">
            <template #default="scope">
              <span
                v-if="scope.row.view_count !== undefined && scope.row.view_count !== null"
                class="font-medium text-primary"
              >
                {{ scope.row.view_count }}
              </span>
              <span v-else class="text-g-400">0</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="分享时间" prop="created_at" width="180" align="center">
            <template #default="scope">
              {{ new Date(scope.row.created_at).toLocaleString('zh-CN') }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="描述" prop="description" min-width="200">
            <template #default="scope">
              <span v-if="scope.row.description" class="text-g-600">{{
                scope.row.description
              }}</span>
              <span v-else class="text-g-400">暂无描述</span>
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>
      <div class="flex justify-end mt-4">
        <ElPagination
          small
          background
          layout="prev, pager, next, total"
          :total="shareTotal"
          :page-size="10"
          v-model:current-page="sharePage"
          @current-change="fetchShareRead"
        />
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import avatar1 from '@/assets/images/avatar/avatar1.webp'
  import CardDetailForm from './CardDetailForm.vue'
  import { fetchAdminUsers, fetchAdminRecords } from '@/api/admin'
  import { ElMessage, ElMessageBox } from 'element-plus'

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
  const loading = ref(false)

  const tableData = ref<MemberItem[]>([])
  const total = ref(0)

  /**
   * 当前页显示的数据
   */
  const displayData = computed(() => tableData.value)

  /**
   * 获取用户列表
   */
  const fetchUserList = async () => {
    try {
      loading.value = true

      // 查询参数
      const params: any = {
        page: currentPage.value,
        page_size: pageSize.value
      }

      if (searchForm.memberId) {
        params.user_id = searchForm.memberId
      }
      if (searchForm.nickname) {
        params.search = searchForm.nickname
      }

      console.log('搜索参数:', params)

      const response = await fetchAdminUsers(params)

      console.log('后端返回数据:', response)
      console.log('API返回总数:', response.total)

      // 将API数据转换为表格数据格式
      tableData.value = response.items.map((user) => ({
        memberId: String(user.id),
        nickname: user.nickname || user.username,
        avatar: user.avatar || avatar1,
        phone: '-', // API暂无此字段
        email: user.email || '-',
        position: '-', // API暂无此字段
        sessionCount: 0, // API暂无此字段
        likes: 0, // API暂无此字段
        shares: 0, // API暂无此字段
        comments: 0, // API暂无此字段
        registerTime: new Date(user.created_at).toLocaleDateString('zh-CN'),
        remark: '-'
      }))

      // 使用后端返回的总数
      total.value = response.total

      console.log('数据条数:', tableData.value.length, '总数:', total.value)
    } catch (error) {
      console.error('获取用户列表失败:', error)
      ElMessage.error('获取用户列表失败')
      tableData.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    console.log('搜索', searchForm)
    currentPage.value = 1
    fetchUserList()
  }

  /**
   * 重置
   */
  const handleReset = () => {
    searchForm.memberId = ''
    searchForm.nickname = ''
    currentPage.value = 1
    fetchUserList()
  }

  /**
   * 监听页码变化
   */
  watch(currentPage, () => {
    fetchUserList()
  })

  /**
   * 初始化加载数据
   */
  onMounted(() => {
    fetchUserList()
  })

  /**
   * 名片编辑相关（保留用于CardDetailForm组件）
   */
  const editVisible = ref(false)
  const editMode = ref<'create' | 'edit'>('create')

  const handleAdd = () => {
    editMode.value = 'create'
    editVisible.value = true
  }

  const handleSaveCard = (data: any) => {
    console.log('保存名片数据:', data)
    ElMessage.success('保存成功')
  }

  const handleExport = () => {
    console.log('导出')
  }

  /**
   * 会话统计
   */
  const sessionStatsVisible = ref(false)
  const sessionLoading = ref(false)
  const sessionList = ref<any[]>([])
  const sessionTotal = ref(0)
  const sessionPage = ref(1)
  const currentUser = ref<MemberItem | null>(null)

  const handleSessionStats = async (row: MemberItem) => {
    currentUser.value = row
    sessionStatsVisible.value = true
    sessionPage.value = 1
    await fetchSessionStats()
  }

  const fetchSessionStats = async () => {
    if (!currentUser.value) return

    try {
      sessionLoading.value = true
      const response = await fetchAdminRecords({
        page: sessionPage.value,
        page_size: 10
      })

      sessionList.value = response.items
      sessionTotal.value = response.total
    } catch (error) {
      console.error('获取会话统计失败:', error)
      ElMessage.error('获取会话统计失败')
    } finally {
      sessionLoading.value = false
    }
  }

  /**
   * 分享/阅读
   */
  const shareReadVisible = ref(false)
  const shareReadTab = ref('shared')
  const shareLoading = ref(false)
  const sharedList = ref<any[]>([])
  const shareTotal = ref(0)
  const sharePage = ref(1)

  const handleShareRead = async (row: MemberItem) => {
    currentUser.value = row
    shareReadVisible.value = true
    sharePage.value = 1
    await fetchShareRead()
  }

  const fetchShareRead = async () => {
    if (!currentUser.value) return

    try {
      shareLoading.value = true
      // 获取分享中的会话（is_shared=true的记录）
      const response = await fetchAdminRecords({
        page: sharePage.value,
        page_size: 10
      })

      // 过滤出分享中的会话
      sharedList.value = response.items.filter((item: any) => item.is_shared)
      shareTotal.value = sharedList.value.length
    } catch (error) {
      console.error('获取分享记录失败:', error)
      ElMessage.error('获取分享记录失败')
    } finally {
      shareLoading.value = false
    }
  }

  /**
   * 卡片管理
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

  const cardDialogVisible = ref(false)
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

  /**
   * 打开卡片管理弹窗
   */
  const handlePersonalCard = (row: MemberItem) => {
    console.log('卡片管理', row)
    currentUser.value = row
    cardDialogVisible.value = true
  }

  /**
   * 关闭卡片管理弹窗
   */
  const handleCloseCardDialog = () => {
    cardDialogVisible.value = false
  }

  /**
   * 搜索卡片
   */
  const handleCardSearch = () => {
    console.log('搜索卡片:', cardSearch.value)
  }

  /**
   * 新增卡片
   */
  const handleCardAdd = () => {
    editMode.value = 'create'
    editVisible.value = true
  }

  /**
   * 预览卡片
   */
  const handleCardPreview = (row: CardItem) => {
    console.log('预览', row)
  }

  /**
   * 编辑卡片
   */
  const handleCardEditItem = (row: CardItem) => {
    editMode.value = 'edit'
    editVisible.value = true
    console.log('编辑卡片', row)
  }

  /**
   * 删除卡片
   */
  const handleCardDelete = (row: CardItem) => {
    ElMessageBox.confirm('确定要删除这张名片吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const idx = cardTableData.indexOf(row)
        if (idx > -1) cardTableData.splice(idx, 1)
        ElMessage.success('删除成功')
      })
      .catch(() => {
        // 取消删除
      })
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
    fetchUserList()
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
