import { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'

import Person from './Person/index.jsx'
import PersonMutation from './PersonMutation.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  container-type: size;
`
const StyledNavItem = styled(NavItem)`
  cursor: default;
  a {
    background-color: ${(props) =>
      props.tab === 'datenblatt' ? 'rgba(249,230,0,.3) !important' : 'unset'};
    border-bottom: ${(props) =>
      props.tab === 'datenblatt'
        ? '1px solid #fff9ad !important'
        : '1px solid #dee2e6'};
    user-select: none;
  }
`
const StyledTabPane = styled(TabPane)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`

const PersonTab = () => {
  const [listRef] = useOutletContext()

  const [tab, setTab] = useState('datenblatt')

  return (
    <Container>
      <Nav tabs>
        <StyledNavItem tab={tab}>
          <NavLink
            className={classnames({
              active: tab === 'datenblatt',
            })}
            onClick={() => setTab('datenblatt')}
          >
            Datenblatt
          </NavLink>
        </StyledNavItem>
        <StyledNavItem>
          <NavLink
            className={classnames({
              active: tab === 'mutation',
            })}
            onClick={() => setTab('mutation')}
          >
            Mutation
          </NavLink>
        </StyledNavItem>
      </Nav>
      <TabContent activeTab={tab}>
        <StyledTabPane tabId="datenblatt">
          <Person listRef={listRef} />
        </StyledTabPane>
        <StyledTabPane tabId="mutation">
          <PersonMutation />
        </StyledTabPane>
      </TabContent>
    </Container>
  )
}

export default PersonTab
