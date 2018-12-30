[![CircleCI](https://img.shields.io/circleci/project/github/iodide-project/iodide/master.svg)](https://circleci.com/gh/iodide-project/iodide)
[![Join the chat at https://gitter.im/iodide-project/iodide](https://badges.gitter.im/iodide-project/iodide.svg)](https://gitter.im/iodide-project/iodide?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


<h1 align='center'>
  <img width=100 src='https://files.gitter.im/iodide-project/iodide/xW1J/iodide-sticker-2.png' />
   <br />
  The Iodide notebook</h1>

_Try it in your browser [right now](https://iodide.io/iodide-examples/what-a-web-notebook-looks-like.html)! ([More examples](https://github.com/iodide-project/iodide-examples))_

### Please note: Iodide is in early alpha, and still subject to breakage, changes, and overhauls

### _View source_ for science
Today, sharing scientific results is easier than ever. You can email a PDF, write up a Google doc, or post to your blog. You can embed plots, data tables, and even interactive visualizations. But what if you want people to be able to replicate and extend your results -- to take your results and “view source” to see how you arrived at your conclusions? Or even hack and remix them to ask their own questions?

To do that now, you typically have a couple options. You could send your code along side your nice, clean PDF or HTML export, allowing you fine-grained control over your presentation, but requiring you to separate your presentable results from your code and to manage multiple files. Alternatively, you could share your results and code bundled together in a notebook format that mixes code with write-up; this has the advantage of keeping your code and results closely tied together, but the presentation can get a bit unwieldy, especially if you want to share your results with a less technical audience. And in either case, sharing your code will only allow your collaborators to replicate and extend your results if they are first able to replicate your whole setup -- if they can run your code with the same libraries, the same data, and the server access.

If only there was a technology that was great for presenting documents and visualizations, that allows code to run anywhere with zero setup, and that all scientists and citizens had access to...

Luckily, that technology already exists: _the web browser_.


![](https://media.giphy.com/media/p3dqP6RwE82hBCe66y/giphy.gif)


Iodide is a modern, literate, and interactive programming environment that uses the strengths of the browser to let scientists work flexibly and collaboratively with minimal friction. With Iodide you can tell the story of your findings exactly how you want, leveraging the power of HTML+CSS to display your results in whatever way communicates them most effectively -- but still keeping the live, editable code only _one click away_. Because Iodide runs in the browser you already have, you can extend and modify the code without having to install any software, enabling you to collaborate frictionlessly.

And thanks to WebAssembly, working in the browser _does not_ mean that you have to work in Javascript. We're already working on getting [Python+Numpy+Pandas running in the browser](https://github.com/iodide-project/pyodide), and that's just the start. We envision a future workflow that allows you to do your data munging in Python, fit a quick model in R or JAGS, solve some differential equations in Julia, and then display your results with a live interactive d3+Javascript visualization... and all that within within a single, portable, sharable, and hackable file.

Our focus is on delivering frictionless, human-centered tools to scientists. You can read more about our core principles below; if our vision resonates with you, please consider contributing to the project!

_PS: We're working on a few other ways of making this in-browser workflow as ergonomic for scientific tasks as possible. Two of those key efforts will be (1) using modern JS transpilation tools to extend JS syntax just enough for matrix notation, broadcasting, and other basic scientific computing needs; and (2) compiling best-in-class C/C++ science libraries (and runtimes!) to Webassembly and wrapping them in ergonomic JS APIs. If either of those projects appeals to you, please reach out!_

# Get in touch

Please feel free to join our [Google group](https://groups.google.com/forum/#!forum/iodide-dev) to contact us and keep up with what we're working on.

You can also [chat with us on Gitter](https://gitter.im/iodide-project/iodide).

# Learn more about it

Please visit our [documentation](https://iodide.io/docs/).

# Using the notebook

Visit our examples repo at https://github.com/iodide-project/iodide-examples to see demo notebooks

For now, work can be saved to local storage using the "Save Notebook <ctrl-s>" menu item, or exported with "Export Notebook <ctrl-e>", which allows you to download your work as HTML file that will run anywhere (for the time being, we advise periodically exporting any code you care about).

# Contributing

Please join us! The notebook is written using React+Redux, which, if you haven't
used them, are pretty delightful -- there's some learning curve, but even for
non-professional webdevs the curve is not too steep, and the mental model is
clean and powerful.

See our ["How to Contribute" page](CONTRIBUTING.md) for more information.

We especially need help with:

- test coverage for everything in our system.
- demos, tutorials, and documentation. The more we have, and the better organized it is, the better.

# Design principles

## Our core principles

- Human factors come before everything else
- Scientific computing and computational inquiry implies different needs than typical software development
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

## Initial use case
In building this tool, we will keep our eyes on a broad swath of computational inquiry use cases, and we’ll strive to avoid making decisions that limit the tools use to a specific domain. We're initially be targeting small to medium _N_ data science workflows, since these often come up at Mozilla and we're very familiar with them, but if your use case requires something that we haven't addressed yet, please leave us a message at our [Google group](https://groups.google.com/forum/#!forum/iodide-dev).

# License

The Iodide code is shared under the terms of the [Mozilla Public License v2.0](http://www.mozilla.org/MPL/2.0/). See the `LICENSE` file at the root of the repository.
