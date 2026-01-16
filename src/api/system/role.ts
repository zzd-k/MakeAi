import request from '@/utils/http'

// 获取角色列表
export function fetchGetRoleList(params: any) {
  return request.get<any>({
    url: '/admin/roles/',
    params
  })
}

// 获取角色详情
export function fetchGetRoleDetail(id: number) {
  return request.get<any>({
    url: `/admin/roles/${id}`
  })
}

// 创建角色
export function fetchCreateRole(data: any) {
  return request.post<void>({
    url: '/admin/roles/',
    data,
    showSuccessMessage: true
  })
}

// 更新角色
export function fetchUpdateRole(data: any) {
  const { id, ...rest } = data
  return request.put<void>({
    url: `/admin/roles/${id}`,
    data: rest,
    showSuccessMessage: true
  })
}

// 删除角色
export function fetchDeleteRole(id: number) {
  return request.del<void>({
    url: `/admin/roles/${id}`,
    showSuccessMessage: true
  })
}

// 获取用户的角色
export function fetchUserRoles(userId: number) {
  return request.get<any>({
    url: `/admin/roles/users/${userId}/role`
  })
}

// 分配角色给用户
export function fetchAssignUserRole(userId: number, roleId: number) {
  return request.post<void>({
    url: `/admin/roles/assign`,
    data: { user_id: userId, role_id: roleId },
    showSuccessMessage: true
  })
}

// 移除用户角色
export function fetchRemoveUserRole(userId: number) {
  return request.del<void>({
    url: `/admin/roles/users/${userId}/role`,
    showSuccessMessage: true
  })
}

// 获取角色的菜单权限
export function fetchRoleMenus(roleId: number) {
  return request.get<any>({
    url: `/admin/menus/roles/${roleId}/menus`
  })
}

// 分配菜单权限给角色
export function fetchUpdateRoleMenus(roleId: number, menuIds: number[]) {
  return request.post<void>({
    url: `/admin/menus/roles/assign`,
    data: { role_id: roleId, menu_ids: menuIds },
    showSuccessMessage: true
  })
}
