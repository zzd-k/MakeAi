declare namespace Api {
  namespace Share {
    interface StatusResponse {
      status: string | number
    }

    interface ContentResponse {
      id: number
      record_id: number
      title: string
      created_at: string
      // 可按实际扩展
    }
  }
}
