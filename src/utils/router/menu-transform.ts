/**
 * 菜单数据转换工具
 * 将后端返回的菜单数据转换为前端路由配置
 */

import { AppRouteRecord } from '@/types/router'
const Layout = () => import('@views/index/index.vue')

/**
 * 菜单项接口(来自 API)
 */
interface MenuItem {
  id: number
  menu_name: string
  menu_type: 'directory' | 'menu' | 'button'
  route?: string | null
  permission_code?: string | null
  parent_id?: number | null
  sort_order: number
  icon?: string | null
  status: boolean
  children?: MenuItem[] | null
}

/**
 * 组件映射表
 * 根据路由路径映射到对应的组件
 */
const componentMap: Record<string, () => Promise<any>> = {
  // 系统管理
  '/system/user': () => import('@views/system/user/index.vue'),
  '/system/role': () => import('@views/system/role/index.vue'),
  '/system/menu': () => import('@views/system/menu/index.vue'),

  // 仪表盘
  '/dashboard': () => import('@views/dashboard/console/index.vue'),
  '/dashboard/console': () => import('@views/dashboard/console/index.vue'),

  // 会员中心
  '/member': () => import('@views/member/index.vue'),

  // 公告管理
  '/announcement': () => import('@views/announcement/index.vue'),

  // 对话管理
  '/conversation/record': () => import('@views/conversation/record/index.vue'),
  '/conversation/like': () => import('@views/conversation/like/index.vue'),
  '/conversation/comment': () => import('@views/conversation/comment/index.vue'),

  // 会话类型
  '/session-type': () => import('@views/session-type/index.vue'),

  // 系统设置
  '/settings/basic': () => import('@views/settings/basic/index.vue'),
  '/settings/app-menu': () => import('@views/settings/app-menu/index.vue'),
  '/settings/app-order': () => import('@views/settings/app-order/index.vue'),
  '/settings/user-agreement': () => import('@views/settings/user-agreement/index.vue')
}

/**
 * 将菜单对象转换为路由记录
 * @param menu 菜单项
 * @param parentPath 父级路径
 */
function transformMenuToRoute(menu: MenuItem, parentPath?: string): AppRouteRecord | null {
  // 过滤掉禁用的菜单
  if (!menu.status) {
    return null
  }

  // 处理路径
  let path = menu.route || `/${menu.id}`
  const fullPath = path // 保存完整路径用于组件查找

  // 如果是子路由，需要处理 path
  if (parentPath) {
    if (path.startsWith(parentPath + '/')) {
      // 如果包含父路径前缀，则截取掉
      path = path.slice(parentPath.length + 1)
    } else {
      // 否则取最后一段
      const segments = path.split('/').filter(Boolean)
      path = segments[segments.length - 1] || path
    }
  }

  const route: AppRouteRecord = {
    path: path,
    name: menu.route?.replace(/\//g, '-').replace(/^-/, '') || `Menu${menu.id}`,
    meta: {
      title: menu.menu_name,
      icon: menu.icon || undefined,
      order: menu.sort_order,
      permission: menu.permission_code || undefined
    }
  }

  // 目录类型
  if (menu.menu_type === 'directory') {
    route.component = Layout
    if (menu.children && menu.children.length > 0) {
      route.redirect = menu.children[0].route || undefined
      // 递归处理子菜单，传入完整路径作为父路径
      route.children = menu.children
        .map((child) => transformMenuToRoute(child, fullPath))
        .filter((r): r is AppRouteRecord => r !== null)
        .sort((a, b) => ((a.meta?.order as number) || 0) - ((b.meta?.order as number) || 0))
    }
  }
  // 菜单类型
  else if (menu.menu_type === 'menu') {
    // 查找组件
    if (fullPath && componentMap[fullPath]) {
      route.component = componentMap[fullPath]
    } else {
      // 默认组件或 404
      route.component = () => import('@views/exception/404/index.vue')
      console.warn(`[MenuTransform] Component not found for route: ${fullPath}`)
    }
  }
  // 按钮类型不生成路由
  else if (menu.menu_type === 'button') {
    return null
  }

  return route
}

/**
 * 转换菜单列表为路由配置
 * @param menus 菜单列表
 * @returns 路由配置数组
 */
export function transformMenusToRoutes(menus: MenuItem[]): AppRouteRecord[] {
  if (!menus || !Array.isArray(menus)) {
    return []
  }

  return menus
    .map((menu) => transformMenuToRoute(menu)) // 顶层调用不需要 parentPath
    .filter((route): route is AppRouteRecord => route !== null)
    .sort((a, b) => ((a.meta?.order as number) || 0) - ((b.meta?.order as number) || 0))
}

/**
 * 从菜单列表中提取所有权限代码
 * @param menus 菜单列表
 * @returns 权限代码数组
 */
export function extractPermissions(menus: MenuItem[]): string[] {
  const permissions: string[] = []

  function extract(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.permission_code) {
        permissions.push(item.permission_code)
      }
      if (item.children && item.children.length > 0) {
        extract(item.children)
      }
    })
  }

  extract(menus)
  return permissions
}
