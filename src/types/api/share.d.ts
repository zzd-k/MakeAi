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
      description?: string
      analysis?: {
        transcript?: string
        summary?: string
        audio_url?: string
        status?: string
      } | null
      // 可按实际扩展
    }
  }
}
