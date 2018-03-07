[![Build Status](https://travis-ci.org/iodide-project/iodide.svg?branch=master)](https://travis-ci.org/iodide-project/iodide)
# The Iodide notebook


### early alpha - subject to breakage, changes, argument, refactors

_Try it in your browser [right now](https://iodide-project.github.io/iodide-examples/what-a-web-notebook-looks-like.html)!_

The Iodide notebook seeks to answer one question: __can we do scientific computing without ever leaving the browser?__ We are building a modern, browser-first notebook-style IDE that utlilizes web technologies for interative / literate / inquisitive computing. The notebook borrows inspiration from RStudio, Jupyter, Carbide, and many other computing environments.

![](https://media.giphy.com/media/xT0xeJdYMwA8GvEdCE/giphy.gif)

Having a scientific computing platform that solely uses web technologies has several big benefits. First, the DOM is the best presentation layer in the world, but most scientific computing platforms treat it as an afterthought. Having your analyses adjacent to the DOM solves the "last mile" problem common with other platforms. Second, thanks to advances in Javascript and other wonderful technologies like WebAssembly, JS is fast now. JS's main challenge is a lack of decent libraries for scientific computing like NumPy, SciPy, and Pandas for Python, which is surmountable. Finally, JS syntax is not ergonomic for scientific computing tasks. But thanks to transpilation, we can extend the JS syntax just enough for matrix notation, broadcasting, and other basic scientific computing tasks. Finally, we're at a point in computing history where many scientists know at least a little javascript, and many programmers are very well-versed, so we do not face a labor issue for building tools & activating the community.

That's a lot to consider. So we decided to focus on building a Javascript-powered IDE to explore all of these ideas. By focusing on the notebook, we can begin to piece together the other bare necessities needed for a robust browser-based scientific computing platform while providing immediate value to data analysts.

Read more about our core principles below; if our vision resonates with you, please consider contributing to the project!

# Setup

Run `npm install` after cloning this repository.

## Running/Building

### Development mode

Use `npm run start` to write development versions of the Iodide app resources to `dev/`. To run your dev notebook, just open the file `dev/iodide.dev.html` in your browser.

`npm run start` runs in watch mode, so changes to files will be detected and bundled into `dev/` automatically, but you will need to refresh the page in your browser manually.

In dev mode, resource paths are set to be relative to the `dev/` directory. Thus, you export a notebook from a dev notebook, you need to be sure save the exported HTML file in the `dev/` folder for the relative paths to correctly resolve the required js/css/font files.

### Production mode 

Use `npm run build` to write deployable versions of the Iodide app resources to `prod/`. This builds just once, and does not watch your files for changes.

The files built in prod mode have resource paths set to fixed web addresses, not relative paths (this is a required for exported notebooks to be portable). This means that if you open the file `prod/iodide.${VERSION}.html` in your browser, it will _not_ load the js/css/font resources located in `prod/`, it will load them from the hard-coded web address (if they exist at that location). Once the js/css/fonts are uploaded to the matching URI, the file `prod/iodide.${VERSION}.html` (as well as any notebook exported from it) should run correctly from any local filesystem location or web address.

## Testing

Run `npm test` to run the test suite once, or `npm test --watch` to run the suite in watch mode, which will automatically re-run the tests when the source or tests have changed.

# Using the notebook

Three example notebooks are included under "saved notebooks" in the hamburger menu.

For now, work can be saved to local storage using the "Save Notebook <ctrl-s>" menu item, or exported to a json file with "Export Notebook <ctrl-e>" (for the time being, we advise periodically exporting any code you care about).

We've modeled much of the experience on Jupyter as our jumping-off point, with a few additions. Check out our milestones & issues to see the direction we're going.

# Contributing

Please join us! The notebook is written using React+Redux, which, if you haven't used them, are pretty delightful -- there's some learning curve, but even for non-professional webdevs the curve is not too steep, and the mental model is clean and powerful.

See our ["How to Contribute" page](CONTRIBUTING.md) for more information.

We especially need help with:

- test coverage for everything in our system.
- demos, tutorials, and documentation. The more we have, and the better organized it is, the better.

# Our core principles
- Human factors come before everything else
- Scientific computing and computation inquiry implies different needs than typically web development
- We want to make the advantages of web tech available to scientists without requiring them to become fully fledged web devs

## Secondary principles
Flowing from those core principles, we have a number of secondary principles/objectives that revolve around the notion of reduce friction for people that want out the platform.
- Portability is key -- users should be able to get up and running immediately and be able to start doing real work entirely within the browser. 
    - Allowing the notebook to work with other client and/or server-side programs/components/tools (e.g. external editors, external compute kernels (other languages or big data thingies)) might be something cool to work on down the road, but is not an objective at the moment
    - Addons to do things that the browser restricts or can’t do for some reason (file system access, halting hung scripts) could potentially be ok for power users, but cannot be a requirement to get going with a satisfactory experience.
- No magic APIs -- users should (within reason) not have to learn about a ton of idiosyncrasies of the notebook to get up and running.
    - Users need to be able to build off of existing work/examples/resources. Users need to be able to pull examples from bl.ocks.org or JSfiddle or Stackoverflow and have them run in the notebook without modification (within reason). This means, among other things, seamless access to all browser APIs is a hard requirement.
    - Helper libraries are desirable, but they should just act like regular JS libraries and not require users to contort their mental model of how vanilla JS works, or pollute the regular JS environment. (Ex: it would be preferable to add a single namespaced helper lib than to dump a bunch of utility functions into the global scope).
    - We want to support syntax extensions for mathematics, but we want them to be opt in, not something that a user will have to learn to be able to use a notebook.
- Don’t innovate too much -- at least initially, we want to follow existing, familiar paradigms that will enable people to dive right in.

You can read more about how these priciples have shaped the choices we've made so far [in our FAQ]( ../../wiki/FAQ )

## Initial use case
In building this tool, we will keep our eyes on a broad swath of computational inquiry use cases, and we’ll strive to avoid making decisions that limit the tools use to a specific domain. That said, it seems reasonable to initially target at least a subset of data science workflows we’ve been doing at Mozilla. This is a use case that we know well, and targeting this use case will make this tool immediately useful within Mozilla.


## Roadmap

There are a bunch of features that we know we want to build to make this compelling. Here are a few in rough order of priority:

- Export improvements
    - Option to Inline bundle.js (rather than load from URL)
    - Options to inline external libs in a saved snapshot
    - Saving an “environment” (a la R and R Studio) with selected variables that were computed during a session
        - serializing/compressing data inline (needed for bigger datasets),
        - Estimate of total bundled size with all scripts and environment vars
    - Export/import to gists, g-drive, dropbox, and other external repos
- r-studio mode (direct editing of jsmd)
- editor improvements
    - Code editor
        - Code hints, autocomplete
        - Special character insertion (greek, special operators, etc)
    - Latex editor
        - hints, autocomplete (for latex, this includes special character insertion)
        - Lyx-like wysiwyg preview for equation editing
- UI for importing local data from file (with drag and drop? Needed for XSS reasons, lack of filesystem access reasons)

## License

The __IODIDE__ code is shared under the terms of the [Mozilla Public License v2.0](http://www.mozilla.org/MPL/2.0/). See the `LICENSE` file at the root of the repository.
