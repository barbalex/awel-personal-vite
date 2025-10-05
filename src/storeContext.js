import { createContext } from 'react'
const StoreContext = createContext({})
export const StoreContextProvider = StoreContext.Provider
export const StoreContextConsumer = StoreContext.Consumer
export default StoreContext
