import _ from 'lodash'

let nb = {}

nb.all = function(arr){
  for (let i=0; i<arr.length; i++) {
    if (!arr[i]){return false}
  }
  return true
}
nb.any = function(arr){
  for (let i=0; i<arr.length; i++) {
    if (arr[i]){return true}
  }
  return false
}

// nb.isValuesArray = function(obj){
//   if (nb.isArray(obj)){
//     return nb.all(obj.map(x => typ))
//   } else {return false}
// }

nb.isMatrixLike = function(obj){
  if (nb.isArray(obj)){
    return nb.all(obj.map(nb.isArray))
  } else {return false}
}

nb.arrayEqual = function(a1,a2){
  if (a1.length != a2.length){return false}
  for (let i=0, l=a1.length; i<l; i++){
    if (a1[i]!=a2[i]){return false}
  }
  return true
}

nb.sameKeys = function(x,y){
  return nb.arrayEqual(_.sortBy(_.keys(x)), _.sortBy(_.keys(y)))
}

nb.isRowDf = function(obj,rowsToCheck = 100){
  if (!_.isArray(obj) || obj.length==0 || (obj.length === 1 && !_.isPlainObject(obj[0]))) {return false}
  rowsToCheck = Math.min(rowsToCheck,_.size(obj))
  for (let i=1; i<rowsToCheck; i++){
    if (! _.isPlainObject(obj[i])) {return false}
    if (!nb.sameKeys(obj[0],obj[i])) {return false}
  }
  return true
}

nb.isMatrix = function(obj,rowsToCheck = 100){
  if (!_.isArray(obj) || obj.length==0) {return false}
  rowsToCheck = Math.min(rowsToCheck,_.size(obj))
  for (let i=0; i<rowsToCheck; i++){
    if (! _.isArray(obj[i]) || obj.length==0) {return false}
    if (! obj[0].length===obj[i].length) {return false}
  }
  return true
}


nb.isColumnDf = function(obj,colsToCheck = 100){
  if (!_.isPlainObject(obj)) {return false}
  colsToCheck = Math.min(colsToCheck,_.size(obj))
  let cols = Object.keys(obj)
  let numRows = obj[cols[0]].length
  for (let i=1; i<colsToCheck; i++){
    if (obj[cols[i]].length != numRows)
      return false
  }
  return true
}


nb.nanComparison = function(a,b){
  if (!isNaN(a-b)) {return a<b ? -1 : 1} //use numeric sort
  else {return isNaN(a) ? 1:-1}  // if a is nan, sort it *after* b
}
  
nb.rank = function(arr) {
  let rank = 1
  let rankMapping = {}
  arr.slice()
    .sort(nb.nanComparison) // sort arr pairs (pushing NaNs to end)
    .forEach( (x,i) => { //build up the rankMapping
      if (i===0){ rankMapping[x]=rank }
      if (i>0){
        if (x>arr[i-1]){rank++}
        rankMapping[x]=rank
      }  
    })
  return arr.map(item => isNaN(item) ? NaN : rankMapping[item] )
}

nb.toColumns = function(rowDF){
  let cols = _.keys(rowDF[0])
  let columnar = {}
  for (let col of cols){
    let colData = rowDF.map(row => row[col])
    columnar[col] = colData
  }
  return columnar
}

nb.toRows = function(colDf){
  let cols = Object.keys(colDf)
  return colDf[cols[0]].map
}

nb.shape = function(obj){
  // rows by cols
  if (nb.isColumnDf(obj)){
    let cols = _.keys(obj)
    return [obj[cols[0]].length, cols.length]
  } else if (nb.isRowDf(obj)){
    return ([_.size(obj), _.size(obj[0])])
  } else if (nb.isMatrix(obj)){
    return [obj.length, obj[0].length]
  } else {
    return [undefined,undefined]
  } 
}

nb.dropRowsWithNaN = function(col1,col2){
  return _.unzip( _.zip(col1,col2).filter(xy => !(_.isNaN(xy[0]) || _.isNaN(xy[1]))) )
}

nb.prettyFormatNumber = function(x,numChars=8){
  numChars = numChars<=4 ? 4 : numChars
  if(!_.isNumber(x)){return x}
  let str = x.toString()
  if (str.length<=numChars) {return str}
  let [intStr,decStr] = str.split('.')
  if (intStr.length >= numChars){
    return x.toExponential(numChars-4)
  } else if (intStr=='0' && decStr.length >= numChars-2){
    return x.toFixed(numChars-2)
  } else if (intStr=='-0' && decStr.length >= numChars-3){
    return x.toFixed(numChars-2)
    
  } else {
    return x.toFixed(numChars-intStr.length-2)
  }
}

nb.cartesianProduct = function(a1,a2){
  let out = []
  for (let x of a1){
    for (let y of a2){
      out.push([x,y])
    }
  }
  return out
}

export default nb