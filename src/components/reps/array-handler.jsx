import React from 'react'
import _ from 'lodash'
import { renderValue } from './value-renderer'

export const isTypedArray = arr => (
  typeof arr === 'object' &&
  arr.BYTES_PER_ELEMENT !== undefined &&
  Object.prototype.toString.call(arr.buffer) === '[object ArrayBuffer]')

export const typedArrayType = arr => Object.prototype.toString.call(arr).split(' ')[1].slice(0, -1)

const MAX_ELTS = 200
const HALF_MAX_ELTS = Math.round(MAX_ELTS / 2)

export default {
  shouldHandle: (value, inContainer) => !inContainer && (
    Array.isArray(value) ||
    isTypedArray(value)
  ),

  render: (value) => {
    const arrayType = isTypedArray(value) ? typedArrayType(value) : 'array'
    const dataSetInfo = `${value.length} element ${arrayType}`
    const len = value.length
    let arrayElements
    if (len > 0) {
      arrayElements = _.range(len > MAX_ELTS ? HALF_MAX_ELTS : len - 1).map(i => (
        <span key={`array_elt_${i}`} title={`array index: ${i}`}>
          {renderValue(value[i], true)}{', '}
        </span>
      ))
      if (len > MAX_ELTS) {
        arrayElements.push((
          <span key="array_elts_omitted" className="elements-omitted-info-rep">
            {` ... ${len - MAX_ELTS} elements omitted ...`}
          </span>))
        arrayElements = arrayElements
          .concat(_.range(len - HALF_MAX_ELTS, len - 1)
            .map(i => (
              <span key={`array_elt_${i}`} title={`array index: ${i}`}>
                {renderValue(value[i], true)}{', '}
              </span>
            )))
      }
      // final element has no trailing comma
      arrayElements.push((
        <span key={`array_elt_${len - 1}`} title={`array index: ${len - 1}`}>
          {renderValue(value[len - 1], true)}
        </span>
      ))
    } else {
      arrayElements = (
        <span key="array_elt_empty" title="empty array" />
      )
    }
    return (
      <div className="array-rep">
        <div className="data-set-info">{dataSetInfo}</div>
        <div>
            [{arrayElements}]
        </div>
      </div>
    )
  },
}
