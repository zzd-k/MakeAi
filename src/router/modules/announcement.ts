import { AppRouteRecord } from '@/types/router'

export const announcementRoutes: AppRouteRecord = {
  path: '/announcement',
  name: 'AnnouncementManage',
  component: '/announcement/index',
  meta: {
    title: 'menus.announcement.title',
    icon: 'ri:notification-3-line',
    roles: ['R_SUPER', 'R_ADMIN'],
    keepAlive: true
  }
}
