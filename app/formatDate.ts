export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'только что'
  }

  if (minutes < 60) {
    if (minutes === 1) return '1 минуту назад'
    if (minutes < 5) return `${minutes} минуты назад`
    return `${minutes} минут назад`
  }

  if (hours < 24) {
    if (hours === 1) return '1 час назад'
    if (hours < 5) return `${hours} часа назад`
    return `${hours} часов назад`
  }

  if (days < 7) {
    if (days === 1) return 'вчера'
    if (days < 5) return `${days} дня назад`
    return `${days} дней назад`
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}