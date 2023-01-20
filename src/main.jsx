import React from 'react'
import { createRoot } from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

import App from './components/App'
import './styles.css'
import createStore from './store'
import watchMutations from './src/watchMutations'

import fetchUsers from './src/fetchUsers'
import fetchPersonen from './src/fetchPersonen'
import fetchAemter from './src/fetchAemter'
import fetchAbteilungen from './src/fetchAbteilungen'
import fetchBereiche from './src/fetchBereiche'
import fetchSektionen from './src/fetchSektionen'
import fetchEtiketten from './src/fetchEtiketten'
import fetchAnwesenheitstage from './src/fetchAnwesenheitstage'
import fetchLinks from './src/fetchLinks'
import fetchSchluessel from './src/fetchSchluessel'
import fetchMobileAbos from './src/fetchMobileAbos'
import fetchTelefones from './src/fetchTelefones'
import fetchFunktionen from './src/fetchFunktionen'
import fetchKaderFunktionen from './src/fetchKaderFunktionen'
import fetchWerte from './src/fetchWerte'
import fetchSettings from './src/fetchSettings'

import { StoreContextProvider } from './storeContext'

const container = document.getElementById('root')
const root = createRoot(container)

const run = async () => {
  const store = createStore().create()
  const { setUsername, setUserIsAdmin, setUserPwd } = store
  watchMutations({ store })

  const { userName, isAdmin, pwd } = await window.electronAPI.getUser()
  setUsername(userName ?? '(Benutzer nicht erkannt)')
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

  root.render(
    <StoreContextProvider value={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StoreContextProvider>,
  )
}

run()
