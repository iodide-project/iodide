# Common workflows and tips

## Getting data into an Iodide notebook

Iodide can use JavaScript and standard browser APIs to download data from public URLs on the web. As a convenience, we also provide a “fetch chunk” in IOMD, which allows you to load data using a shorthand syntax. You can read more about IOMD fetch chunk syntax in the fetch chunk section of the [IOMD docs](iomd.md).

### From a remote server

It's possible to download data from a remote server using a browser APIs or a fetch cell. Examples are given in the fetch chunk section of the [IOMD docs](iomd.md).

#### CORS problems

One of the most common problems people encounter when attempting to load data into Iodide from a remote server are issues with [CORS settings](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), which can restrict the ability of Iodide to download data from some other websites. Unfortunately, for security reasons browsers make it [impossible to surface CORS errors in a web app](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Functional_overview), so Iodide cannot give you the guidance you need directly, but if you have trouble loading a data file from a third party server, this is very likely to be the reason why. To check, you can open your browser's developer tools (press `ctrl+shift+i`); in case of a CORS issue, you will see a message like:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at {URI of resource you tried to load}.
(Reason: CORS request did not succeed).
```

To work around CORS errors, you need to upload your data to a server that does not impose restrictions on resource sharing. We recommend using either the Iodide server for storing data (see below), or using a [GitHub Gist](https://gist.github.com/), which will allow you to upload files that can be downloaded within Iodide. After uploading your data into a gist, you can access the data by copying the URL for the "raw" version of your gist, which can be accessed at `https://gist.githubusercontent.com/{your user name}/{your gist id}/raw`

### Uploading data to an Iodide notebook

_Note (2019-03-11): during our alpha period, files larger than 10MB cannot be uploaded._

If you want to work with data stored on your local machine or if you are
encountering CORS problems while attempting to use a dataset from a remote
server, you may upload data directly to Iodide.

Data is uploaded on a per-notebook basis&mdash;rather than uploading data to
your user account, you upload it to a specific notebook. To do so, click on the
hamburger menu icon near the top-left of the page, then click _Manage Files_.
The file management modal will appear. Click _Add Files_ and select any number
of files to upload. Once the files finished uploading, they will appear in a
list alongside other files associated with that notebook. Click _Delete_ at any
time to delete a file.

To access this file from your notebook, you would use a fetch cell with the
syntax --

```
%% fetch
TYPE: VAR_NAME = FILE_NAME
```

-- where `TYPE` is the type of the file ("text", "json", "arraybuffer", or "blob"), `VARNAME`
is the variable into which you want to load the data, and `FILE_NAME` is the
name of the file you uploaded.

This notebook [shows how to load and use an image blob](https://alpha.iodide.io/notebooks/127/).

## Manipulating the DOM (for e.g adding plots)

Some plotting libraries (like d3, or Plotly) require a DOM element to be available before you can plot. The easiest way to do this is to add a `<div>` into a Markdown cell and then select the element using browser APIs or functions from your preferred library:

```plain
%% md
<div id=’plot-target’></div>

%% js
elt1 = document.getElementById("plot-target") // browser API, one option...
elt2 = document.querySelector("#plot-target") // browser API, another option
$("#plot-target") ... // jQuery
d3.select("#plot-target") ... // d3
```

You can always manipulate the DOM in Markdown cells as if your notebook were a static web page. Anything defined in a Markdown cell is fair game for DOM manipulation using the browser's [document API methods](https://developer.mozilla.org/en-US/docs/Web/API/Document).
