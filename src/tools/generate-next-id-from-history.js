export default function generateNextIdFromHistory(history) {
  if (!history.length) return 0;
  return Math.max(...history.map(h => h.historyId)) + 1;
}
