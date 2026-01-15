declare namespace Api {
  namespace Home {
    interface PageQuery {
      page?: number
      page_size?: number
    }

    // interface HotItem {  }

    type HotResponse = HotItem[]
    type FeedResponse = HotResponse
    type RecentResponse = HotResponse

    interface StatisticsResponse {
      total_records: number
      total_duration: number
    }

    interface SearchQuery extends PageQuery {
      keyword: string
    }

    type SearchResponse = HotResponse
  }
}
