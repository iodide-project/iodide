import {
  mirroredStateProperties,
} from '../mirrored-state-schema'
import {
  editorOnlyStateProperties,
} from '../editor-only-state-schemas'
import {
  evalFrameOnlyStateProperties,
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


describe('state schemas should all have disjoint properties except for "viewMode', () => {
  it.skip('mirroredStateProperties, editorOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(mirroredStateProperties, editorOnlyStateProperties))
      .toEqual(['viewMode'])
  })

  it.skip('mirroredStateProperties, evalFrameOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(mirroredStateProperties, evalFrameOnlyStateProperties))
      .toEqual(['viewMode'])
  })

  it.skip('evalFrameOnlyStateProperties, editorOnlyStateProperties have correct intersection', () => {
    expect(getPropertyIntersection(evalFrameOnlyStateProperties, editorOnlyStateProperties))
      .toEqual(['viewMode'])
  })
})
