import { getNotebookInfoFromDocument } from './tools/server-tools'
import { updateNotebookInfo, changePageTitle } from './actions/actions'

export default function handleServerVariables(store) {
  const nbObj = getNotebookInfoFromDocument()
  if (Object.keys(nbObj).length > 0) {
    store.dispatch(updateNotebookInfo(nbObj.notebookInfo))
    if (nbObj.notebookInfo.title) {
      store.dispatch(changePageTitle(nbObj.notebookInfo.title))
    }
  }
}
