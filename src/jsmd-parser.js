const jsmdValidCellTypes = ['meta', 'md', 'js', 'raw', 'dom', 'resource']

const jsmdValidCellSettings = [
  'collapseEditViewInput',
  'collapseEditViewOutput',
  'collapsePresentationViewInput',
  'collapsePresentationViewOutput'
]

function parseJsmd(jsmd){
  const parseWarnings = []
  let cells = jsmd
    .split('\n%%')
    .map( (str,cellNum) => {
      //if this is the first cell, and it starts with "%%", drop those chars
      if (cellNum===0 && str.substring(0,2)=='%%'){
        str = str.substring(2)
      }
      return str
    })
    .filter(str=>str!=='')
    .map( str => {
      let firstLineBreak = str.indexOf('\n')
      let firstLine = str.substring(0,firstLineBreak).trim()
      let firstLineFirstSpace = firstLine.indexOf(' ')
      let cellType, settings, content
      
      if (firstLineFirstSpace===-1){
        // if there is NO space on the first line (after trimming), there are no cell settings
        cellType = firstLine.toLowerCase()
      } else {
        // if there is a space on the first line (after trimming), there must be cell settings
        cellType = firstLine.substring(0,firstLineFirstSpace).toLowerCase()
        //make sure the cell settings parse as JSON
        try {
          settings = JSON.parse(firstLine.substring(firstLineFirstSpace+1))
        } catch(e) {
          parseWarnings.push(
            {parseError: 'failed to parse cell settings',
              details: firstLine,
              jsError: e
            }
          )
        }
      }
      //if settings exist and parsed ok, make sure that only valid cell settings are kept
      if (settings) {
        let settingsOut = {}
        for (const key in settings){
          if (jsmdValidCellSettings.indexOf(key)>-1){
            settingsOut[key] = settings[key]
          } else {
            parseWarnings.push(
              {parseError: 'invalid cell setting',
                details: key}
            )
          }
        } 
        settings = settingsOut ? settingsOut : undefined
      }
      // if the cell type is not valid, set it to js
      if (jsmdValidCellTypes.indexOf(cellType)===-1){
        parseWarnings.push(
          {parseError: 'invalid cell type, converted to js cell',
            details: cellType}
        )
        cellType = 'js'
      }

      content = str.substring(firstLineBreak+1).trim()
      if (cellType ==='meta'){
        try {
          content = JSON.parse(content)
        } catch (e) {
          parseWarnings.push(
            {parseError: 'Failed to parse notebook settings from meta cell. Using default settings.',
              details: firstLine,
              jsError: e
            }
          )
        }
      }
      return { cellType: cellType,
        settings: settings,
        content: content
      }
    })

  return {cells, parseWarnings}
}

export {
  parseJsmd,
  jsmdValidCellTypes,
  jsmdValidCellSettings
}