declare namespace Api {
  namespace Social {
    /** 分页 */
    interface PageQuery {
      page?: number
      page_size?: number
    }

    /** 评论参数 */
    interface CommentParams {
      content: string
    }

    interface CommentItem {
      id: number
      record_id: number
      user_id: number
      parent_id?: number | null
      content: string
      like_count?: number
      created_at: string
      updated_at?: string
      user?: {
        id: number
        username: string
        nickname?: string
        avatar?: string
        email?: string
        [key: string]: any
      }
      replies?: CommentItem[]
    }

    interface CommentList {
      total: number
      page?: number
      page_size?: number
      items?: CommentItem[]
      comments?: CommentItem[] // 后端实际返回的字段名
    }
  }
}
