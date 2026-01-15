import request from '@/utils/http'

/** 开始分析录音 */
export function startAnalysis(recordId: number) {
  return request.post<Api.Analysis.TaskResponse>({
    url: `/analysis/${recordId}/analyze`,
    showSuccessMessage: true
  })
}

/** 获取分析结果 */
export function fetchAnalysisResult(recordId: number) {
  return request.get<Api.Analysis.ResultResponse>({
    url: `/analysis/${recordId}/result`
  })
}
