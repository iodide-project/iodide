export const truncateString = (s, maxLen, truncationLen) =>
  s.length > maxLen
    ? { stringValue: s.slice(0, truncationLen), isTruncated: true }
    : { stringValue: s, isTruncated: false };

export const truncateNumberString = (s, maxLen, precision) =>
  s.length > maxLen
    ? {
        stringValue: Number.parseFloat(s).toPrecision(precision),
        isTruncated: true
      }
    : { stringValue: s, isTruncated: false };
