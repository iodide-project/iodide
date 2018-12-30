# JSMD format 

## What is JSMD?

JSMD, short for **J**ava**S**cript **M**ark**D**own, is the file format that
Iodide notebooks are written in. It provides a way to interleave the narrative
parts of your notebook, written in Markdown, with the computational parts, written
in Javascript, or through the use of language plugins, in other languages such
as Python or OCaml.

It is simply a collection of contents in different languages,
separated by lines that start with `%%` and indicate the language of the chunk
below.  For example, JSMD supports the following delimiters:

- `%% md` for Markdown
- `%% js` for Javascript
- `%% css` for CSS
- `%% py` for Python

and so on.

So, why aren't we just exporting big JSON files like Jupyter and calling it a
day? Importantly, a flat file is easy for both humans and computers to
understand. For example, it works out of the box with standard software
development tools like ``diff`` and Github pull requests. The simplicity of this
format is inspired by [`.Rmd`](https://rmarkdown.rstudio.com/r_notebooks.html)
(RMarkdown notebook) files.

Additionally, since the point of Iodide is to give you a living, breathing
notebook evaluation environment, this means we have a lot less state to export,
so are requirements are much simpler than Jupyter's. Markdown chunks get
rendered when a page loads, libraries get requested from cdns, data gets pulled,
and so on. So you don't need to save the kinds of state you do in a Jupyter
notebook.

