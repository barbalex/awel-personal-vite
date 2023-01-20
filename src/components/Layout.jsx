import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

import Navbar from './Navbar'

const Layout = () => {
  const { userIsLoggedIn } = useContext(storeContext)

  if (!userIsLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  )
}

export default observer(Layout)
