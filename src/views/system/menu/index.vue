<!-- 菜单管理页面 -->
<template>
  <div class="menu-page art-full-height">
    <!-- 搜索栏 -->
    <ArtSearchBar
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton v-auth="'add'" @click="handleAddMenu(0)" v-ripple> 添加一级菜单 </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? '收起' : '展开' }}
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data="filteredTableData"
        :stripe="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="false"
      />

      <!-- 菜单弹窗 -->
      <MenuDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :editData="editData"
        :parent-id="parentId"
        @submit="handleSubmitSuccess"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import MenuDialog from './modules/menu-dialog.vue'
  import { fetchGetMenuList, fetchDeleteMenu } from '@/api/system/menu'
  import { ElTag, ElMessageBox, ElMessage } from 'element-plus'
  import { useTable } from '@/hooks/core/useTable' // Assuming useTable is imported

  defineOptions({ name: 'Menus' })

  type MenuListItem = Api.SystemManage.MenuListItem

  // 状态管理
  const loading = ref(false)
  const isExpanded = ref(false)
  const tableRef = ref()

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const editData = ref<MenuListItem | null>(null)
  const parentId = ref<number>(0)

  // 搜索相关
  const initialSearchState = {
    keyword: ''
  }

  const formFilters = reactive({ ...initialSearchState })

  const formItems = computed(() => [
    {
      label: '关键字',
      key: 'keyword',
      type: 'input',
      props: { placeholder: '菜单名称/路由地址', clearable: true }
    }
  ])

  onMounted(() => {
    getMenuList()
  })

  // 数据相关
  const tableData = ref<MenuListItem[]>([])

  /**
   * 获取菜单列表数据
   */
  const getMenuList = async (): Promise<void> => {
    loading.value = true
    try {
      const res = await fetchGetMenuList({ ...formFilters, tree: true })
      // If API returns { list: [], total: 0 } or just [] depending on implementation
      // Assuming it might return just list for tree
      tableData.value = Array.isArray(res) ? res : res.items || res.list || []
    } catch (error) {
      console.error(error)
      ElMessage.error('获取菜单失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取菜单类型标签颜色
   */
  const getMenuTypeTag = (type: string) => {
    switch (type) {
      case 'directory':
        return 'info' // 目录
      case 'menu':
        return 'primary' // 菜单
      case 'button':
        return 'danger' // 按钮
      default:
        return 'info'
    }
  }

  /**
   * 获取菜单类型文本
   */
  const getMenuTypeText = (type: string) => {
    switch (type) {
      case 'directory':
        return '目录'
      case 'menu':
        return '菜单'
      case 'button':
        return '按钮'
      default:
        return '未知'
    }
  }

  // 表格列配置
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'menu_name',
      label: '菜单名称',
      minWidth: 150
    },
    {
      prop: 'menu_type',
      label: '类型',
      width: 80,
      formatter: (row: MenuListItem) => {
        return h(ElTag, { type: getMenuTypeTag(row.menu_type) }, () =>
          getMenuTypeText(row.menu_type)
        )
      }
    },
    {
      prop: 'icon',
      label: '图标',
      width: 60,
      formatter: (row: MenuListItem) => {
        return row.icon ? h('div', { class: row.icon }) : '' // Simplify icon rendering or use an Icon component
      }
    },
    {
      prop: 'route',
      label: '路由路径',
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'component',
      label: '组件路径',
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'permission_code',
      label: '权限标识',
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'sort_order',
      label: '排序',
      width: 80
    },
    {
      prop: 'status',
      label: '状态',
      width: 80,
      formatter: (row: MenuListItem) =>
        h(ElTag, { type: row.status ? 'success' : 'info' }, () => (row.status ? '启用' : '禁用'))
    },
    {
      prop: 'operation',
      label: '操作',
      width: 200,
      align: 'right',
      fixed: 'right',
      formatter: (row: MenuListItem) => {
        const buttons = []

        // Add Submenu (only for Directory or Menu)
        if (['directory', 'menu'].includes(row.menu_type)) {
          buttons.push(
            h(ArtButtonTable, {
              type: 'add',
              title: '新增',
              onClick: () => handleAddMenu(row.id)
            })
          )
        }

        buttons.push(
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditMenu(row)
          })
        )

        buttons.push(
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteMenu(row)
          })
        )

        return h('div', { style: 'text-align: right' }, buttons)
      }
    }
  ])

  /**
   * 重置搜索条件
   */
  const handleReset = (): void => {
    Object.assign(formFilters, initialSearchState)
    getMenuList()
  }

  /**
   * 执行搜索
   */
  const handleSearch = (): void => {
    getMenuList()
  }

  /**
   * 刷新菜单列表
   */
  const handleRefresh = (): void => {
    getMenuList()
  }

  // 过滤后的表格数据 (Client-side filtering if API doesn't support tree search well, but here we assume API or simple list is sufficient)
  // Since we rely on API for searching usually, or if we want client side tree search:
  const filteredTableData = computed(() => tableData.value)

  /**
   * 添加菜单
   */
  const handleAddMenu = (pId: number): void => {
    dialogType.value = 'add'
    editData.value = null
    parentId.value = pId
    dialogVisible.value = true
  }

  /**
   * 编辑菜单
   */
  const handleEditMenu = (row: MenuListItem): void => {
    dialogType.value = 'edit'
    editData.value = row
    parentId.value = row.parent_id || 0
    dialogVisible.value = true
  }

  /**
   * 提交成功回调
   */
  const handleSubmitSuccess = (): void => {
    getMenuList()
  }

  /**
   * 删除菜单
   */
  const handleDeleteMenu = async (row: MenuListItem): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteMenu(row.id)
      ElMessage.success('删除成功')
      getMenuList()
    } catch (error) {
      // Cancel
    }
  }

  /**
   * 切换展开/收起所有菜单
   */
  const toggleExpand = (): void => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      if (tableRef.value?.elTableRef && filteredTableData.value) {
        const processRows = (rows: MenuListItem[]) => {
          rows.forEach((row) => {
            if (row.children?.length) {
              tableRef.value.elTableRef.toggleRowExpansion(row, isExpanded.value)
              processRows(row.children)
            }
          })
        }
        processRows(filteredTableData.value)
      }
    })
  }
</script>
