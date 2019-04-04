// Modified MarkdownItExternalLink
// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

function tagsPlugin(md, options) {
  const tagOptions = options || {};
  const tagTarget = tagOptions.tagTarget || "_self";

  // helper function
  const isTagLink = href => href && href.startsWith("#");

  // main evaluation of the postmd-parsing
  function tagLinks(state) {
    function applyFilterToTokenHierarchy(token) {
      if (token.children) {
        token.children.map(applyFilterToTokenHierarchy);
      }
      if (isTagLink(token.attrGet("href"))) {
        token.attrSet("target", tagTarget);
      }
    }
    state.tokens.map(applyFilterToTokenHierarchy);
  }
  md.core.ruler.push("tag_links", tagLinks);
}

module.exports = tagsPlugin;
