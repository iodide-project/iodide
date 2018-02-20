import NotebookTask, { TASK_ERRORS } from '../src/notebook-task.js'


describe('Improperly instantiating a class should throw an Error', () => {
  it('should throw an error if you have not provided any arguments', () => {
    expect(() => new NotebookTask()).toThrowError(TASK_ERRORS.argumentMustBeObject)
  })

  it('should throw an error if you have provided something other than an object', () => {
    expect(() => new NotebookTask([1, 2, 3, 4, 5])).toThrowError(TASK_ERRORS.argumentMustBeObject)
  })

  it('should throw an error if you have provided a keybindingCallback but no keybindings', () => {
    expect(() => new NotebookTask({ keybindingCallback: () => {} }))
      .toThrowError(TASK_ERRORS.noKeybindingsWithCallback)
  })
})

describe('title element is required, and alternate title getters default to title', () => {
  it('should throw an error if you do not have a title', () => {
    expect(() => new NotebookTask({ callback: () => {} })).toThrowError(TASK_ERRORS.noTitleSupplied)
  })

  const nbName = 'test task'
  const nbMenuTitle = 'TEST'
  const nb1 = new NotebookTask({ title: nbName, menuTitle: nbMenuTitle, callback: () => {} })
  const nb2 = new NotebookTask({ title: nbName, callback: () => {} })
  it('should have the getter return the title element', () => {
    expect(nb1.title).toBe(nbName)
  })
  it('should allow menuLabel to be menuTitle, if present', () => {
    expect(nb1.menuTitle).toBe(nbMenuTitle)
  })
  it('should default to default title if menuTitle was not declared', () => {
    expect(nb2.menuTitle).toBe(nb2.title)
  })
})

describe('callbacks are functions', () => {
  it('should throw an error if there is no callback of any kind supplied', () => {
    expect(() => new NotebookTask({ title: 'welp' })).toThrowError(TASK_ERRORS.noCallback)
  })
  it('should throw an error if the callback is not a function', () => {
    expect(() => new NotebookTask({ title: 'welp', callback: 'uh-oh!' })).toThrowError(TASK_ERRORS.callbackIsNotFunction)
  })
})

describe('keybindings and keybinding callbacks', () => {
  it('should throw an error if you have provided a keybindingCallback but no keybindings', () => {
    expect(() => new NotebookTask({ keybindingCallback: () => {} }))
      .toThrowError(TASK_ERRORS.noKeybindingsWithCallback)
  })
  const nb1 = new NotebookTask({ title: 'ok1', keybindings: ['meta+s'], callback: () => {} })
  it('should output an array for the keybinding', () => {
    expect(nb1.keybindings).toBeInstanceOf(Array)
  })
})
