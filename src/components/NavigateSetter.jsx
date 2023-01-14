import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import StoreContext from '../storeContext'

const NavigateSetter = () => {
  const store = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (store.navigate) return

    store.setNavigate(navigate)
  }, [navigate, store])

  return null
}
export default NavigateSetter
