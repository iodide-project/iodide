# How to Contribute

Thank you for your interest in contributing to Iodide! There are many ways to contribute, and we appreciate all of them. Here are some guidelines & pointers for diving into it.

## Development

Work on Iodide happens on Github. Core members and contributors can make Pull Requests to fix issues and add features, which all go through the same review process. We’ll detail how you can start making PRs below.

We do our best to keep `master` in a non-breaking state, with tests always passing. The unfortunate reality of software development is sometimes things break. As such, `master` cannot be expected to remain reliable at all times. If you require stability, we recommend using a [released version](https://github.com/iodide-project/iodide/releases) of Iodide.

We keep a file, [CHANGELOG.md](https://github.com/iodide-project/iodide/blob/master/CHANGELOG.md), outlining changes to Iodide in each release. We like to think of the audience for changelogs as non-developers who primarily run the latest stable. So the change log will primarily outline user-visible changes such as new features and deprecations, and will exclude things that might otherwise be inconsequential to the end user experience, such as infrastructure or refactoring.

### Setting up a development environment

[Detailed instruction available here.](local-dev.md)

## Bugs & Issues

We use [Github Issues](https://github.com/iodide-project/iodide/issues) for announcing and discussing bugs and features. Use [this link](https://github.com/iodide-project/iodide/issues/new) to report an bug or issue. We provide a template to give you a guide for how to file optimally. If you have the chance, please search the existing issues before reporting a bug. It's possible that someone else has already reported your error. This doesn't always work, and sometimes it's hard to know what to search for, so consider this extra credit. We won't mind if you accidentally file a duplicate report.

Core contributors are monitoring new issues & comments all the time, and will label & organize issues to align with development priorities.

## How to Contribute

Pull requests are the primary mechanism we use to change Iodide. GitHub itself has some [great documentation](https://help.github.com/articles/about-pull-requests/) on using the Pull Request feature. We use the "fork and pull" model [described here](https://help.github.com/articles/about-pull-requests/), where contributors push changes to their personal fork and create pull requests to bring those changes into the source repository.

Please make pull requests against the `master` branch. Even for relatively small changes, we recommend creating a branch on your end to develop and test changes: this will make it easier to rebase your changes when needed.

If you’re looking for a way to jump in and contribute, our list of [`good first issues`](https://github.com/iodide-project/iodide/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) is a great place to start.

Regarding any UI changes, we are roughly following Google's [Material Design Guidelines](https://material.io/guidelines/), which has been made substantially easier to follow by using the [React Material UI library](https://github.com/mui-org/material-ui). If you are making a UI change, we'd advise to follow the guidelines and use the same library we're using.

If you’d like to fix a currently-filed issue, please take a look at the comment thread on the issue to ensure no one is already working on it. If no one has claimed the issue, make a comment stating you’d like to tackle it in a PR. If someone has claimed the issue but has not worked on it in a few weeks, make a comment asking if you can take over, and we’ll figure it out from there.

### Tips for writing and testing React+Redux components

- Put as much logic as possible in your component's mapStateToProps; ideally, we want purely declarative components with _zero logic_.
    - You only need to test the non-declarative logic within your component -- the declarative stuff actually serves as the _spec_ for the layout you are creating, and it doesn't need to be tested.
- Pass in all action creators via mapDispatchToProps.
    - This makes it easy to test action creators by passing in jest mock functions as props.
- Add proptypes for everything, including the passed-in action creators

For more clarification on these ideas, read the articles linked under "Testing" below.

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

We rely on linting as a way of standardizing low-level style choices in the code. For the front-end, we use [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript) along with their [React Guide](https://github.com/airbnb/javascript/tree/master/react), as well as [Prettier](https://pretter.io). On the back-end, we use [Black](https://black.readthedocs.io/en/stable/) and [isort](https://github.com/timothycrosley/isort). It is recommended to configure your editor to use the above linting tools.

The use of a linter in your development worflow means you can focus on the higher-level aspects of style. As such we will likely not accept any PRs that fail linting. If this feels like a hassle, we'd recommend roughly following the Development Workflow below so you don't have to sweat this detail!

### Landing a PR!

We're excited to have you land your first PR! Some key guidelines for having a PR accepted:

1. Your PR should only contain commits pertaining to the change.
2. New code must have tests.
3. All new and existing tests must pass, the linter must pass, and CI must pass.
4. Commit messages should be descriptive and informative, as should the PR title. Please do not just write something like "Fix issue #123456" as this makes it impossible to skim the changelog on its own. See [this Tim Pope's blog post](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) on this subject.

It is ok to post an incomplete work-in-progress PR to ask for help or initial feedback, but please only ask for review when the above criteria are met.

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

For real-time collaboration, we have a channel on
[Gitter](https://gitter.im/iodide-project/iodide). As of this writing, the
code Iodide team is mostly available during EST/PST. For longer or
asynchronous discussions, we also have a [Google
group](https://groups.google.com/forum/#!forum/iodide-dev).

Every week on Tuesday at 9am PST, we have a project meeting on Zoom, which
anyone is welcome to join. If you have Zoom installed, you should be able to join
via this URL: [https://mozilla.zoom.us/j/368434069](https://mozilla.zoom.us/j/368434069).
