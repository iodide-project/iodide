### early alpha - subject to breakage, changes, argument, refactors

# The javascript notebook

This repository began as an early answer to the question: __can we do scientific computing without ever leaving the browser?__ We are building a modern, browser-first notebook-style IDE that capitalizes on web technologies for interative / literate / inquisitive computing. The notebook borrows inspiration from RStudio, Jupyter, Carbide, and many other computing environments.

![](https://media.giphy.com/media/xT0xeJdYMwA8GvEdCE/giphy.gif)

Having a scientific computing platform that solely uses web technologies has several big benefits. First, the DOM is the best presentation layer in the world, but most scientific computing treats it as an afterthought. Having our analyses as close to the DOM as you can get solves the "last mile" problem with most presentation of data. Second, thanks to advances in Javascript and other wonderful technologies like WebAssembly, JS is fast now. JS's main challenge is a lack of decent libraries for scientific computing like NumPy, SciPy, and Pandas for Python, which is surmountable. Finally, JS syntax is not ergonomic for scientific computing tasks. But thanks to transpilation, we can extend the JS syntax just enough for matrix notation, broadcasting, and other basic scientific computing tasks. Finally, we're at a point in computing history where many scientists know at least a little javascript, and many programmers are very well-versed, so we do not face a labor market issue for building tools & activating the community.

That's a lot to consider. So we decided to focus on building a Javascript-powered IDE to explore all of these ideas. By focusing on the notebook, we can begin to piece together the other bare necessities needed for a robust browser-based scientific computing platform while providing immediate value to data analysts.

# Setup

Run `npm install` after cloning this repository.

## Building

Run `npm run build` to build & monitor any new file changes.

## Testing

Run `npm test` to run the test suite.

# Using the notebook

Because our notebook is 100% client-side, you can just open up the file `index.html` in your browser. Three example notebooks are included under "saved notebooks" in the hamburger menu.

For now, work can be saved to local storage using the "Save Notebook <ctrl-s>" menu item, or exported to a json file with "Export Notebook <ctrl-e>" (for the time being, we advise periodically exporting any code you care about).

We've modeled much of the experience on Jupyter as our jumping-off point, with a few additions. Check out our milestones & issues to see the direction we're going.

# Contributing

Please join us! The notebook is written using React+Redux, which, if you haven't used them, are pretty delightful -- there's some learning curve, but even for non-professional webdevs (like me) that curve is not too steep, and the mental model is clean and powerful.

We especially need help with:

- thinking about where exactly JS computation should live. In a webworker? Should we stay in the main thread? How do we give native-feeling dom manipulation if we're not in the main thread?
- test coverage for everything in our system.
- demos, tutorials, and documentation. The more we have, and the better organized it is, the better.

You can view our [principles and assumptions]( https://docs.google.com/document/d/1KcELJ15hxvDBy4Qb8TzTZ1Lk_4kaSXjvzpcg3M0cQRg/edit# ) for this project here.

Feel free to join our Slack channel: `#scientific-computing`

And of course feel free to email us - bcolloran and hulmer - directly.

## Roadmap

There are a bunch of features that we know we want to build to make this compelling. Here are a few in rough order of priority:

* Export improvements
  * Bundling code with editor
  * export/import just the “jsmd” -- text mode with cell divisions rather than a JSON blob (good for diff tools and texty tools)
  * Export/import to gists or other external repos
* r-studio mode
* editor improvements
  * fuzzy autocomplete, code hints
  * IDEish syntax and error checking
  * Special character insertion (greek, special operators, etc)
  * Latex editing help (Lyx-like wysiwym preview for equation editing)
* UI for importing local data from file (with drag and drop? Needed for XSS reasons, lack of filesystem access reasons)
* extensive documentation, tutorials, and demos showcasing the vision
