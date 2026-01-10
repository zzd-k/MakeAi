import { AppRouteRecord } from '@/types/router'

export const sessionTypeRoutes: AppRouteRecord = {
  path: '/session-type',
  name: 'SessionTypeManage',
  component: '/session-type/index',
  meta: {
    title: 'menus.sessionType.title',
    icon: 'ri:chat-settings-line',
    roles: ['R_SUPER', 'R_ADMIN'],
    keepAlive: true
  }
}
