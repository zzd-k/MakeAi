import request from '@/utils/http'

/** 创建团队 */
export function createTeam(data: Api.Team.CreateParams) {
  return request.post<Api.Team.TeamInfo>({ url: '/teams/', data, showSuccessMessage: true })
}

/** 获取我的团队信息 */
export function fetchMyTeam() {
  return request.get<Api.Team.TeamInfo>({ url: '/teams/me' })
}

/** 更新团队 */
export function updateMyTeam(data: Api.Team.UpdateParams) {
  return request.put<void>({ url: '/teams/me', data, showSuccessMessage: true })
}

/** 加入团队 */
export function joinTeam(code: string) {
  return request.post<void>({ url: '/teams/join', data: { code }, showSuccessMessage: true })
}

/** 退出团队 */
export function leaveTeam() {
  return request.post<void>({ url: '/teams/leave', showSuccessMessage: true })
}

/** 成员列表 */
export function fetchTeamMembers() {
  return request.get<Api.Team.MemberList>({ url: '/teams/members' })
}

/** 更新成员角色 */
export function updateMemberRole(userId: number, role: string) {
  return request.put<void>({
    url: `/teams/members/${userId}/role`,
    data: { role },
    showSuccessMessage: true
  })
}

/** 移除成员 */
export function removeMember(userId: number) {
  return request.del<void>({ url: `/teams/members/${userId}`, showSuccessMessage: true })
}

/** 生成新的邀请码 */
export function regenerateInviteCode() {
  return request.post<{ code: string }>({
    url: '/teams/regenerate-invite-code',
    showSuccessMessage: true
  })
}
