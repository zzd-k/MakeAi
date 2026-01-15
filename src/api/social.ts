import request from '@/utils/http'

/** 点赞 */
export function likeRecord(recordId: number) {
  return request.post<void>({ url: `/social/like/${recordId}`, showSuccessMessage: true })
}

/** 取消点赞 */
export function unlikeRecord(recordId: number) {
  return request.del<void>({ url: `/social/like/${recordId}`, showSuccessMessage: true })
}

/** 查询点赞状态 */
export function fetchLikeStatus(recordId: number) {
  return request.get<{ liked: boolean }>({ url: `/social/like/${recordId}/status` })
}

/** 发表评论 */
export function addComment(recordId: number, data: Api.Social.CommentParams) {
  return request.post<Api.Social.CommentItem>({
    url: `/social/comment/${recordId}`,
    data,
    showSuccessMessage: true
  })
}

/** 获取评论列表 */
export function fetchComments(recordId: number, query?: Api.Social.PageQuery) {
  return request.get<Api.Social.CommentList>({ url: `/social/comment/${recordId}`, params: query })
}

/** 修改评论 */
export function updateComment(commentId: number, data: Api.Social.CommentParams) {
  return request.put<void>({ url: `/social/comment/${commentId}`, data, showSuccessMessage: true })
}

/** 删除评论 */
export function deleteComment(commentId: number) {
  return request.del<void>({ url: `/social/comment/${commentId}`, showSuccessMessage: true })
}

/** 关注用户 */
export function followUser(userId: number) {
  return request.post<void>({ url: `/social/follow/${userId}`, showSuccessMessage: true })
}

/** 取消关注 */
export function unfollowUser(userId: number) {
  return request.del<void>({ url: `/social/follow/${userId}`, showSuccessMessage: true })
}
