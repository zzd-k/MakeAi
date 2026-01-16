import request from '@/utils/http'

/** 获取分享状态 */
export function getShareStatus(recordId: number) {
  return request.get<Api.Share.StatusResponse>({ url: `/share/status/${recordId}` })
}

/** 生成分享码 */
export function generateShareCode(recordId: number) {
  return request.post<{ code: string }>({
    url: `/share/${recordId}/regenerate-code`,
    showSuccessMessage: true
  })
}

/** 通过分享码获取内容 */
export function getShareContent(code: string) {
  return request.get<Api.Share.ContentResponse>({ url: `/share/code/${code}` })
}

/** 获取分享链接 */
export function getShareLink(recordId: number) {
  return request.get<{ url: string }>({ url: `/share/link/${recordId}` })
}

/** 转发到团队 */
export function forwardToTeam(recordId: number, teamId: number) {
  return request.post<void>({
    url: `/share/${recordId}/forward`,
    data: { team_id: teamId },
    showSuccessMessage: true
  })
}

/** 获取分享记录列表 */
export function getShareRecords() {
  return request.get<any>({ url: '/share/records' })
}
