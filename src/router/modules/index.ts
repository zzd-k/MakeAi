import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { memberRoutes } from './member'
import { announcementRoutes } from './announcement'
import { sessionTypeRoutes } from './session-type'
import { conversationRoutes } from './conversation'
import { settingsRoutes } from './settings'
import { systemRoutes } from './system'
import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  memberRoutes,
  announcementRoutes,
  sessionTypeRoutes,
  conversationRoutes,
  settingsRoutes,
  systemRoutes,
  resultRoutes,
  exceptionRoutes
]
