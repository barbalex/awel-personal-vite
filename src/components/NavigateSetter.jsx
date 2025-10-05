import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import StoreContext from '../storeContext.js'

export const NavigateSetter = observer(() => {
  const store = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (store.navigate) return

    store.setNavigate(navigate)
  }, [navigate, store])

  return null
})
