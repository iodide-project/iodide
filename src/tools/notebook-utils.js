import { store } from "../store";

export function viewModeIsEditor() {
  return store.getState().viewMode === "EXPLORE_VIEW";
}

export function viewModeIsPresentation() {
  return store.getState().viewMode === "REPORT_VIEW";
}

export function prettyDate(time) {
  const date = new Date(time);
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);
  // return date for anything greater than a day
  if (Number.isNaN(dayDiff) || dayDiff < 0 || dayDiff > 0) {
    return `${date.getDate()} ${date.toDateString().split(" ")[1]}`;
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && "just now") ||
        (diff < 120 && "1 minute ago") ||
        (diff < 3600 && `${Math.floor(diff / 60)} minutes ago`) ||
        (diff < 7200 && "1 hour ago") ||
        (diff < 86400 && `${Math.floor(diff / 3600)} hours ago`))) ||
    (dayDiff === 1 && "Yesterday") ||
    (dayDiff < 7 && `${dayDiff} days ago`) ||
    (dayDiff < 31 && `${Math.ceil(dayDiff / 7)} weeks ago`)
  );
}

export function formatDateString(d) {
  const newd = new Date(d);
  return newd.toUTCString();
}
