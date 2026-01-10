import { AppRouteRecord } from '@/types/router'

export const conversationRoutes: AppRouteRecord = {
  path: '/conversation',
  name: 'Conversation',
  component: '/index/index',
  meta: {
    title: 'menus.conversation.title',
    icon: 'ri:message-3-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'record',
      name: 'ConversationRecord',
      component: '/conversation/record/index',
      meta: {
        title: 'menus.conversation.record',
        keepAlive: true
      }
    },
    {
      path: 'like',
      name: 'LikeRecord',
      component: '/conversation/like/index',
      meta: {
        title: 'menus.conversation.like',
        keepAlive: true
      }
    },
    {
      path: 'comment',
      name: 'CommentRecord',
      component: '/conversation/comment/index',
      meta: {
        title: 'menus.conversation.comment',
        keepAlive: true
      }
    }
  ]
}
