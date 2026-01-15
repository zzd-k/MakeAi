import request from '@/utils/http'

/** 获取分享状态 */
export function getShareStatus(recordId: number) {
  return request.get<Api.Share.StatusResponse>({ url: `/share/status/${recordId}` })
}

/** 生成分享码 */
export function generateShareCode(recordId: number) {
  return request.post<{ code: string }>({
    url: `/share/code/${recordId}`,
    showSuccessMessage: true
  })
}

/** 通过分享码获取内容 */
export function getShareContent(code: string) {
  return request.get<Api.Share.ContentResponse>({ url: `/share/${code}` })
}

/** 生成H5分享页链接 */
export function createH5Share(recordId: number) {
  return request.post<{ url: string }>({
    url: `/share/h5/${recordId}`,
    showSuccessMessage: true
  })
}

/** 获取分享链接 */
export function getShareLink(recordId: number) {
  return request.get<{ url: string }>({ url: `/share/link/${recordId}` })
}

/** 转发到团队 */
export function forwardToTeam(recordId: number, teamId: number) {
  return request.post<void>({
    url: `/share/forward/${recordId}`,
    data: { team_id: teamId },
    showSuccessMessage: true
  })
}
