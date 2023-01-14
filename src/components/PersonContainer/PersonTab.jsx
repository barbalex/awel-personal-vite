import React, { useContext, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'

import Person from './Person'
import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'
import PersonPrintFunktionen from './PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonPrintPensionierte'
import PersonPrintKader from './PersonPrintKader'
import PersonPrintVerzTel from './PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonPrintVerzKurzzeichen'
import PersonMutation from './PersonMutation'
import storeContext from '../../storeContext'

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
  const store = useContext(storeContext)
  const { activePrintForm } = store

  const [tab, setTab] = useState('datenblatt')

  if (activePrintForm === 'personalblatt') {
    return <PersonPrint />
  }
  if (activePrintForm === 'personMutation') {
    return <PersonMutationPrint />
  }
  if (activePrintForm === 'personFunktionen') {
    return <PersonPrintFunktionen />
  }
  if (activePrintForm === 'personPensionierte') {
    return <PersonPrintPensionierte />
  }
  if (activePrintForm === 'personKader') {
    return <PersonPrintKader />
  }
  if (activePrintForm === 'personVerzTel') {
    return <PersonPrintVerzTel />
  }
  if (activePrintForm === 'personVerzMobiltel') {
    return <PersonPrintVerzMobiltel />
  }
  if (activePrintForm === 'personVerzKurzzeichen') {
    return <PersonPrintVerzKurzzeichen />
  }

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
        <StyledNavItem active={tab === 'mutation'}>
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

export default observer(PersonTab)
