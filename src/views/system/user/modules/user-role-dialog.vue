<template>
  <ElDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="分配角色"
    width="600px"
    @closed="handleClosed"
  >
    <div v-if="userData" class="mb-4">
      <ElTag type="info">用户: {{ userData.username }}</ElTag>
    </div>

    <ElScrollbar max-height="400px">
      <ElRadioGroup v-model="selectedRole">
        <div v-for="role in roleList" :key="role.id" class="role-item">
          <ElRadio :label="role.id">
            <div class="flex items-center justify-between w-full">
              <span>{{ role.role_name }}</span>
              <ElTag v-if="role.role_status" type="success" size="small">启用</ElTag>
              <ElTag v-else type="info" size="small">禁用</ElTag>
            </div>
          </ElRadio>
        </div>
      </ElRadioGroup>
    </ElScrollbar>

    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit" :loading="loading">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { fetchGetRoleList } from '@/api/system/role'
  import { fetchUserRoles, fetchAssignUserRole, fetchRemoveUserRole } from '@/api/system/role'
  import { ElMessage } from 'element-plus'

  type UserListItem = Api.Admin.User
  type RoleListItem = Api.SystemManage.RoleListItem

  interface Props {
    modelValue: boolean
    userData?: UserListItem | null
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    userData: null
  })

  const emit = defineEmits<Emits>()

  const loading = ref(false)
  const roleList = ref<RoleListItem[]>([])
  const selectedRole = ref<number | undefined>(undefined)
  const originalRole = ref<number | undefined>(undefined)

  /**
   * 获取所有角色列表
   */
  const getRoleList = async () => {
    try {
      const res = await fetchGetRoleList({ page: 1, page_size: 100 })
      roleList.value = res.items || []
    } catch (error) {
      console.error('获取角色列表失败:', error)
      ElMessage.error('获取角色列表失败')
    }
  }

  /**
   * 获取用户当前角色
   */
  const getUserRoles = async () => {
    if (!props.userData) return

    try {
      const res = await fetchUserRoles(props.userData.id)
      console.log('用户当前角色:', res)

      // API 返回的是单个角色对象 { role_id, role_name, ... }
      if (res && res.role_id) {
        selectedRole.value = res.role_id
        originalRole.value = res.role_id
      } else {
        selectedRole.value = undefined
        originalRole.value = undefined
      }
    } catch (error) {
      console.error('获取用户角色失败:', error)
      // 如果用户没有角色，可能会返回 404，这是正常的
      selectedRole.value = undefined
      originalRole.value = undefined
    }
  }

  /**
   * 提交角色分配
   */
  const handleSubmit = async () => {
    if (!props.userData) return

    loading.value = true
    try {
      // 如果选中了角色
      if (selectedRole.value !== undefined) {
        // 分配或更新角色（API 会自动处理更新）
        await fetchAssignUserRole(props.userData.id, selectedRole.value)
        ElMessage.success('角色分配成功')
      } else if (originalRole.value !== undefined) {
        // 如果原来有角色，现在取消选择，则移除角色
        await fetchRemoveUserRole(props.userData.id)
        ElMessage.success('角色移除成功')
      }

      emit('success')
      emit('update:modelValue', false)
    } catch (error) {
      console.error('角色分配失败:', error)
      ElMessage.error('角色分配失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消操作
   */
  const handleCancel = () => {
    emit('update:modelValue', false)
  }

  /**
   * 对话框关闭后重置
   */
  const handleClosed = () => {
    selectedRole.value = undefined
    originalRole.value = undefined
  }

  /**
   * 监听对话框打开
   */
  watch(
    () => props.modelValue,
    async (newVal) => {
      if (newVal) {
        console.log('角色对话框打开')
        // 加载角色列表
        if (roleList.value.length === 0) {
          await getRoleList()
        }
        // 加载用户当前角色
        if (props.userData) {
          await getUserRoles()
        }
      }
    }
  )
</script>

<style scoped lang="scss">
  .role-item {
    padding: 8px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }

    :deep(.el-checkbox) {
      width: 100%;

      .el-checkbox__label {
        width: 100%;
      }
    }
  }
</style>
