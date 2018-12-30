# How to Contribute

Thank you for your interest in contributing to Iodide! There are many ways to contribute, and we appreciate all of them. Here are some guidelines & pointers for diving into it.

## Development

Work on Iodide happens on Github. Core members and contributors can make Pull Requests to fix issues and add features, which all go through the same review process. We’ll detail how you can start making PRs below.

We’ll do our best to keep `master` in a non-breaking state, ideally with tests always passing. The unfortunate reality of software development is sometimes things break. As such, `master` cannot be expected to remain reliable at all times. We recommend using the latest stable version of Iodide.

Iodide follows semantic versioning (http://semver.org/) - major versions for breaking changes (x.0.0), minor versions for new features (0.x.0), and patches for bug fixes (0.0.x).

We keep a file, [CHANGELOG.md](CHANGELOG.md), outlining changes to Iodide in each release. We like to think of the audience for changelogs as non-developers who primarily run the latest stable. So the change log will primarily outline user-visible changes such as new features and deprecations, and will exclude things that might otherwise be inconsequential to the end user experience, such as infrastructure or refactoring.

## Bugs & Issues

We use [Github Issues](https://github.com/iodide-project/iodide/issues) for announcing and discussing bugs and features. Use [this link](https://github.com/iodide-project/iodide/issues/new) to report an bug or issue. We provide a template to give you a guide for how to file optimally. If you have the chance, please search the existing issues before reporting a bug. It's possible that someone else has already reported your error. This doesn't always work, and sometimes it's hard to know what to search for, so consider this extra credit. We won't mind if you accidentally file a duplicate report.

Core contributors are monitoring new issues & comments all the time, and will label & organize issues to align with development priorities.

## How to Contribute

Pull requests are the primary mechanism we use to change Iodide. GitHub itself has some [great documentation](https://help.github.com/articles/about-pull-requests/) on using the Pull Request feature. We use the "fork and pull" model [described here](https://help.github.com/articles/about-pull-requests/), where contributors push changes to their personal fork and create pull requests to bring those changes into the source repository.

Please make pull requests against the `master` branch.

If you’re looking for a way to jump in and contribute, our list of [`good first issues`](https://github.com/iodide-project/iodide/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) is a great place to start.

Regarding any UI changes, we are roughly following Google's [Material Design Guidelines](https://material.io/guidelines/), which has been made substantially easier to follow by using the [React Material UI library](https://github.com/mui-org/material-ui). If you are making a UI change, we'd advise to follow the guidelines and use the same library we're using.

If you’d like to fix a currently-filed issue, please take a look at the comment thread on the issue to ensure no one is already working on it. If no one has claimed the issue, make a comment stating you’d like to tackle it in a PR. If someone has claimed the issue but has not worked on it in a few weeks, make a comment asking if you can take over, and we’ll figure it out from there.

### Testing

We use [Jest](https://facebook.github.io/jest/) as our testing framework. Every PR will automatically run through our tests, and our test framework will alert you on Github if your PR doesn’t pass all of them. If your PR fails a test, try to figure out whether or not you can update your code to make the test pass again, or ask for help. As a policy we will not accept a PR that fails any of our tests, and will likely ask you to add tests if your PR adds new functionality. Writing tests can be scary, but they make open-source contributions easier for everyone to assess. Take a moment and look through how we’ve written our tests, and try to make your tests match. If you are having trouble, we can help you get started on your test-writing journey.

We've found the following articles to be particularly useful, and we suggest reading them:

- [The right way to test React components](https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22)
- [Frontend React snapshot testing with Jest](https://hackernoon.com/front-end-react-snapshot-testing-with-jest-what-is-it-for-7788f7bd5a2e)
- [Testing declarative code](http://muness.blogspot.com/2008/04/testing-declarative-code.html)
- [Unit-testing Redux connection components](https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c)

Some guidelines that we tend to follow:
- we don't use snapshots for testing
- we don't always test purely declarative code
- we use the connected/unconnected pattern for testing components that connect to the redux store

### Linting

We also rely on linting as a way of standardizing low-level style choices in the code. We use [Airbnb's Javascript Style Guide](https://github.com/airbnb/javascript) along with their [React Guide](https://github.com/airbnb/javascript/tree/master/react). The use of a linter in your development worflow means you can focus on the higher-level aspects of style. As such we will likely not accept any PRs that fail linting. If this feels like a hassle, we'd recommend roughly following the Development Workflow below so you don't have to sweat this detail!

## Contribution Prerequisites

- You should have [Node](https://nodejs.org/) installed at v8.0.0+ and [npm](https://www.npmjs.com/).
- You should have some familiarity with React, Redux, modern ECMAScript, or be willing to learn.
- You should have some familiarity with how Git works, or be willing ot learn.

## Development Workflow

`npm run lint` will lint everything in `src/`. Please make sure all your contributions pass the linter.

`npm run start` writes development versions of the Iodide app resources to `dev/`. To run your dev notebook, just open the file `dev/iodide.dev.html` in your browser. All changes to the code will be detected and bundled into `dev/`.

In dev mode, resource paths are set to be relative to the `dev/` directory. Thus, when you export a notebook from a dev notebook, you need to be sure to save the exported HTML file in the `dev/` folder for the relative paths to correctly resolve the required js/css/font files.

`npm run build`  will write deployable versions of the Iodide app resources to `prod/`. This builds just once, and does not watch your files for changes.

The files built in prod mode have resource paths set to fixed web addresses, not relative paths (this is a required for exported notebooks to be portable). This means that if you open the file `prod/iodide.${VERSION}.html` in your browser, it will not load the js/css/font resources located in `prod/`, it will load them from the hard-coded web address (if they exist at that location). Once the js/css/fonts are uploaded to the matching URI, the file `prod/iodide.${VERSION}.html` (as well as any notebook exported from it) should run correctly from any local filesystem location or web address.

`npm test` runs the test suite. If you are hoping to submit a PR for your changes, it is vital that the test suite passes.

### Landing a PR!

We're excited to have you land your first PR! Some key guidelines for having a PR accepted:
1. Your PR should only contain commits pertaining to the change
2. New code must have tests
3. All new and existing tests must pass, the linter must pass, and CI must pass



## Style Guide

To reiterate, if you follow our Development Workflow, linting will take care of low-level style and formatting issues.

On a middle level, the best approach to ensuring your contributions are in the right style is to follow the example of any of the other components in the repository.

On a very high level, our goal is to make the source code for Iodide simple as possible for users who are new to JS. To quote the famous [PEP-20 -- The Zen of Python](https://www.python.org/dev/peps/pep-0020/):

```
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
...
```

## Code of Conduct

Contributors to Iodide are expected to follow the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/)

## License

All contributions to Iodide will be licensed under the [Mozilla Public License 2.0 (MPL 2.0)](https://www.mozilla.org/en-US/MPL/2.0/). This is considered a "weak copyleft" license. Any code pulled to the tree must be compatible with the MPL 2.0. Please read Mozilla's [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) if you need further clarification on what is and isn't permitted.


## Get in Touch

- __Gitter:__ [#iodide](https://gitter.im/iodide-project/iodide) channel over at gitter.im
