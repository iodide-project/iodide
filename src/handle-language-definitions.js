import { addChangeLanguageTask } from './actions/task-definitions'

export default function handleLanguageDefinitions(store) {
  const state = store.getState();
  const { languageDefinitions } = state;
  for (const language of Object.values(languageDefinitions)) {
    addChangeLanguageTask(language.languageId, language.displayName, language.keybinding);
  }
}
