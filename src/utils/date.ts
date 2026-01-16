/**
 * 日期时间工具函数
 *
 * @module utils/date
 */

/**
 * 格式化 UTC 时间为本地时间字符串
 * @param dateString - ISO 8601 格式的日期字符串 (如 "2026-01-16T08:15:22")
 * @param format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的本地时间字符串
 */
export function formatDateTime(
  dateString: string | undefined | null,
  format = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!dateString) return ''

  try {
    // 解析 UTC 时间
    const date = new Date(dateString)

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString
    }

    // 获取本地时间各部分
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // 根据格式返回
    if (format === 'YYYY-MM-DD HH:mm:ss') {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    } else if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`
    } else if (format === 'HH:mm:ss') {
      return `${hours}:${minutes}:${seconds}`
    }

    // 默认返回完整格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('日期格式化失败:', error)
    return dateString
  }
}
