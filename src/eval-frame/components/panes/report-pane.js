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

const mdDiv = html => (
  <div
    className="user-markdown"
    dangerouslySetInnerHTML={{ __html: html }} // eslint-disable-line react/no-danger
  />
);

const styleTag = css => (
  <style
    dangerouslySetInnerHTML={{ __html: css }} // eslint-disable-line react/no-danger
  />
);

export class ReportPaneUnconnected extends React.Component {
  static propTypes = {
    reportChunks: PropTypes.arrayOf(
      PropTypes.shape({
        chunkContent: PropTypes.string.isRequired,
        chunkType: PropTypes.string.isRequired,
        chunkId: PropTypes.string.isRequired,
        evalFlags: PropTypes.arrayOf(PropTypes.string)
      })
    )
  };

  render() {
    const mdComponents = this.props.reportChunks.map(chunk => {
      const key = chunk.chunkId;
      let contents;
      let htmlId;
      switch (chunk.chunkType) {
        case "md":
        case "html":
          // FIXME: 'html' chunks are really markdown chunks --
          // we pass them thru the MD parser (for validation)
          // before putting in the report
          contents = mdDiv(mdIt.render(chunk.chunkContent));
          break;
        case "css":
          contents = styleTag(chunk.chunkContent);
          break;
        default:
          // in the case of code and other cell types,
          // just want an empty div; `contents` can remain undefined
          htmlId = `side-effect-target-${key}`;
          break;
      }
      return (
        <div key={key} id={htmlId}>
          {contents}
        </div>
      );
    });

    return <div className="pane-content">{mdComponents}</div>;
  }
}

function mapStateToProps(state) {
  return { reportChunks: state.reportChunks };
}

export default connect(mapStateToProps)(ReportPaneUnconnected);
