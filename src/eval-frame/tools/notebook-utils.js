function getCompletions(token, context) {
  // this function is ported directly from the CodeMirror plugin.
  // Feel free to improve this, but don't judge me for what's here :)
  const stringProps = (
    "charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
    "toUpperCase toLowerCase split concat match replace search"
  ).split(" ");
  const arrayProps = (
    "length concat join splice push pop shift unshift slice reverse sort indexOf " +
    "lastIndexOf every some filter forEach map reduce reduceRight "
  ).split(" ");
  const funcProps = "prototype apply call bind".split(" ");
  const javascriptKeywords = (
    "break case catch class const continue debugger default delete do else export extends false finally for function " +
    "if in import instanceof new null return super switch this throw true try typeof var void while with yield"
  ).split(" ");
  const found = [];
  const start = token.string;
  const global = window;

  function forAllProps(obj, callback) {
    if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
      for (const name in obj) callback(name); // eslint-disable-line
    } else {
      for (let o = obj; o; o = Object.getPrototypeOf(o)) {
        Object.getOwnPropertyNames(o).forEach(callback);
      }
    }
  }

  function maybeAdd(str) {
    if (str.lastIndexOf(start, 0) === 0 && !found.includes(str))
      found.push(str);
  }
  function gatherCompletions(obj) {
    if (typeof obj === "string") stringProps.forEach(maybeAdd);
    else if (obj instanceof Array) arrayProps.forEach(maybeAdd);
    else if (obj instanceof Function) funcProps.forEach(maybeAdd);
    forAllProps(obj, maybeAdd);
  }

  if (context && context.length) {
    // If this is a property, see if it belongs to some object we can
    // find in the current environment.
    const obj = context.pop();
    let base;
    if (obj.type && obj.type.indexOf("variable") === 0) {
      // if (options && options.additionalContext) { base = options.additionalContext[obj.string]; }
      base = base || global[obj.string];
    } else if (obj.type === "string") {
      base = "";
    } else if (obj.type === "atom") {
      base = 1;
    } else if (obj.type === "function") {
      if (
        global.jQuery != null &&
        (obj.string === "$" || obj.string === "jQuery") &&
        typeof global.jQuery === "function"
      ) {
        base = global.jQuery();
      } else if (
        global._ != null &&
        obj.string === "_" &&
        typeof global._ === "function"
      ) {
        base = global._();
      }
    }
    while (base != null && context.length) {
      base = base[context.pop().string];
    }
    if (base != null) gatherCompletions(base);
  } else {
    // If not, just look in the global object and any local scope
    // (reading into JS mode internals to get at the local and global variables)
    for (let v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
    for (let v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
    gatherCompletions(global);
    javascriptKeywords.forEach(maybeAdd);
  }
  return found;
}

export { getCompletions };
