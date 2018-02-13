import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'

export default class ExternalResourceOutputHandler extends React.Component {
  render() {
    const outs = this.props.value.filter(d => d.src !== '').map((d, i) => {
      let statusExplanation
      let statusIcon
      let source = d.src.split('/')
      source = source[source.length - 1]

      const introducedVariables = (d.variables || []).map((v, j) =>
        (
          <div
            key={j}
            style={{
                  fontSize: '12px',
                  borderRadius: '12px',
                  padding: '3px 8px 3px 8px',
                  marginRight: '6px',
                  backgroundColor: 'lightgray',
                  }}
          >{v}
          </div>
        ))

      if (d.status === undefined) {
        statusIcon = <UnloadedCircle />
      } else {
        statusIcon = (d.status === 'loaded'
          ? <CheckCircle color="lightblue" />
          : <ErrorCircle color="firebrick" />
        )
      }
      if (Object.prototype.hasOwnProperty.call(d, 'statusExplanation')) {
        // TODO: Don't use an array index as a key here (See react/no-array-index-key linter)
              statusExplanation = <div key={i} className="dependency-status-explanation">{d.statusExplanation}</div>  // eslint-disable-line
      }
      return (
      // TODO: Don't use an array index as a key here (See react/no-array-index-key linter)
      /* eslint-disable */
                <div className="dependency-container" key={`erc-${this.props.cellId}-${i}`}>
                  <div className="dependency-row">
                  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                      {statusIcon}
                  </MuiThemeProvider>
                  <div style={{display:'flex', flexWrap:'wrap', lineHeight: '1.5em'}}>
                    <div className="dependency-src"><a href={d.src} target='_blank'>{source}</a></div>
                    { introducedVariables }
                  </div>
                    
                  </div>
                  {statusExplanation}
                  
      
                </div>
              /* eslint-enable */
      )
    })
    return (
      <div className="dependency-output">
        {outs}
      </div>
    )
  }
}
