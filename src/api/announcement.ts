import request from '@/utils/http'

/**
 * 创建公告
 * @param data 公告数据
 * @returns 创建的公告信息
 */
export function createAnnouncement(data: Api.Announcement.CreateAnnouncementParams) {
  return request.post<Api.Announcement.AnnouncementItem>({
    url: '/admin/announcements/',
    data,
    showSuccessMessage: true
  })
}

/**
 * 获取公告列表
 * @param query 查询参数
 * @returns 公告列表
 */
export function fetchAnnouncementList(query?: Api.Announcement.AnnouncementListQuery) {
  return request.get<Api.Announcement.AnnouncementListResponse>({
    url: '/admin/announcements/',
    params: query
  })
}

/**
 * 获取公告详情
 * @param id 公告ID
 * @returns 公告详情
 */
export function fetchAnnouncementDetail(id: number) {
  return request.get<Api.Announcement.AnnouncementDetailResponse>({
    url: `/admin/announcements/${id}`
  })
}

/**
 * 更新公告
 * @param id 公告ID
 * @param data 更新数据
 * @returns 更新后的公告信息
 */
export function updateAnnouncement(id: number, data: Api.Announcement.UpdateAnnouncementParams) {
  return request.put<Api.Announcement.AnnouncementItem>({
    url: `/admin/announcements/${id}`,
    data,
    showSuccessMessage: true
  })
}

/**
 * 删除公告
 * @param id 公告ID
 */
export function deleteAnnouncement(id: number) {
  return request.del<void>({
    url: `/admin/announcements/${id}`,
    showSuccessMessage: true
  })
}

/**
 * 发布公告
 * @param id 公告ID
 * @returns 发布后的公告信息
 */
export function publishAnnouncement(id: number) {
  return request.post<Api.Announcement.AnnouncementItem>({
    url: `/admin/announcements/${id}/publish`,
    showSuccessMessage: true
  })
}

/**
 * 取消发布公告
 * @param id 公告ID
 * @returns 取消发布后的公告信息
 */
export function unpublishAnnouncement(id: number) {
  return request.post<Api.Announcement.AnnouncementItem>({
    url: `/admin/announcements/${id}/unpublish`,
    showSuccessMessage: true
  })
}
