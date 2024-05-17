import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext.js'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

import Navbar from './Navbar'

const Layout = () => {
  const { userIsLoggedIn } = useContext(storeContext)

  if (!userIsLoggedIn) {
    console.log(
      'Layout: navigating to / because user is not logged in:',
      userIsLoggedIn,
    )
    return <Navigate to="/" />
  }

  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  )
}

export default observer(Layout)
