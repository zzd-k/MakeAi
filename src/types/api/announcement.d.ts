declare namespace Api {
  namespace Announcement {
    /** 公告类型（文字描述） */
    type AnnouncementType = string

    /** 公告状态 */
    type AnnouncementStatus = 'draft' | 'published'

    /** 公告项 */
    interface AnnouncementItem {
      id: number
      title: string
      content: string
      author_id: number
      author_name: string
      is_published: boolean
      published_at?: string | null
      view_count: number
      priority: number
      created_at: string
      updated_at: string
    }

    /** 公告列表响应 */
    interface AnnouncementListResponse {
      total: number
      page: number
      page_size: number
      total_pages: number
      items: AnnouncementItem[]
    }

    /** 公告列表查询参数 */
    interface AnnouncementListQuery {
      page?: number
      page_size?: number
      title?: string
      is_published?: boolean
    }

    /** 创建公告参数 */
    interface CreateAnnouncementParams {
      title: string
      content: string
      priority?: number
    }

    /** 更新公告参数 */
    interface UpdateAnnouncementParams {
      title?: string
      content?: string
      priority?: number
    }

    /** 公告详情响应 */
    type AnnouncementDetailResponse = AnnouncementItem
  }
}
