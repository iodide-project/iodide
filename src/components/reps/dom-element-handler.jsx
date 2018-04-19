import React from 'react'
// taken from https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
function isNode(o) {
  return (
    typeof Node === 'object' ? o instanceof Node :
      o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
  );
}

function isElement(o) {
  return (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
      o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  );
}

export default {
  shouldHandle: value => isNode(value) || isElement(value),
  render: value => <div className='raw-dom-element' dangerouslySetInnerHTML={{ __html: value.outerHTML }} />, // eslint-disable-line
}
