# Design principles

## Our core principles

- Human factors come before everything else
- Scientific computing and computational inquiry uses a different workflow than typical software development, and needs different tools
- We want to make the advantages of web tech available to scientists without requiring them to become fully fledged web devs

## Secondary principles
Flowing from those core principles, we have a number of secondary principles/objectives that revolve around the notion of reduce friction for people that want out the platform.

- Users should be able to get up and running immediately and be able to start doing real work entirely within the browser.

    - Allowing the notebook to work with other client and/or server-side programs/components/tools (e.g. external editors, external compute kernels (other languages or big data thingies)) might be something cool to work on down the road, but is not an objective at the moment
    - Addons to do things that the browser restricts or can’t do for some reason (file system access, halting hung scripts) could potentially be ok for power users, but cannot be a requirement to get going with a satisfactory experience.

- Avoid magic APIs -- users should (within reason) not have to learn about a ton of idiosyncrasies of the notebook to get up and running.

    - Users need to be able to build off of existing work/examples/resources. Users need to be able to pull examples from bl.ocks.org or JSfiddle or Stackoverflow and have them run in the notebook without modification (within reason). This means, among other things, seamless access to all browser APIs is a hard requirement, and things that change the way standard JavaScript is executed in the browser are to be avoided.
    - Helper libraries are desirable, but they should just act like regular JS libraries and not require users to contort their mental model of how vanilla JS works, or pollute the regular JS environment. (Ex: it would be preferable to add a single namespaced helper lib than to dump a bunch of utility functions into the global scope).
    - We want to support syntax extensions for mathematics, but we want them to be opt in, not something that a user will have to learn to be able to use a notebook.
- Don’t innovate too much -- at least initially, we want to follow existing, familiar paradigms that will enable people to dive right in.

## Initial use case
In building this tool, we will keep our eyes on a broad swath of computational inquiry use cases, and we’ll strive to avoid making decisions that limit the tools use to a specific domain. We're initially be targeting small to medium _N_ data science workflows, since these often come up at Mozilla and we're very familiar with them, but if your use case requires something that we haven't addressed yet, please leave us a message at our [Google group](https://groups.google.com/forum/#!forum/iodide-dev).

