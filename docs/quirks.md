# Quirks and workarounds

## Variable declarations and scope ("why aren't my variables visible in the global scope?")

If you declare variables in a Javascript code chunk using the `let` or `const` keyword, those variables will not be accesible to code in other `js` chunks, not will those variables be visible in the environment pane. Variables declared using `var`, however, will not suffer this restriction, and neither will variables defined without an explicit declaration keyword.

This is a result of Javascript's somewhat arcane scoping rules and the way that Iodide executes javascript code, which uses Javascript's `eval` functionality:
- variables defined _without_ a declaration are available in the _global scope_.
- variables defined with a `var` declaration are available within the nearest enclosing _function scope_. JS `eval` does not create a function scope, and because Iodide evaluates code in the global scope, variables created at the top level of a code chuck with a `var` declaration are available in the global scope.
- variables defined with `let` and `const` are avaible within the nearest enclosing _block scope_. JS `eval` _does_ create a block scope, so variables created within a code chunk using these declarations will not be usable outside of the chunk.

While using global variables is rightly discouragedin application development, for exploratory scientific scripting it is normally acceptable. Thus, in Iodide it is often preferable to define variables without explicit declarations or to use `var`. However, there are times when you might want to prevent variables defined in the top level of  acode chunk from "leaking" out into your global evaluation scope. In these cases, using `let` and `const` declarations can confine data to a particular scope and help keep your workspace tidy.


