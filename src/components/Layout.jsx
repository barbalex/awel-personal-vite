import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

import Navbar from './Navbar'

const Layout = () => (
  <Container>
    <Navbar />
    <Outlet />
  </Container>
)

export default Layout
