//import marked from 'marked'

function newBlankState(){
  var initialState =  {
    title: undefined,
    cells: [],
    currentlySelected: undefined,
    declaredProperties:{},
    lastValue: undefined,
    lastSaved: undefined,
    mode: 'command',
    sidePaneMode: undefined,
    history:[],
    externalScripts:[],
    executionNumber: 1
  }
  initialState.cells.push(newCell(initialState, 'javascript'))
  initialState.cells[0].selected = true
  initialState.currentlySelected = Object.assign({}, initialState.cells[0])
  return initialState
}

function getId(loadedState) {
  var newID = loadedState.cells.reduce((maxId, cell) => {
    return Math.max(cell.id, maxId)
  }, -1) + 1
  return newID
}

function newCell(loadedState, cellType){
  return {
    content:'',
    id: getId(loadedState),
    cellType: cellType,
    value: undefined,
    rendered: false,
    selected: false,
    isExecuting: false,
    executionStatus: " "
  }
}

function validateState(state) {
  // check for cells
  // check
}

function scrollToCellIfNeeded(cellID) {
  var elem = document.getElementById('cell-'+cellID);
  var rect = elem.getBoundingClientRect();
  var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  var tallerThanWindow = (rect.bottom-rect.top)>windowHeight
  var cellPosition
  // verbose but readable
  if (rect.bottom <= 0){
      cellPosition = "ABOVE_VIEWPORT"
    } else if (rect.top>=windowHeight){
      cellPosition = "BELOW_VIEWPORT"
    } else if ((rect.top<=0)&&(0<=rect.bottom)){
      cellPosition = "BOTTOM_IN_VIEWPORT"
    } else if ((rect.top<=windowHeight)&&(windowHeight<=rect.bottom)){
      cellPosition = "TOP_IN_VIEWPORT"
    } else {
      cellPosition = "IN_VIEWPORT"
    };

  if ((cellPosition == "ABOVE_VIEWPORT")
    || (cellPosition == "BOTTOM_IN_VIEWPORT")
    || ((cellPosition == "BELOW_VIEWPORT") && (tallerThanWindow))
    || ((cellPosition == "TOP_IN_VIEWPORT") && (tallerThanWindow))
    ){ // in these cases, scroll the window such that the cell top is at the window top
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else if ( ((cellPosition == "BELOW_VIEWPORT") && !(tallerThanWindow))
    || ((cellPosition == "TOP_IN_VIEWPORT") && !(tallerThanWindow))
    ){ //in these cases, scroll the window such that the cell bottom is at the window bottom
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }
}





let reducer = function (state, action) {
  switch (action.type) {

    case 'CHANGE_SIDE_PANE_MODE':
      return Object.assign({}, state, {sidePaneMode: action.mode})

    default:
      return state
  }
}

export {reducer, newBlankState}