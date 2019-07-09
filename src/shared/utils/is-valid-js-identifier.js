// rule out a few things right away with a quick regex:
// cannot contain <space> ; = :
const forbiddenChars = / |;|=|:|@/;

export function isValidIdentifier(identifier) {
  if (identifier.search(forbiddenChars) > -1) {
    return false;
  }
  try {
    eval(`var ${identifier};`); // eslint-disable-line no-eval
    return true;
  } catch (err) {
    return false;
  }
}
