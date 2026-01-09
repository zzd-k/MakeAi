import { AppRouteRecord } from '@/types/router'

export const memberRoutes: AppRouteRecord = {
  path: '/member',
  name: 'Member',
  component: '/index/index',
  meta: {
    title: 'menus.member.title',
    icon: 'ri:user-star-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'index',
      name: 'MemberCenter',
      component: '/member/index',
      meta: {
        title: 'menus.member.center',
        keepAlive: true
      }
    }
  ]
}
