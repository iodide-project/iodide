## warning: pre-pre-pre alpha

Please bear in mind that this is a tech demo and an early proof-of-concept. So far, it's just been me (bcolloran) and Hamilton hacking on this. I'm a certainly no JS expert, and while Hamilton has some chops (having built metricsgraphics), neither of us are pro web devs. This app is not ready for production use (though I have already used it to do real work...); there are a zillion rough edges and bugs, and the performance of the editor needs work (the evaled code runs plenty fast).

We'd really appreciate feedback of any kind -- bug reposrt, feature requests, general thoughts. You can use the issue tracker here, hit us up in #scientific-computing, or email us-- whatever works for you.

# The javascript notebook

A notebook-style browser-based IDE for javascript. One piece of a larger goal - scientific computing in the browser with JS, the DOM, and other web technologies.

![](https://media.giphy.com/media/3ov9jNSI7tuq5tELfO/giphy.gif)

# Setup

Run `npm install` after cloning this repository.

## Building

Run './node_modules/.bin/webpack --watch' to build & monitor any new file changes.

## Using

Just open up the file `index.html` in your browser. Three example notebooks are included under "saved notebooks" in the hamburger menu.
