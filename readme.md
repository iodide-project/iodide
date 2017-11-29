### warning: pre-pre-pre alpha

Please bear in mind that this is a tech demo and an early proof-of-concept. So far, it's just been me (bcolloran) and Hamilton hacking on this. I'm a certainly no JS expert, and while Hamilton has some chops (having built metricsgraphics), neither of us are pro web devs. This app is not ready for production use (though I have already used it to recreate some real work...); there are a zillion rough edges and bugs, and the performance of the editor needs work (the evaled code runs plenty fast).

We'd really appreciate feedback of any kind -- bug reposrt, feature requests, general thoughts. You can use the issue tracker here, hit us up in #scientific-computing, or email us-- whatever works for you.

# The javascript notebook

A notebook-style browser-based IDE for javascript. One piece of a larger goal - scientific computing in the browser with JS, the DOM, and other web technologies.

![](https://media.giphy.com/media/3ov9jNSI7tuq5tELfO/giphy.gif)

# Setup

Run `npm install` after cloning this repository.

## Building

Run './node_modules/.bin/webpack --watch' to build & monitor any new file changes.

## Using the notebook

Just open up the file `index.html` in your browser. Three example notebooks are included under "saved notebooks" in the hamburger menu.

For now, work can be saved to local storage using the "Save Notebook <ctrl-s>" menu item, or exported to a json file with "Export Notebook <ctrl-e>" (I had an issues with local storage getting corrupted early on, so I export periodically).

(Note that we have not yet built the full export+bundling functionality described in our initial presentation. That is near the top of our list for new feature work, but for now, there is not a seamless way to export and share notebooks (the examples included with the notebook. We'd love help building this feature, since we think it's one of the key value advantages of this approach))

We've tried to model the rest of the experience quite closely on Jupyter (keybindings and other behaviors), so hopefully it will feel familiar -- other than a couple small things, we have intentionally tried *not* to innovate very much on Jupyter's UX-- but let us know if you have any questions. (FWIW, two of the small things we have added are a "declared variables pane" <ctrl-d> which lets you examine the variables in the global scope, and an "execution history pane" <ctrl-h> which lets you see what code you've run in the order in which you've run it (helpful if you delete a cell and change your mind a while later, or if you want to reconstruct the changes you've made to the state))
