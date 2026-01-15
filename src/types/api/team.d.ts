declare namespace Api {
  namespace Team {
    interface TeamInfo {
      id: number
      name: string
      invite_code: string
      created_at: string
    }

    interface CreateParams {
      name: string
    }

    type UpdateParams = Partial<CreateParams>

    interface MemberItem {
      user_id: number
      username: string
      role: string
      joined_at: string
    }

    interface MemberList {
      members: MemberItem[]
    }
  }
}
