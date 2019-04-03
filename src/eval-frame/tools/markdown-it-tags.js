// Modified MarkdownItExternalLink
// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

function tagsPlugin(md, options) {
  const tagOptions = options || {};
  const tagTarget = tagOptions.tagTarget || "_self";

  // helper function
  const isTagLink = href => {
    if (href) {
      let domain = href.split("//")[1];
      if (domain) {
        domain = domain.split("/")[0].toLowerCase();
      }
      return domain === null && href.startsWith("#");
    }
    return null;
  };
  // main evaluation of the postmd-parsing
  function tagLinks(state) {
    function applyFilterToTokenHierarchy(token) {
      if (token.children) {
        token.children.map(applyFilterToTokenHierarchy);
      }

      const href = token.attrGet("href");
      const tagref = isTagLink(href);

      if (tagref) {
        token.attrSet("target", tagTarget);
      }
    }

    state.tokens.map(applyFilterToTokenHierarchy);
  }

  md.core.ruler.push("tag_links", tagLinks);
}

module.exports = tagsPlugin;
