import React, { useContext, useState, useCallback } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, Button } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import { FaUndo, FaSave } from 'react-icons/fa'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import Filter from './Filter.jsx'
import Stammdaten from './Stammdaten.jsx'
import Personen from './Personen.jsx'
import Aemter from './Aemter.jsx'
import Abteilungen from './Abteilungen.jsx'
import Sektionen from './Sektionen.jsx'
import Bereiche from './Bereiche.jsx'
import Export from './Export/index.jsx'
import Berichte from './Berichte.jsx'
import User from './User.jsx'
import More from './More.jsx'
import storeContext from '../../storeContext.js'
import revertMutation from '../../src/revertMutation.js'

const StyledNavbar = styled(Navbar)`
  @media print {
    display: none;
  }
`
const UndoButton = styled(Button)`
  margin-right: 5px;
  background-color: transparent !important;
  border: none !important;
  &:hover {
    background-color: ${(props) =>
      props.disabled ? 'transparent !important' : '#6c757d !important'};
  }
`
const SaveButton = styled(Button)`
  background-color: transparent !important;
  border: none !important;
  &:hover {
    background-color: ${(props) =>
      props.disabled ? 'transparent !important' : '#6c757d !important'};
  }
`

const MyNavbar = () => {
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const { lastUserMutation, addError, dirty, userIsAdmin } = store

  const [open, setOpen] = useState(false)
  const toggleNavbar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const onClickUndo = useCallback(() => {
    if (!lastUserMutation) {
      return addError(
        'Es gibt keine Aktion, die rückgängig gemacht werden könnte',
      )
    }
    revertMutation({ mutationId: lastUserMutation.id, store })
  }, [addError, lastUserMutation, store])

  const showFilter =
    pathname.startsWith('/Personen') ||
    pathname.startsWith('/Aemter') ||
    pathname.startsWith('/Users') ||
    pathname.startsWith('/Abteilungen') ||
    pathname.startsWith('/Sektionen') ||
    pathname.startsWith('/Bereiche')

  return (
    <ErrorBoundary>
      <StyledNavbar color="dark" dark expand="xl">
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={open} navbar>
          <Nav className="me-auto" navbar>
            <Personen />
            <Bereiche />
            <Sektionen />
            <Abteilungen />
            <Aemter />
            <Export />
            <Berichte />
            <Stammdaten />
            {userIsAdmin && <User />}
          </Nav>
          <Nav navbar>
            <SaveButton
              disabled={!dirty}
              title={dirty ? 'speichern' : 'alles ist gespeichert'}
            >
              <FaSave />
            </SaveButton>
            <UndoButton
              disabled={!lastUserMutation}
              onClick={onClickUndo}
              title={
                lastUserMutation
                  ? 'letzte Aktion rückgängig machen'
                  : 'keine Aktion, die rückgängig gemacht werden könnte'
              }
            >
              <FaUndo />
            </UndoButton>
            {showFilter && <Filter />}
            <More />
          </Nav>
        </Collapse>
      </StyledNavbar>
    </ErrorBoundary>
  )
}

export default observer(MyNavbar)
