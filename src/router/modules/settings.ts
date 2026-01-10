import { AppRouteRecord } from '@/types/router'

export const settingsRoutes: AppRouteRecord = {
  path: '/settings',
  name: 'Settings',
  component: '/index/index',
  meta: {
    title: 'menus.settings.title',
    icon: 'ri:settings-3-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'basic',
      name: 'BasicSetting',
      component: '/settings/basic/index',
      meta: {
        title: 'menus.settings.basic',
        keepAlive: true
      }
    },
    {
      path: 'app-menu',
      name: 'AppMenuSetting',
      component: '/settings/app-menu/index',
      meta: {
        title: 'menus.settings.appMenu',
        keepAlive: true
      }
    },
    {
      path: 'user-agreement',
      name: 'UserAgreementSetting',
      component: '/settings/user-agreement/index',
      meta: {
        title: 'menus.settings.userAgreement',
        keepAlive: true
      }
    }
  ]
}
