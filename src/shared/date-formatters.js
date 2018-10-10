import formatDistance from 'date-fns/formatDistance'
import parse from 'date-fns/parse'

export function formatServerDate(dateString) {
  return `${formatDistance(parse(dateString, 'yyyy-MM-dd kk:mm:ss.SSSSSSxxx', new Date()), new Date())} ago`
}
