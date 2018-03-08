import { isCommandMode } from './notebook-utils'
import { addTask, dispatcher } from './task-definitions'

const languages = []
const langByName = {}

function addLanguage(language) {
  languages.push(language)
  langByName[language.name] = language

  // Create a task to change a cell to a given language
  const task = addTask(`changeTo${language.name}Cell`, {
    title: language.displayName,
    keybindings: [language.keybinding],
    displayKeybinding: [language.keybinding.toUpperCase()],
    keybindingPrecondition: isCommandMode,
    callback() {
      dispatcher.changeCellType('code', language.name)
    },
  })

  language.task = task // eslint-disable-line
}

function getLanguageByName(name) {
  return langByName[name];
}

function getLanguages() {
  return languages;
}

// Javascript, the 'built-in' language™

addLanguage({
  name: 'js',
  displayName: 'Javascript',
  codeMirrorName: 'javascript',
  evaluate: code => window.eval(code),  // eslint-disable-line
  keybinding: 'j',
})

export {
  getLanguageByName,
  getLanguages,
  addLanguage,
}
