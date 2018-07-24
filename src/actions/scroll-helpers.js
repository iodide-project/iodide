const SCROLL_PADDING = 30 // extra px for scrolling
const SCROLLBY_BEHAVIOR = 'smooth' //'instant'

export function getTargetDistanceFromViewportTop(cellId, scrollIfNeeded = true) {
  const elem = document.getElementById(`cell-${cellId}`)
  const rect = elem.getBoundingClientRect()
  const scrollContainer = document.getElementById('cells')
  const viewportRect = scrollContainer.getBoundingClientRect()
  if (scrollIfNeeded === false) {
    // if a scroll is not needed, the target dist is just the
    // current distance to the top
    return rect.top - viewportRect.top
  }
  const viewportHeight = viewportRect.height
  const tallerThanWindow = (rect.bottom - rect.top) > viewportHeight
  let cellPosition
  // verbose but readable
  if (rect.bottom <= viewportRect.top) {
    cellPosition = 'ABOVE_VIEWPORT'
  } else if (rect.top >= viewportRect.bottom) {
    cellPosition = 'BELOW_VIEWPORT'
  } else if ((rect.top <= viewportRect.top) && (viewportRect.top <= rect.bottom)) {
    cellPosition = 'BOTTOM_IN_VIEWPORT'
  } else if ((rect.top <= viewportRect.bottom) && (viewportRect.bottom <= rect.bottom)) {
    cellPosition = 'TOP_IN_VIEWPORT'
  } else {
    cellPosition = 'IN_VIEWPORT'
  }

  let targetPxFromViewportTop
  if ((cellPosition === 'ABOVE_VIEWPORT')
    || (cellPosition === 'BOTTOM_IN_VIEWPORT')
    || ((cellPosition === 'BELOW_VIEWPORT') && (tallerThanWindow))
    || ((cellPosition === 'TOP_IN_VIEWPORT') && (tallerThanWindow))
  ) { // in these cases, scroll the window such that the cell top is at the window top
    targetPxFromViewportTop = SCROLL_PADDING
  } else if (((cellPosition === 'BELOW_VIEWPORT') && !(tallerThanWindow))
    || ((cellPosition === 'TOP_IN_VIEWPORT') && !(tallerThanWindow))
  ) { // in these cases, scroll the window such that the cell bottom is at the window bottom
    targetPxFromViewportTop = viewportHeight - rect.height - SCROLL_PADDING
  } else { // in this case, cellPosition === 'IN_VIEWPORT'; don't scroll
    targetPxFromViewportTop = rect.top - viewportRect.top
  }
  return targetPxFromViewportTop
}

export function alignCellTopTo(cellId, targetPxFromViewportTop) {
  // clamp to viewport top
  const pxFromViewportTop = targetPxFromViewportTop < 0 ? SCROLL_PADDING : targetPxFromViewportTop
  const elem = document.getElementById(`cell-${cellId}`)
  if (elem === null) return
  const rect = elem.getBoundingClientRect()
  const scrollContainer = document.getElementById('cells')
  const viewportRect = scrollContainer.getBoundingClientRect()
  const distanceAboveViewportTop = rect.top - viewportRect.top
  scrollContainer.scrollBy({
    top: distanceAboveViewportTop - pxFromViewportTop,
    left: 0,
    behavior: SCROLLBY_BEHAVIOR,
  })
}

export function handleCellAndOutputScrolling(cellId, scrollIfNeeded = true) {
  const targetPxFromViewportTop = getTargetDistanceFromViewportTop(cellId, scrollIfNeeded)
  if (scrollIfNeeded === true) {
    alignCellTopTo(cellId, targetPxFromViewportTop)
  }
  return targetPxFromViewportTop
}
