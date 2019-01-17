# Key concepts and getting started

Iodide is tool designed to make Web-based scientific communication and computation more accessible to scientists by bringing them a low friction iterative workflow in a familiar environment influenced by tools such as Jupyter, R-Studio, and the MATLAB IDE. We belive that the Web provides an unparalled platform for communicating scientific ideas with easily shareable interactive data visualization and accessible beautiful write up, but that modern Web development seems slow, cumbersome, and unapproachable to most scientists.

Iodide stands alongside other excellent tools for exploring and prototyping Javascript, and it may be used just for prototyping and experimenting with web programing if desired. Unlike many of the other avaiable tools, however, Iodide is focused on allowing you to easily create and share an uncluttered "report", a presentable document that looks how _you_ want it to look, and that is not mixed with code or other distracting UI elements. For those familiar with R-Markdown, the workflow will be familiar: code and written material are combined within a document as desired, but the final output is a nicely formatted presentational document. In the case of R-Markdown, that document is typically a PDF, but in Iodide that output is a fully interactive Web document, capable of running it's own live Javascript (_and other languages via WebAssembly!_), and with full access to the browser's complete set of capabilities. And unlike a PDF generated via R-Markdown, with one click you and your collaborators can return to your code, updating and remixing it as desired!

## Anatomy of an Iodide notebook

When you open a new Iodide notebook, by default you'll see Iodide's __explore view__, which looks like this:

(need to add screen shot of default new notebook view with annotations)

Here are the key components of what you're seeing:

- At the top is Iodide's __menu bar__, which allows you to access the controls needed to manage your Iodide session. Importantly, in the top right of the menubar you'll find the __view button__ which allows you to toggle back and forth between the _explore view_ and the _report view_.
- Beneath the menu bar are a set of tabbed panes. These panes can be moved and resized, allowing you to create a customize layout depending on your workflow needs. The panes are:
    - The _editor pane_ shown on the left side of the window by default. In this pane, you can edit your [jsmd](jsmd.md) code. You can also evaluate a chunk of [jsmd](jsmd.md) code by pressing `ctrl+enter` (or `shift+enter` to evaluate the current chunk and advance to the next`).
    - the _report preview_, shown on the top right, does exactly what it sounds like: it gives you a preview of what your report will look like based on the Markdown you've entered and the code you've evaluated so far. (And remember: you can see the full report by clicking the "REPORT" button in the toolbar at top)
    - the _console pane_ in the bottom right shows you the outputs from the jsmd chunks you've evaluated, allows you to scroll back through your evaluation history, and allows you to enter one-off bits of code without putting them in your jsmd document
    - the _workspace pane_ (not shown by default) allows you to explore the variables you have created by evaluating cde during your session


## Sharing your report

