declare namespace Api {
  namespace Records {
    /** 分页查询 */
    interface PageQuery {
      page?: number
      page_size?: number
    }

    /** 录音记录项 */
    interface Item {
      id: number
      title: string
      created_at: string
      duration: number
      cover?: string | null
      // 其它字段可按需补充
    }

    /** 列表响应 */
    interface ListResponse {
      total: number
      items: Item[]
    }

    /** 上传/转码任务响应 */
    interface UploadResponse {
      id: number // 新建的 record_id
      task_id?: string
      status?: string
    }

    /** 创建会议参数 */
    interface CreateMeetingParams {
      title: string
      description?: string
    }
  }
}
