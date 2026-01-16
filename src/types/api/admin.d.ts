declare namespace Api {
  namespace Admin {
    /** 管理员登录参数 */
    interface LoginParams {
      username: string
      password: string
    }

    /** 管理员登录响应 */
    interface LoginResponse {
      access_token: string
      token_type: 'bearer'
      user: User
    }

    /** 用户基本信息 */
    interface User {
      id: number
      username: string
      email: string | null
      nickname: string | null
      avatar: string | null
      is_superuser: boolean
      is_staff: boolean
      is_active: boolean
      created_at: string
    }

    /** 当前管理员信息 */
    type MeResponse = User

    /** 通用分页查询 */
    interface PageQuery {
      page?: number
      page_size?: number
    }

    /** 用户列表响应 */
    interface UserListResponse {
      total: number
      items: User[]
    }

    /** 更新用户状态参数 */
    interface UpdateUserStatusParams {
      is_active?: boolean
      is_staff?: boolean
    }

    /** 会议记录 */
    interface RecordItem {
      id: number
      meeting_name: string
      kind: string
      owner_id: number
      created_at: string
      is_shared: boolean
      description: string | null
      view_count: number
      duration?: number
      // 其它字段按需补充
    }

    interface RecordListResponse {
      total: number
      items: RecordItem[]
    }

    /** 概览统计 */
    interface OverviewResponse {
      users: {
        total: number
        active: number
        superusers: number
        today_new: number
      }
      records: {
        total: number
        shared: number
        today_new: number
      }
      interactions: {
        likes: number
        comments: number
        forwards: number
      }
    }

    /** 趋势折线数据 */
    interface TrendPoint {
      date: string
      count: number
    }

    type UsersTrendResponse = TrendPoint[]
    type RecordsTrendResponse = TrendPoint[]
  }
}
