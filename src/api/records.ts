import request from '@/utils/http'

/** 上传录音文件（新开会议） */
export function uploadRecordFile(form: FormData) {
  return request.post<Api.Records.UploadResponse>({
    url: '/records/upload',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
    showSuccessMessage: true
  })
}

/** 获取录音记录列表 */
export function fetchRecordList(query: Api.Records.PageQuery) {
  return request.get<Api.Records.ListResponse>({
    url: '/records/',
    params: query
  })
}

/** 获取录音记录详情 */
export function fetchRecordDetail(id: number) {
  return request.get<Api.Records.Item>({ url: `/records/${id}` })
}

/** 更新录音记录 */
export function updateRecord(id: number, data: Partial<Api.Records.Item>) {
  return request.put<void>({ url: `/records/${id}`, data, showSuccessMessage: true })
}

/** 删除会议/录音记录 */
export function deleteRecord(id: number) {
  return request.del<void>({ url: `/records/${id}`, showSuccessMessage: true })
}

/** 创建会议 */
export function createMeeting(data: Api.Records.CreateMeetingParams) {
  return request.post<Api.Records.Item>({
    url: '/records/create-meeting',
    data,
    showSuccessMessage: true
  })
}

/** 上传录音文件到指定记录 */
export function uploadRecordAudio(id: number, form: FormData) {
  return request.post<Api.Records.UploadResponse>({
    url: `/records/${id}/upload-recording`,
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
    showSuccessMessage: true
  })
}

/** 上传封面图 */
export function uploadRecordCover(id: number, form: FormData) {
  return request.post<string>({
    url: `/records/${id}/cover`,
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
    showSuccessMessage: true
  })
}
