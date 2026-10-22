export function timeAgo(iso: string): string {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }
  if (seconds < 86400 * 7) {
    const days = Math.floor(seconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

export function excerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length > max ? `${flat.slice(0, max).replace(/\s+\S*$/, "")}…` : flat
}

const PENCILS = ["#c8483f", "#2f6fb3", "#3d8a58", "#8767b8", "#d1832a", "#5a6b78"]
export const pencilColor = (userId: number) => PENCILS[userId % PENCILS.length]
