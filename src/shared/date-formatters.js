import format from "date-fns/format";

export function monthDayYear(dateString) {
  return format(new Date(dateString), "MMM dd, uuuu");
}
