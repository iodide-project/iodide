# Common workflows and tips

## Getting data into an Iodide notebook

Iodide can use Javascript and standard browser APIs to download data from public URLs on the web. As a convenience, we also provide a “fetch cell” in JSMD, which allows you to load data using a shorthand syntax. You can read more about JSMD fetch chunk syntax in the fetch chunk section of the [JSMD docs](jsmd.md).

### CORS problems

Note that the one of biggest problems people encounter when attempting to load data into Iodide is problems with [CORS settings](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), which can restrict the ability of Iodide to download data from some other websites. Unfortunately, for security reasons browsers make it [impossible to surface CORS errors in a web app](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Functional_overview), so Iodide cannot give you the guidance you need directly, but if you have trouble loading a data file from a third party server, this is very likely to be the reason why. To check, you can open your browser's developer tools (press `ctrl+shift+i`); in case of a CORS issue, you will see a message like: 

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at {URI of resource you tried to load}.
(Reason: CORS request did not succeed).
```

To work around CORS errors, you need to upload your data to a server that does notimpose restrictions on resource sharing. We recommend using [GitHub Gists](https://gist.github.com/), which allows users to upload files that can be downloaded within Iodide. After uploading your data into a gist, you can access the data by copying the URL for the "raw" version of your gist, which can be accessed at `https://gist.githubusercontent.com/{your user name}/{your gist id}/raw`

## Manipulating the DOM (for e.g adding plots)

Some plotting libraries (like d3, or Plotly) require a DOM element to be available before you can plot. The easiest way to do this is to add a `<div>` into a Markdown cell and then select:

```plain

%% md

<div id=’plot-target’></div>

%% js

d3.select(‘#plot-target’) ...

```

You can always manipulate the DOM in Markdown cells as if your notebook were a static web page. Anything defined in a Markdown cell is fair game for DOM manipulation, and almost all of the WebAPI is available.

