/// <reference types="vite/client" />

declare namespace Api {
  namespace SystemManage {
    // ----------------------------------------------------------------------
    // Role Types
    // ----------------------------------------------------------------------

    /** 角色列表项 */
    interface RoleListItem {
      id: number
      role_name: string
      role_code: string
      role_description: string
      role_status: boolean // boolean in actual response
      created_at: string
      updated_at: string
    }

    /** 角色搜索参数 */
    interface RoleSearchParams {
      page?: number
      size?: number
      keyword?: string
      role_name?: string
      role_code?: string
      role_status?: number
      startTime?: string
      endTime?: string
    }

    /** 角色列表响应 */
    interface RoleList {
      list: RoleListItem[]
      total: number
    }

    /** 创建/更新角色主要参数 */
    interface RoleParams {
      role_name: string
      role_code: string
      role_description?: string
      role_status: number
    }

    /** 角色-菜单权限分配参数 */
    interface RoleMenuParams {
      role_id: number
      menu_ids: number[]
    }

    // ----------------------------------------------------------------------
    // Menu Types
    // ----------------------------------------------------------------------

    /** 菜单类型枚举 */
    type MenuType = 'directory' | 'menu' | 'button'

    /** 菜单列表项 */
    interface MenuListItem {
      id: number
      menu_name: string
      menu_type: MenuType
      route?: string | null
      permission_code?: string | null
      parent_id?: number | null
      parent_name?: string | null
      sort_order: number
      icon?: string | null
      status: boolean
      created_at: string
      updated_at: string
      children?: MenuListItem[] | null
    }

    /** 菜单列表响应 */
    interface MenuListResponse {
      total: number
      page: number
      page_size: number
      total_pages: number
      items: MenuListItem[]
    }

    /** 菜单搜索参数 */
    interface MenuSearchParams {
      page?: number
      page_size?: number
      search?: string
      menu_type?: string
      status?: boolean
      tree?: boolean
    }

    /** 用于选择的简单菜单树 */
    interface MenuOption {
      id: number
      label: string
      children?: MenuOption[]
    }
  }
}
