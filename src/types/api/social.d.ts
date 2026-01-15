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
      content: string
      created_at: string
    }

    interface CommentList {
      total: number
      items: CommentItem[]
    }
  }
}
