import {
  newNotebook,
} from '../editor-state-prototypes'

import evalFrameStateSelector from '../state-schemas/eval-frame-state-selector'

export function newEvalFrameState() {
  return evalFrameStateSelector(newNotebook())
}
