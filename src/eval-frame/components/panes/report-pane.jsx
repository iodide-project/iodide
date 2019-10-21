import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MarkdownIt from "markdown-it";
import MarkdownItKatex from "@iktakahiro/markdown-it-katex";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItTag from "../../tools/markdown-it-tags";

const mdIt = MarkdownIt({ html: true });
mdIt
  .use(MarkdownItKatex)
  .use(MarkdownItAnchor)
  .use(MarkdownItEmoji)
  .use(MarkdownItTag);

const mdDiv = (key, html) => (
  <div
    key={key}
    className="user-markdown"
    dangerouslySetInnerHTML={{ __html: html }} // eslint-disable-line react/no-danger
  />
);

const styleTag = (key, css) => (
  <style
    key={key}
    dangerouslySetInnerHTML={{ __html: css }} // eslint-disable-line react/no-danger
  />
);

const otherCellTag = key => <div key={key} id={`side-effect-target-${key}`} />;

const paneStyle = {
  height: "100%",
  overflow: "auto"
};

export class ReportPaneUnconnected extends React.Component {
  static propTypes = {
    reportChunks: PropTypes.arrayOf(
      PropTypes.shape({
        chunkContent: PropTypes.string.isRequired,
        chunkType: PropTypes.string.isRequired,
        chunkId: PropTypes.string.isRequired
      })
    )
  };

  render() {
    const reportComponents = this.props.reportChunks.map(chunk => {
      const key = chunk.chunkId;
      switch (chunk.chunkType) {
        case "md":
        case "html":
          // FIXME: 'html' chunks are really markdown chunks --
          // we pass them thru the MD parser (for validation)
          // before putting in the report
          return mdDiv(key, mdIt.render(chunk.chunkContent));
        case "css":
          return styleTag(key, chunk.chunkContent);
        default:
          // in the case of code and other cell types,
          // just want an empty div; `contents` can remain undefined
          return otherCellTag(key);
      }
    });

    return <div style={paneStyle}>{reportComponents}</div>;
  }
}

function mapStateToProps(state) {
  return { reportChunks: state.reportChunks };
}

export default connect(mapStateToProps)(ReportPaneUnconnected);
