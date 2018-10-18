import { getNotebookInfoFromDocument } from './tools/server-tools'
import { updateNotebookInfo } from './actions/actions'

export default function handleServerVariables(store) {
  const nbObj = getNotebookInfoFromDocument()
  if (Object.keys(nbObj).length > 0) {
    store.dispatch(updateNotebookInfo(nbObj.notebookInfo))
  }
}
