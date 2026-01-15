declare namespace Api {
  namespace User {
    /** 基本信息 */
    interface Me {
      id: number
      username: string
      email: string | null
      nickname: string | null
      avatar: string | null
      created_at: string
    }

    /** 更新信息 */
    type UpdateMeParams = Partial<Pick<Me, 'username' | 'email' | 'nickname'>>

    /** 修改密码 */
    interface UpdatePasswordParams {
      old_password: string
      new_password: string
    }
  }
}
