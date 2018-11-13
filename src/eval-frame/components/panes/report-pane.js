import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

const mdIt = MarkdownIt({ html: true })
mdIt.use(MarkdownItKatex).use(MarkdownItAnchor)

export class ReportPaneUnconnected extends React.Component {
  static propTypes = {
    reportChunks: PropTypes.arrayOf(PropTypes.shape({
      cellContent: PropTypes.string.isRequired,
      cellType: PropTypes.string.isRequired,
      evalFlags: PropTypes.arrayOf(PropTypes.string),
      startLine: PropTypes.number.isRequired,
      endLine: PropTypes.number.isRequired,
    })),
  }

  render() {
    const mdComponents = this.props.reportChunks.map((chunk) => {
      const key = `chunk_${chunk.startLine}-${chunk.endLine}`
      // FIXME: 'html' chunks are really markdown chunks --
      // we pass them thru the MD parser (for validation)
      // before putting in the report
      const html = mdIt.render(chunk.cellContent)
      return (<div
        key={key}
        className="user-markdown"
        dangerouslySetInnerHTML={{ __html: html }} // eslint-disable-line
      />)
    })

    return (
      <div className="pane-content" >
        { mdComponents }
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { reportChunks: state.reportChunks }
}

export default connect(mapStateToProps)(ReportPaneUnconnected)
