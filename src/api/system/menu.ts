import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取菜单列表 (树形)
export function fetchGetMenuList(params?: any) {
  return request.get<any>({
    url: '/admin/menus/',
    params
  })
}

// 获取菜单树 (仅启用)
export function fetchGetMenuTree() {
  return request.get<any>({
    url: '/admin/menus/tree'
  })
}

// 获取菜单详情
export function fetchGetMenuDetail(id: number) {
  return request.get<any>({
    url: `/admin/menus/${id}`
  })
}

// 创建菜单
export function fetchCreateMenu(data: any) {
  const { parentId, keepAlive, ...rest } = data
  return request.post<void>({
    url: '/admin/menus/',
    data: {
      ...rest,
      parent_id: parentId,
      keep_alive: keepAlive
    },
    showSuccessMessage: true
  })
}

// 更新菜单
export function fetchUpdateMenu(data: any) {
  const { id, parentId, keepAlive, ...rest } = data
  return request.put<void>({
    url: `/admin/menus/${id}`,
    data: {
      ...rest,
      parent_id: parentId,
      keep_alive: keepAlive
    },
    showSuccessMessage: true
  })
}

// 删除菜单
export function fetchDeleteMenu(id: number) {
  return request.del<void>({
    url: `/admin/menus/${id}`,
    showSuccessMessage: true
  })
}
