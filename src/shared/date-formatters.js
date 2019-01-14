import formatDistance from "date-fns/formatDistance";
import parse from "date-fns/parse";
import format from "date-fns/format";

export function formatServerDate(dateString) {
  return `${formatDistance(
    parse(dateString, "yyyy-MM-dd kk:mm:ss.SSSSSSxxx", new Date()),
    new Date()
  )} ago`;
}

export function monthDayYear(dateString) {
  return format(
    parse(dateString, "yyyy-MM-dd HH:mm:ss.SSSSSSxxx", new Date()),
    "MMM dd, uuuu"
  );
}
