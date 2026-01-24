<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></UserSearch>

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增用户</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 用户弹窗 -->
      <UserDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        @submit="handleDialogSubmit"
      />

      <!-- 角色分配弹窗 -->
      <UserRoleDialog
        v-model="roleDialogVisible"
        :user-data="currentUserData"
        @success="refreshData"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchAdminUsers, fetchAdminUserDetail, updateAdminUserStatus } from '@/api/admin'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'
  import UserRoleDialog from './modules/user-role-dialog.vue'
  import { ElTag, ElMessageBox, ElImage, ElMessage } from 'element-plus'
  import { DialogType } from '@/types'
  import { DEFAULT_AVATAR } from '@/utils/constants'

  defineOptions({ name: 'User' })

  type UserListItem = Api.Admin.User

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const roleDialogVisible = ref(false)
  const currentUserData = ref<UserListItem | null>(null)

  // 选中行
  const selectedRows = ref<UserListItem[]>([])

  // 搜索表单
  const searchForm = ref({
    userName: undefined,
    userGender: undefined,
    userPhone: undefined,
    userEmail: undefined,
    status: undefined
  })

  // 用户状态配置
  const USER_STATUS_CONFIG = {
    true: { type: 'success' as const, text: '激活' },
    false: { type: 'danger' as const, text: '禁用' }
  } as const

  /**
   * 获取用户状态配置
   */
  const getUserStatusConfig = (isActive: boolean) => {
    return USER_STATUS_CONFIG[isActive ? 'true' : 'false']
  }

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

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchAdminUsers,
      apiParams: {
        page: 1,
        page_size: 20
      },
      // 自定义分页字段映射
      paginationKey: {
        current: 'page',
        size: 'page_size'
      },
      columnsFactory: () => [
        { type: 'selection' }, // 勾选列
        { type: 'index', width: 60, label: '序号' }, // 序号
        {
          prop: 'id',
          label: 'ID',
          width: 80,
          formatter: (row: UserListItem) => row.id
        },
        {
          prop: 'userInfo',
          label: '用户信息',
          width: 280,
          formatter: (row: UserListItem) => {
            const avatarUrl = row.avatar || DEFAULT_AVATAR
            return h('div', { class: 'user flex-c' }, [
              h(ElImage, {
                class: 'size-9.5 rounded-md',
                src: avatarUrl,
                previewSrcList: [avatarUrl],
                previewTeleported: true,
                fit: 'cover'
              }),
              h('div', { class: 'ml-2' }, [
                h('p', { class: 'user-name' }, row.username),
                h('p', { class: 'email' }, row.email || '未设置邮箱')
              ])
            ])
          }
        },
        {
          prop: 'nickname',
          label: '昵称',
          formatter: (row: UserListItem) => row.nickname || '-'
        },
        {
          prop: 'is_superuser',
          label: '超级管理员',
          width: 120,
          formatter: (row: UserListItem) => {
            return h(ElTag, { type: row.is_superuser ? 'danger' : 'info' }, () =>
              row.is_superuser ? '是' : '否'
            )
          }
        },
        {
          prop: 'is_staff',
          label: '管理员',
          width: 100,
          formatter: (row: UserListItem) => {
            return h(ElTag, { type: row.is_staff ? 'warning' : 'info' }, () =>
              row.is_staff ? '是' : '否'
            )
          }
        },
        {
          prop: 'is_active',
          label: '状态',
          width: 100,
          formatter: (row: UserListItem) => {
            const statusConfig = getUserStatusConfig(row.is_active)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'created_at',
          label: '创建时间',
          width: 160,
          sortable: true,
          formatter: (row: UserListItem) => formatTime(row.created_at)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 180,
          fixed: 'right',
          formatter: (row: UserListItem) =>
            h('div', { class: 'flex gap-2' }, [
              h(ArtButtonTable, {
                type: 'view',
                onClick: () => viewUserDetail(row)
              }),
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => toggleUserStatus(row)
              }),
              h(ArtButtonTable, {
                type: 'edit',
                icon: 'ri:admin-line',
                title: 'role',
                onClick: () => showRoleDialog(row)
              })
            ])
        }
      ]
    },
    // 数据处理
    transform: {
      dataTransformer: (records) => {
        if (!Array.isArray(records)) {
          console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
          return []
        }
        return records
      }
    }
  })

  /**
   * 查看用户详情
   */
  const viewUserDetail = async (row: UserListItem) => {
    try {
      const detail = await fetchAdminUserDetail(row.id)
      ElMessageBox.alert(
        `
          <div style="text-align: left; line-height: 1.8;">
            <p><strong>用户ID:</strong> ${detail.id}</p>
            <p><strong>用户名:</strong> ${detail.username}</p>
            <p><strong>昵称:</strong> ${detail.nickname || '未设置'}</p>
            <p><strong>邮箱:</strong> ${detail.email || '未设置'}</p>
            <p><strong>超级管理员:</strong> ${detail.is_superuser ? '是' : '否'}</p>
            <p><strong>管理员:</strong> ${detail.is_staff ? '是' : '否'}</p>
            <p><strong>账户状态:</strong> ${detail.is_active ? '激活' : '禁用'}</p>
            <p><strong>创建时间:</strong> ${formatTime(detail.created_at)}</p>
          </div>
        `,
        '用户详情',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭'
        }
      )
    } catch (error: any) {
      console.error('获取用户详情失败:', error)
      ElMessage.error('获取用户详情失败')
    }
  }

  /**
   * 切换用户状态
   */
  const toggleUserStatus = async (row: UserListItem) => {
    const newStatus = !row.is_active
    const actionText = newStatus ? '激活' : '禁用'

    try {
      await ElMessageBox.confirm(
        `确定要${actionText}用户 "${row.username}" 吗？`,
        `${actionText}用户`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await updateAdminUserStatus(row.id, { is_active: newStatus })
      ElMessage.success(`${actionText}成功`)
      refreshData()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('更新用户状态失败:', error)
        ElMessage.error(`${actionText}失败`)
      }
    }
  }

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: Record<string, any>) => {
    console.log(params)
    // 搜索参数赋值
    Object.assign(searchParams, params)
    getData()
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: UserListItem): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentUserData.value = row || null
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = null
      refreshData()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 显示角色分配对话框
   */
  const showRoleDialog = (row: UserListItem): void => {
    console.log('打开角色对话框:', row)
    currentUserData.value = row
    roleDialogVisible.value = true
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: UserListItem[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>
