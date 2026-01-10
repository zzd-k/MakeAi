import { AppRouteRecord } from '@/types/router'

export const memberRoutes: AppRouteRecord = {
  path: '/member',
  name: 'MemberCenter',
  component: '/member/index',
  meta: {
    title: 'menus.member.title',
    icon: 'ri:user-star-line',
    roles: ['R_SUPER', 'R_ADMIN'],
    keepAlive: true
  }
}
