# Key concepts and getting started

Iodide is tool designed to make Web-based scientific communication and computation more accessible to scientists by bringing them a low friction iterative workflow in a familiar environment influenced by tools such as Jupyter, R-Studio, and the MATLAB IDE. We believe that the Web provides an unparalleled platform for communicating scientific ideas with easily shareable interactive data visualization and accessible beautiful write up, but that modern Web development seems slow, cumbersome, and unapproachable to most scientists.

Iodide stands alongside other excellent tools for exploring and prototyping JavaScript, and it may be used just for prototyping and experimenting with web programming if desired. Unlike many of the other available tools, however, Iodide is focused on allowing you to easily create and share an uncluttered "report", a presentable document that looks how _you_ want it to look, and that is not mixed with code or other distracting UI elements. For those familiar with R-Markdown, the workflow will be familiar: code and written material are combined within a document as desired, but the final output is a nicely formatted presentational document. In the case of R-Markdown, that document is typically a PDF, but in Iodide that output is a fully interactive Web document, capable of running it's own live JavaScript (_and other languages via WebAssembly!_), and with full access to the browser's complete set of capabilities. And unlike a PDF generated via R-Markdown, with one click you and your collaborators can return to your code, updating and remixing it as desired!

## Anatomy of an Iodide notebook

When you open a new Iodide notebook, by default you'll see Iodide's __explore view__, which looks like this:

![Screen Shot 2019-03-11 at 4 58 45 PM](https://user-images.githubusercontent.com/95735/54166135-08936e00-4421-11e9-9817-aca915831f42.png)

Here are the key components of what you're seeing:

- At the top is Iodide's __menu bar__, which allows you to access the controls needed to manage your Iodide session. Importantly, in the top right of the menubar you'll find the __view button__ which allows you to toggle back and forth between the _explore view_ and the _report view_.
- Beneath the menu bar are a set of tabbed panes. These panes can be moved and resized, allowing you to create a customize layout depending on your workflow needs. The panes are:
    - The _editor pane_ shown on the left side of the window by default. In this pane, you can edit your [iomd](iomd.md) code. You can also evaluate a chunk of [iomd](iomd.md) code by pressing `ctrl+enter` (or `shift+enter` to evaluate the current chunk and advance to the next).
    - the _report preview_, shown on the top right, does exactly what it sounds like: it gives you a preview of what your report will look like based on the Markdown you've entered and the code you've evaluated so far. (And remember: you can see the full report by clicking the "REPORT" button in the toolbar at top)
    - the _console pane_ in the bottom right shows you the outputs from the iomd chunks you've evaluated, allows you to scroll back through your evaluation history, and allows you to enter one-off bits of code without putting them in your iomd document
    - the _workspace pane_ (not shown by default) allows you to explore the variables you have created by evaluating code during your session

## Writing and experimenting in your notebook

As mentioned above, to create a  notebook, you will edit [IOMD](iomd.md) code in the editor pane. You can mix code, markdown and few other IOMD chunk types as needed to tell your story the way that you want.

As you go, you can also evaluate a [IOMD](iomd.md) code chunks pressing `ctrl+enter` (or `shift+enter` to evaluate the current chunk and advance to the next). These chunks of code don’t do anything until you explicitly evaluate them. Behind the scenes, Iodide is just running `eval` on your JavaScript code in an iframe with its own JavaScript evaluation scope and browser DOM separate from the editor (or, in the case of language plugins, Iodide makes a call to an interpreter compiled to WebAssembly that is contained in the iframe scope).

## The Iodide Server

The Iodide server provides a hosted solution to make edits and save changes to your Iodide notebook on the Web. The server allows for you to create a profile to save your collection of notebooks, track changes made in a central location.

When editing an iodide notebook, the content of your notebook should be saved at a regular interval (currently 30 seconds) as you type. The server has a collection of all the revisions explicitly saved to the during your session. To access the revisions for a notebook, go to the landing page and hover over a notebook of interest. You will see the option `revisions` that you can click, which will take you the history of revisions for that notebook.


## Sharing your notebook

Your notebook will have a link associated with it - just look in your browser’s url bar. At any time, you can share that link with others, and they’ll be able to view, run, and fork your notebook.

By default, if you share the editor link (which looks like [https://alpha.iodide.io/notebooks/151/](https://extremely-alpha.iodide.io/notebooks/151/)), anyone who opens it will be brought to the editor. If you append `?viewMode=report` (so it looks like this - [https://alpha.iodide.io/notebooks/151/?viewMode=report](https://alpha.iodide.io/notebooks/151/?viewMode=report)) the notebook will open as a report, which automatically runs all the code and renders the Markdown when the page loads. At any time, a reader can click the “EXPLORE” button on the top right to jump back into the editor view and dig deeper.

At this time, we don’t have a way of setting viewing permissions on notebooks, but will in the future.


