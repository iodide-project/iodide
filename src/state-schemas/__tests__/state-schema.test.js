import {
  mirroredStateProperties,
  mirroredCellProperties,
} from '../mirrored-state-schema'
import {
  editorOnlyStateProperties,
  editorOnlyCellProperties,
} from '../editor-only-state-schemas'
import {
  evalFrameOnlyStateProperties,
  evalFrameOnlyCellProperties,
} from '../eval-frame-only-state-schemas'


function getPropertyIntersection(obj1, obj2) {
  const propIntersection = []
  Object.keys(obj1).forEach((k1) => {
    if (k1 in obj2) {
      propIntersection.push(k1)
    }
  })
  return propIntersection
}


describe('cell schemas should all have disjoint properties', () => {
  it('mirroredCellProperties, editorOnlyCellProperties are disjoint', () => {
    expect(getPropertyIntersection(mirroredCellProperties, editorOnlyCellProperties))
      .toEqual([])
  })

  it('mirroredCellProperties, evalFrameOnlyCellProperties are disjoint', () => {
    expect(getPropertyIntersection(mirroredCellProperties, evalFrameOnlyCellProperties))
      .toEqual([])
  })

  it('evalFrameOnlyCellProperties, editorOnlyCellProperties are disjoint', () => {
    expect(getPropertyIntersection(evalFrameOnlyCellProperties, editorOnlyCellProperties))
      .toEqual([])
  })
})


describe('state schemas should all have disjoint properties except for "cells" and "viewMode', () => {
  it('mirroredStateProperties, editorOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(mirroredStateProperties, editorOnlyStateProperties))
      .toEqual(['cells', 'cellClipboard', 'viewMode'])
  })

  it('mirroredStateProperties, evalFrameOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(mirroredStateProperties, evalFrameOnlyStateProperties))
      .toEqual(['cells', 'cellClipboard', 'viewMode'])
  })

  it('evalFrameOnlyStateProperties, editorOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(evalFrameOnlyStateProperties, editorOnlyStateProperties))
      .toEqual(['cells', 'cellClipboard', 'viewMode'])
  })
})
