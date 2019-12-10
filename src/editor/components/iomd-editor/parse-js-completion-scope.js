const scopeEndRE = /(\["[^"]*|\['[^']*|\[`[^`]*|\s*\.|\s*\.[_$a-zA-Z][_$a-zA-Z0-9]*)$/;
const scopeRootRE = /[_$a-zA-Z][_$a-zA-Z0-9]*$/;
const scopeMiddleRE = /\s*\.([_$a-zA-Z][_$a-zA-Z0-9]*)$|\["(.*)"\]$|\['(.*)'\]$|\[`(.*)`\]$|\[([0-9]*)\]$/;

export function getCompletionScope(code) {
  let codeRemaining = code;
  const scope = [];
  let match = scopeEndRE.exec(code);
  if (!match) return scope;

  codeRemaining = codeRemaining.slice(0, match.index);
  match = scopeMiddleRE.exec(codeRemaining);

  let scopeItem;
  while (match) {
    // eslint-disable-next-line prefer-destructuring
    scopeItem = match.slice(1).filter(x => x !== undefined)[0];

    scope.unshift(scopeItem);
    codeRemaining = codeRemaining.slice(0, match.index);
    match = scopeMiddleRE.exec(codeRemaining);
  }

  const scopeRoot = scopeRootRE.exec(codeRemaining);
  if (scopeRoot) scope.unshift(scopeRoot[0]);

  return scope;
}
