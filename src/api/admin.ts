import request from '@/utils/http'

/** 管理员登录 */
export function fetchAdminLogin(params: Api.Admin.LoginParams) {
  return request.post<Api.Admin.LoginResponse>({
    url: '/admin/login',
    data: params,
    showSuccessMessage: true
  })
}

/** 获取当前管理员信息 */
export function fetchAdminMe() {
  return request.get<Api.Admin.MeResponse>({
    url: '/admin/me'
  })
}

/** 获取用户列表 */
export function fetchAdminUsers(query: Api.Admin.PageQuery) {
  return request.get<Api.Admin.UserListResponse>({
    url: '/admin/users/',
    params: query
  })
}

/** 获取用户详情 */
export function fetchAdminUserDetail(userId: number) {
  return request.get<Api.Admin.User>({
    url: `/admin/users/${userId}`
  })
}

/** 更新用户状态 */
export function updateAdminUserStatus(userId: number, data: Api.Admin.UpdateUserStatusParams) {
  return request.put<void>({
    url: `/admin/users/${userId}/status`,
    data,
    showSuccessMessage: true
  })
}

/** 获取会议记录列表 */
export function fetchAdminRecords(query: Api.Admin.PageQuery) {
  return request.get<Api.Admin.RecordListResponse>({
    url: '/admin/records/',
    params: query
  })
}

/** 获取会议记录详情 */
export function fetchAdminRecordDetail(recordId: number) {
  return request.get<Api.Admin.RecordItem>({
    url: `/admin/records/${recordId}`
  })
}

/** 更新会议记录 */
export function updateAdminRecord(recordId: number, data: any) {
  return request.put<void>({
    url: `/admin/records/${recordId}`,
    data,
    showSuccessMessage: true
  })
}

/** 删除会议记录 */
export function deleteAdminRecord(recordId: number) {
  return request.del<void>({
    url: `/admin/records/${recordId}`,
    showSuccessMessage: true
  })
}

/** 数据概览 */
export function fetchStatisticsOverview() {
  return request.get<Api.Admin.OverviewResponse>({
    url: '/admin/statistics/overview'
  })
}

/** 用户增长趋势 */
export function fetchStatisticsUsersTrend(query: Api.Admin.PageQuery) {
  return request.get<Api.Admin.UsersTrendResponse>({
    url: '/admin/statistics/users/trend',
    params: query
  })
}

/** 会议记录增长趋势 */
export function fetchStatisticsRecordsTrend(query: Api.Admin.PageQuery) {
  return request.get<Api.Admin.RecordsTrendResponse>({
    url: '/admin/statistics/records/trend',
    params: query
  })
}
