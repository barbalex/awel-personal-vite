import React, { useContext, useState, useCallback } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, Button } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import { FaUndo, FaSave } from 'react-icons/fa'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary'
import Filter from './Filter'
import Stammdaten from './Stammdaten'
import Personen from './Personen'
import Aemter from './Aemter'
import Abteilungen from './Abteilungen'
import Sektionen from './Sektionen'
import Bereiche from './Bereiche'
import Export from './Export'
import Berichte from './Berichte'
import More from './More'
import storeContext from '../../storeContext'

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
  const { lastUserMutation, revertMutation, addError, dirty } = store

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
    revertMutation(lastUserMutation.id)
  }, [addError, lastUserMutation, revertMutation])

  const showFilter =
    pathname.startsWith('/Personen') ||
    pathname.startsWith('/Aemter') ||
    pathname.startsWith('/Abteilungen') ||
    pathname.startsWith('/Sektionen') ||
    pathname.startsWith('/Bereiche')

  return (
    <ErrorBoundary>
      <StyledNavbar color="dark" dark expand="xl">
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={open} navbar>
          <Nav className="mr-auto" navbar>
            <Personen />
            <Bereiche />
            <Sektionen />
            <Abteilungen />
            <Aemter />
            <Export />
            <Berichte />
            <Stammdaten />
          </Nav>
          <Nav className="ml-auto" navbar>
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
