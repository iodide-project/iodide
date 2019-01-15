# JSMD format 

## What is JSMD?

JSMD, short for **J**ava**S**cript **M**ark**D**own, is the file format that
Iodide notebooks are written in. It provides a way to interleave the narrative
parts of your notebook, written in Markdown, with the computational parts, written
in Javascript, or through the use of language plugins, in other languages such
as Python or OCaml.

It is simply a collection of contents in different languages,
separated by lines that start with `%%` and indicate the language of the chunk
below.

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

## JSMD chunk types

### Markdown (`%% md`)

Markdown chunks allow you to enter (Markdown)[https://commonmark.org/help/] ((full spec)[https://spec.commonmark.org/]), which is immediately rendered in your report preview.

Markdown is a superset of HTML, which means that you can enter HTML directly within a Markdown chunk. This is particularly useful for creating DOM elements that you can target with your scripts later on, like in the following example,:

```
% md
# Section title

A paragraph introducing the topic.

<div id="plot-1"></div>

A paragraph describing plot-1.
```

We can then manipulate `div#plot-1` using standard browser APIs, 

Markdown chunks also support LaTeX for displaying nicely typeset mathematics. LaTeX expression may be placed inline when set between single dollar signs (`$...$`), or in their own block when set between double dollar signs (`$$...$$`).

```
# Derivatives

Let's begin by discussing $\epsilon$-$\delta$ arguments, before exploring the definition of the derivative in terms of the limit:

$$\lim_{h\to 0} \frac{f(x+h)-f(x)}{h}.$$

```

### Javascript (`%% js`)

### CSS (`%% css`)

### Fetch chunks (`%% fetch`)

### Python (`%% js`)

### plugins (`%% plugin`)




