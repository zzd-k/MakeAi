import request from '@/utils/http'

/** 获取首页热门内容 */
export function fetchHomeHot() {
  return request.get<Api.Home.HotResponse>({ url: '/home/hot' })
}

/** 获取首页订阅流 */
export function fetchHomeFeed(query?: Api.Home.PageQuery) {
  return request.get<Api.Home.FeedResponse>({ url: '/home/feed', params: query })
}

/** 获取用户统计数据 */
export function fetchHomeStatistics() {
  return request.get<Api.Home.StatisticsResponse>({ url: '/home/statistics' })
}

/** 获取最近内容 */
export function fetchHomeRecent() {
  return request.get<Api.Home.RecentResponse>({ url: '/home/recent' })
}

/** 搜索 */
export function fetchHomeSearch(query: Api.Home.SearchQuery) {
  return request.get<Api.Home.SearchResponse>({ url: '/home/search', params: query })
}
