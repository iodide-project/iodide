import { saveNotebookToServer } from './actions/actions'

export default function handleInitialSave(store) {
  store.dispatch(saveNotebookToServer())
}
