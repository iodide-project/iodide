import format from "date-fns/format";

export function monthDayYear(dateString) {
  return format(new Date(dateString), "MMM dd, uuuu");
}

export function timeMonthDayYear(dateString) {
  return format(new Date(dateString), "MMM dd, uuuu HH:mm:ss");
}
