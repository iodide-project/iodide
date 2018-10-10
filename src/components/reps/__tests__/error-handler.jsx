import { ValueRenderer } from '../value-renderer' // eslint-disable-line
import errorHandler, { trimStack } from '../error-handler'
import { runCodeWithLanguage } from '../../../eval-frame/actions/language-actions'

describe('errorHandler shouldHandle', () => {
  it('handles the correct type', () => {
    expect(errorHandler.shouldHandle(undefined)).toBe(false)
    expect(errorHandler.shouldHandle(new Error())).toBe(true)
  })
  it('trims stack frames', () => {
    const code = 'throw new Error("FOO")'
    const language = {
      module: 'window',
      evaluator: 'eval',
    }
    let err;
    runCodeWithLanguage(language, code).then(
      () => undefined,
      (err) => {
        expect(trimStack(err).split('\n').length).toBe(2)
      })
  })
})
