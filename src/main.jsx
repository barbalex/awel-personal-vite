import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App'
import './styles.css'
import createStore from './store'
import watchMutations from './src/watchMutations'

import fetchUsers from './src/fetchUsers'
import fetchPersonen from './src/fetchPersonen.js'
import fetchAemter from './src/fetchAemter.js'
import fetchAbteilungen from './src/fetchAbteilungen.js'
import fetchBereiche from './src/fetchBereiche.js'
import fetchSektionen from './src/fetchSektionen'
import fetchEtiketten from './src/fetchEtiketten'
import fetchAnwesenheitstage from './src/fetchAnwesenheitstage'
import fetchLinks from './src/fetchLinks'
import fetchSchluessel from './src/fetchSchluessel'
import fetchMobileAbos from './src/fetchMobileAbos'
import fetchTelefones from './src/fetchTelefones'
import fetchFunktionen from './src/fetchFunktionen'
import fetchKaderFunktionen from './src/fetchKaderFunktionen'
import fetchWerte from './src/fetchWerte.js'
import fetchSettings from './src/fetchSettings'

import { StoreContextProvider } from './storeContext.js'

const container = document.getElementById('root')
const root = createRoot(container)

const run = async () => {
  const store = createStore().create()
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
