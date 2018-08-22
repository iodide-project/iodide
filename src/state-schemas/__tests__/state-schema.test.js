import {
  mirroredStateProperties,
  editorOnlyStateProperties,
  evalFrameOnlyStateProperties,
  mirroredCellProperties,
  editorOnlyCellProperties,
  evalFrameOnlyCellProperties,
} from '../mirrored-state-schema'

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
      .toEqual(['cells', 'viewMode'])
  })

  it('mirroredStateProperties, evalFrameOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(mirroredStateProperties, evalFrameOnlyStateProperties))
      .toEqual(['cells', 'viewMode'])
  })

  it('evalFrameOnlyStateProperties, editorOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(evalFrameOnlyStateProperties, editorOnlyStateProperties))
      .toEqual(['cells', 'viewMode'])
  })
})
