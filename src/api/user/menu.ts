import request from '@/utils/http'

/**
 * 获取当前登录用户的角色和菜单权限
 * 用于登录后获取用户可访问的菜单（树形结构）
 */
export function fetchUserMenu() {
  return request.get<any>({
    url: '/user/menu'
  })
}
