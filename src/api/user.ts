import request from '@/utils/http'

/** 获取当前用户信息 */
export function fetchUserMe() {
  return request.get<Api.User.Me>({ url: '/user/me' })
}

/** 修改当前用户信息 */
export function updateUserMe(data: Api.User.UpdateMeParams) {
  return request.put<Api.User.Me>({ url: '/user/me', data, showSuccessMessage: true })
}

/** 删除账户 */
export function deleteUserMe() {
  return request.del<void>({ url: '/user/me', showSuccessMessage: true })
}

/** 上传头像 */
export function uploadUserAvatar(form: FormData) {
  return request.post<string>({
    url: '/user/avatar',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
    showSuccessMessage: true
  })
}

/** 修改密码 */
export function updateUserPassword(data: Api.User.UpdatePasswordParams) {
  return request.put<void>({ url: '/user/password', data, showSuccessMessage: true })
}
