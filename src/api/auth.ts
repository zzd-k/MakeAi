import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export async function fetchLogin(params: Api.Auth.LoginParams) {
  const res = await request.post<Api.Admin.LoginResponse>({
    url: '/admin/login',
    data: {
      username: params.userName,
      password: params.password
    },
    showSuccessMessage: true
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })

  return {
    token: res.access_token,
    refreshToken: ''
  } satisfies Api.Auth.LoginResponse
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export async function fetchGetUserInfo() {
  const res = await request.get<Api.Admin.MeResponse>({
    url: '/admin/me'
  })

  // 映射为前端需要的结构
  return {
    userId: res.id,
    userName: res.username,
    email: res.email || '',
    avatar: res.avatar || '',
    roles: res.is_superuser ? ['R_SUPER'] : res.is_staff ? ['R_ADMIN'] : ['R_USER'],
    buttons: []
  } satisfies Api.Auth.UserInfo
}
