import { deleteNotebook, saveNotebook } from '../actions/actions'

const AUTOSAVE = 'AUTOSAVE: '

export default function autosaveStart(store) {
  // start doing autosaves
  setInterval(() => {
    // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
    const notebooks = Object.keys(localStorage)
    const autos = notebooks.filter(n => n.includes(AUTOSAVE))
    if (autos.length) {
      autos.forEach((n) => {
        store.dispatch(deleteNotebook(n))
      })
    }
    store.dispatch(saveNotebook(true))
  }, 1000 * 60)
}

