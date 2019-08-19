export const truncateString = (s, maxLen, truncationLen) =>
  s.length > maxLen
    ? { stringValue: s.slice(0, truncationLen), isTruncated: true }
    : { stringValue: s, isTruncated: false };
