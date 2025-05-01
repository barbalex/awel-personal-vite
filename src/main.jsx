import React from 'react'
import { createRoot } from 'react-dom/client'
import { getEnv } from 'mobx-state-tree'

import App from './components/App.jsx'
import './styles.css'
import createStore from './store/index.js'
import watchMutations from './src/watchMutations.js'

import fetchUsers from './src/fetchUsers.js'
import fetchPersonen from './src/fetchPersonen.js'
import fetchAemter from './src/fetchAemter.js'
import fetchAbteilungen from './src/fetchAbteilungen.js'
import fetchBereiche from './src/fetchBereiche.js'
import fetchSektionen from './src/fetchSektionen.js'
import fetchEtiketten from './src/fetchEtiketten.js'
import fetchAnwesenheitstage from './src/fetchAnwesenheitstage.js'
import fetchLinks from './src/fetchLinks.js'
import fetchSchluessel from './src/fetchSchluessel.js'
import fetchMobileAbos from './src/fetchMobileAbos.js'
import fetchTelefones from './src/fetchTelefones.js'
import fetchFunktionen from './src/fetchFunktionen.js'
import fetchKaderFunktionen from './src/fetchKaderFunktionen.js'
import fetchWerte from './src/fetchWerte.js'
import fetchSettings from './src/fetchSettings.js'

import { StoreContextProvider } from './storeContext.js'

const container = document.getElementById('root')
const root = createRoot(container)

const run = async () => {
  // upgrade from 5.4.2 to 6.0.0:
  // Failed to find the environment of UndoManager@/history
  // manually set the targetStore to the store instead
  // https://github.com/coolsoftwaretyler/mst-middlewares/issues/22#issuecomment-2800127997
  const store = createStore().create(
    {},
    {
      history: { targetStore: {} },
    },
  )
  // Now set the circular reference after the store is created
  const storeEnv = getEnv(store)
  storeEnv.history.targetStore = store
  const { setUserName, setUserIsAdmin, setUserPwd } = store

  const user = await window.electronAPI.getUser()
  // console.log('main, user:', user)
  const userName = user?.userName
  const isAdmin = user?.isAdmin ?? false
  const pwd = user?.pwd

  setUserName(userName ?? '(Benutzer nicht erkannt)')
  setUserIsAdmin(isAdmin)
  setUserPwd(pwd)

  window.store = store

  fetchPersonen({ store })
  fetchAemter({ store })
  fetchAbteilungen({ store })
  fetchBereiche({ store })
  fetchSektionen({ store })
  fetchWerte({ store, table: 'statusWerte' })
  fetchWerte({ store, table: 'anredeWerte' })
  fetchWerte({ store, table: 'funktionWerte' })
  fetchWerte({ store, table: 'kaderFunktionWerte' })
  fetchEtiketten({ store })
  fetchAnwesenheitstage({ store })
  fetchWerte({ store, table: 'etikettWerte' })
  fetchWerte({ store, table: 'anwesenheitstagWerte' })
  fetchWerte({ store, table: 'landWerte' })
  fetchWerte({ store, table: 'mutationArtWerte' })
  fetchWerte({ store, table: 'standortWerte' })
  fetchLinks({ store })
  fetchSchluessel({ store })
  fetchMobileAbos({ store })
  fetchTelefones({ store })
  fetchWerte({ store, table: 'mobileAboKostenstelleWerte' })
  fetchWerte({ store, table: 'mobileAboTypWerte' })
  fetchWerte({ store, table: 'telefonTypWerte' })
  fetchWerte({ store, table: 'schluesselTypWerte' })
  fetchWerte({ store, table: 'schluesselAnlageWerte' })
  fetchFunktionen({ store })
  fetchKaderFunktionen({ store })
  fetchSettings({ store })
  fetchUsers({ store })

  watchMutations({ store })

  root.render(
    <StoreContextProvider value={store}>
      <App />
    </StoreContextProvider>,
  )
}

// setTimeout(run, 1000)
run()
