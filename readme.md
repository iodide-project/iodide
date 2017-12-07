### warning: pre-pre-pre alpha

Please bear in mind that this is a tech demo and an early proof-of-concept. So far, it's just been me (bcolloran) and Hamilton hacking on this. I'm a certainly no JS expert, and while Hamilton has some chops (having built metricsgraphics), neither of us are pro web devs. This app is not ready for production use (though I have already used it to recreate some real work...); there are a zillion rough edges and bugs, and the performance of the editor needs work (the evaled code runs plenty fast).

We'd really appreciate feedback of any kind -- bug reposrt, feature requests, general thoughts. You can use the issue tracker here, hit us up in #scientific-computing, or email us-- whatever works for you.

# The javascript notebook

A notebook-style browser-based IDE for javascript. One piece of a larger goal - scientific computing in the browser with JS, the DOM, and other web technologies.

![](https://www.dropbox.com/s/rmxkrcsfuxbjywq/NOTEBOOK.gif?dl=0)

# Setup

Run `npm install` after cloning this repository.

## Building

Run './node_modules/.bin/webpack --watch' to build & monitor any new file changes.

# Using the notebook

Just open up the file `index.html` in your browser. Three example notebooks are included under "saved notebooks" in the hamburger menu.

For now, work can be saved to local storage using the "Save Notebook <ctrl-s>" menu item, or exported to a json file with "Export Notebook <ctrl-e>" (I had an issues with local storage getting corrupted early on, so I export periodically).

(Note that we have not yet built the full export+bundling functionality described in our initial presentation. That is near the top of our list for new feature work, but for now, there is not a seamless way to export and share notebooks (the examples included with the notebook. We'd love help building this feature, since we think it's one of the key value advantages of this approach))

We've tried to model the rest of the experience quite closely on Jupyter (keybindings and other behaviors), so hopefully it will feel familiar -- other than a couple small things, we have intentionally tried *not* to innovate very much on Jupyter's UX-- but let us know if you have any questions. (FWIW, two of the small things we have added are a "declared variables pane" <ctrl-d> which lets you examine the variables in the global scope, and an "execution history pane" <ctrl-h> which lets you see what code you've run in the order in which you've run it (helpful if you delete a cell and change your mind a while later, or if you want to reconstruct the changes you've made to the state))

# Contributing

Please join us! The notebook is written using React+Redux, which, if you haven't used them, are pretty delightful -- there's some learning curve, but even for non-professional webdevs (like me) that curve is not too steep, and the mental model is clean and powerful.

Since we're not real web devs, we've been doing a lot of learning on the fly -- we know that the code is pretty rough, and there's surely a lot of low-hanging fruit for people interested in and helping us figure out cleaner ways to do things. We'd love input from full-time JS devs and application architects.

We have a number of thoughts about the direction we're heading, and we've tried to write up some of our [principles and assumptions]( https://docs.google.com/document/d/1KcELJ15hxvDBy4Qb8TzTZ1Lk_4kaSXjvzpcg3M0cQRg/edit# ).  Hopefully that doc gives a sense of the ideas animating this project, but there are a lot of questions that are entirely open (and it's worth stating that we're willing to question our core assumptions and change directions given good evidence and arguments).

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

