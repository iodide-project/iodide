# Quirks and workarounds

Iodide runs your JavaScript code by sending it to an iframe and calling the standard JavaScript `eval` function on that code. We intentionally evaluate code in the simplest way possible so that your JS code will behave the same way in Iodide as it would if you just ran it in your browser within a normal HTML `script` tag. For the most part, this works as expected, however there are a couple quirks that come from using `eval` rather than a plain `script` tag, and there are also a few JavaScript quirks that you are more likely to encounter while exploring code in Iodide than you would be if you were writing a script for a webpage. This page collects explanation of these quirks, and workarounds whenever possible.

_Please also read our page about [workflow tips and tricks](workflows.md) to get the most out of Iodide._

### Variable declarations and scope ("why aren't my variables visible in the global scope?")

If you declare variables in a JavaScript code chunk using the `let` or `const` keyword, those variables will not be accesible to code in other `js` chunks, not will those variables be visible in the environment pane. Variables declared using `var`, however, will not suffer this restriction, and neither will variables defined without an explicit declaration keyword.

This is a result of JavaScript's somewhat arcane scoping rules and the way that Iodide executes javascript code, which uses JavaScript's `eval` functionality:
- variables defined _without_ a declaration are available in the _global scope_.
- variables defined with a `var` declaration are available within the nearest enclosing _function scope_. JS `eval` does not create a function scope, and because Iodide evaluates code in the global scope, variables created at the top level of a code chuck with a `var` declaration are available in the global scope.
- variables defined with `let` and `const` are avaible within the nearest enclosing _block scope_. JS `eval` _does_ create a block scope, so variables created within a code chunk using these declarations will not be usable outside of the chunk.

While using global variables is rightly discouragedin application development, for exploratory scientific scripting it is normally acceptable. Thus, in Iodide it is often preferable to define variables without explicit declarations or to use `var`. However, there are times when you might want to prevent variables defined in the top level of  acode chunk from "leaking" out into your global evaluation scope. In these cases, using `let` and `const` declarations can confine data to a particular scope and help keep your workspace tidy.

### Plain object literals in a chunk ("Why can't I run a js chunk containing just `{a:1, b:2}`?")

When you are working on a project, it can be useful to create a temporary object to be returned from a code chunk for the sole purpose of using the object inspector in the console to explore some data. The obvious way to accomplish this would be to have a minimal `js` code chunk like the following:

```
%% js
{a: variable_1, b: variable_2, c: variable_3}
```

However, if you attempt to run a chunk like this that contains a plain object literal, you will get the error message `SyntaxError: unexpected token: ':'`.

This is because in JavaScript, a curly brace at the start of a statement creates a [block statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block). 

To accompish the objective above, you need to do something to prevent the JavaScript parser from seeing the opening curly brace as the start of a block statement. You could create an assignment statement (using `let` will prevent the variable from leaking into the global scope, see the section above):
```
%% js
let foo = {a: variable_1, b: variable_2, c: variable_3}
```

Or could could also wrap the object literal in parenthesis:
```
%% js
({a: variable_1, b: variable_2, c: variable_3})
```

_Tip: if your objective is to explore your data, remember to check out the Workspace Pane!_
