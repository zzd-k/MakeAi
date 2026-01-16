<template>
  <ElDialog
    v-model="visible"
    title="菜单权限"
    width="520px"
    align-center
    class="el-dialog-border"
    @close="handleClose"
  >
    <ElScrollbar height="70vh">
      <ElTree
        ref="treeRef"
        :data="menuTree"
        show-checkbox
        node-key="id"
        :default-expand-all="isExpandAll"
        :props="defaultProps"
        @check="handleTreeCheck"
      >
        <template #default="{ data }">
          <div style="display: flex; align-items: center">
            <span v-if="data.menu_type === 'button'">
              <ElTag size="small" type="info" style="margin-right: 4px">按钮</ElTag>
              {{ data.menu_name }}
            </span>
            <span v-else>{{ data.menu_name }}</span>
          </div>
        </template>
      </ElTree>
    </ElScrollbar>
    <template #footer>
      <ElButton @click="toggleExpandAll">{{ isExpandAll ? '全部收起' : '全部展开' }}</ElButton>
      <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{
        isSelectAll ? '取消全选' : '全部选择'
      }}</ElButton>
      <ElButton type="primary" :loading="submitLoading" @click="savePermission">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { fetchGetMenuList } from '@/api/system/menu'
  import { fetchRoleMenus, fetchUpdateRoleMenus } from '@/api/system/role'
  import { ElMessage } from 'element-plus'
  import type { ElTree } from 'element-plus'

  type RoleListItem = Api.SystemManage.RoleListItem
  // We'll use a local interface for the tree if the API type is complex or we need to adapt it
  // Assuming fetchGetMenuList returns the tree structure comparable to what we need

  interface Props {
    modelValue: boolean
    roleData?: RoleListItem
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    roleData: undefined
  })

  const emit = defineEmits<Emits>()

  const treeRef = ref<InstanceType<typeof ElTree>>()
  const isExpandAll = ref(false)
  const isSelectAll = ref(false)
  const menuTree = ref<any[]>([])
  const submitLoading = ref(false)

  /**
   * 弹窗显示状态双向绑定
   */
  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  /**
   * 树形组件配置
   */
  const defaultProps = {
    children: 'children',
    label: 'menu_name'
  }

  /**
   * 在树中递归查找指定 ID 的节点
   */
  const findNodeById = (nodes: any[], id: number): any => {
    for (const node of nodes) {
      if (node.id === id) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 获取菜单树数据
   */
  const getMenuData = async () => {
    try {
      // 获取树形菜单数据
      const res = await fetchGetMenuList({ tree: true })
      // API 返回的是 { items: [], total: 0, ... } 结构
      menuTree.value = res.items || []
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 监听弹窗打开，初始化权限数据
   */
  watch(
    () => props.modelValue,
    async (newVal) => {
      if (newVal) {
        console.log('权限对话框打开')

        // 每次打开都重新加载菜单树,确保数据最新
        await getMenuData()
        console.log('菜单树加载完成,数据量:', menuTree.value.length)

        // 等待 DOM 更新后再设置选中状态
        if (props.roleData) {
          await nextTick()
          await getRoleMenus()
        }
      }
    }
  )

  /**
   * 获取角色已分配的菜单权限
   */
  const getRoleMenus = async () => {
    if (!props.roleData) return

    console.log('开始获取角色菜单权限, roleId:', props.roleData.id)
    console.log('当前菜单树数据:', menuTree.value)
    console.log('树组件引用:', treeRef.value)

    try {
      const res = await fetchRoleMenus(props.roleData.id)
      console.log('获取角色菜单权限响应:', res)

      // API 返回的是对象 { role_id, role_name, total, items: [] }
      let menuIds: number[] = []

      if (res && res.items && Array.isArray(res.items)) {
        // 从 items 数组中提取菜单 ID (字段名是 menu_id)
        menuIds = res.items.map((item: any) => item.menu_id).filter((id: any) => id !== undefined)
        console.log('提取的菜单ID数组:', menuIds)

        // 过滤出叶子节点(没有子节点的菜单)
        // 这样可以避免勾选父节点时自动勾选所有子节点
        const leafNodeIds = menuIds.filter((id: number) => {
          const node = findNodeById(menuTree.value, id)
          return node && (!node.children || node.children.length === 0)
        })
        console.log('过滤后的叶子节点ID:', leafNodeIds)
        menuIds = leafNodeIds
      } else if (Array.isArray(res)) {
        // 兼容直接返回数组的情况
        menuIds = res
      } else {
        console.warn('角色菜单权限响应格式不正确:', res)
        return
      }

      if (menuIds.length > 0) {
        // 等待一下确保树组件已渲染
        await nextTick()

        if (treeRef.value) {
          // 设置选中的菜单节点
          treeRef.value.setCheckedKeys(menuIds, false)
          console.log('已设置选中的菜单ID:', menuIds)
          console.log('当前选中的keys:', treeRef.value.getCheckedKeys())
        } else {
          console.error('树组件引用不存在')
        }
      } else {
        console.log('该角色没有分配任何菜单权限')
      }
    } catch (error) {
      console.error('获取角色菜单权限失败:', error)
      ElMessage.error('获取角色菜单权限失败')
    }
  }

  /**
   * 关闭弹窗并清空选中状态
   */
  const handleClose = () => {
    visible.value = false
    treeRef.value?.setCheckedKeys([])
    isSelectAll.value = false
  }

  /**
   * 保存权限配置
   */
  const savePermission = async () => {
    if (!props.roleData) return
    submitLoading.value = true
    try {
      const checkedKeys = treeRef.value?.getCheckedKeys(false) || []
      const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
      const allKeys = [...checkedKeys, ...halfCheckedKeys] as number[]

      await fetchUpdateRoleMenus(props.roleData.id, allKeys)
      ElMessage.success('权限保存成功')
      emit('success')
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      submitLoading.value = false
    }
  }

  /**
   * 切换全部展开/收起状态
   */
  const toggleExpandAll = () => {
    isExpandAll.value = !isExpandAll.value
    const nodes = treeRef.value!.store._getAllNodes()
    nodes.forEach((node) => {
      node.expanded = isExpandAll.value
    })
  }

  /**
   * 切换全选/取消全选状态
   */
  const toggleSelectAll = () => {
    if (isSelectAll.value) {
      treeRef.value?.setCheckedKeys([])
    } else {
      treeRef.value?.setCheckedNodes(menuTree.value as any[]) // This selects root nodes, creating deep selection
    }
    isSelectAll.value = !isSelectAll.value
  }

  const handleTreeCheck = () => {
    // Optional: Sync select all state
  }
</script>
