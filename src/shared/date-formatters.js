import formatDistance from 'date-fns/formatDistance'
import parse from 'date-fns/parse'

export function formatServerDate(dateString) {
  return `${formatDistance(parse(dateString.slice(0, 19), 'yyyy-MM-dd kk:ss:SS', new Date()), new Date())} ago`
}
