export function timeAgo(timestamp: number | string | Date): string {
  const time = new Date(timestamp).getTime()
  if (isNaN(time)) return "Invalid date"

  const diff = Date.now() - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`
  if (diff < 86400000) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  return `${days} day${days !== 1 ? "s" : ""} ago`
}
