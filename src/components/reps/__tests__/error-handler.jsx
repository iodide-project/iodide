import { ValueRenderer } from '../value-renderer' // eslint-disable-line
import { shouldHandle, trimStack } from '../error-handler'
import { runCodeWithLanguage } from '../../../eval-frame/actions/language-actions'

describe('errorHandler shouldHandle', () => {
  it('handles the correct type', () => {
    expect(shouldHandle(undefined)).toBe(false)
    expect(shouldHandle(new Error())).toBe(true)
  })
  it('trims stack frames', () => {
    const code = 'throw new Error("FOO")'
    const language = {
      module: 'window',
      evaluator: 'eval',
    }
    let err;
    try {
      runCodeWithLanguage(language, code)
    } catch (e) {
      err = e
    }
    expect(trimStack(err).split('\n').length).toBe(2)
  })
})
