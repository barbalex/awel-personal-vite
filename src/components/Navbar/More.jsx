import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaTrashAlt } from 'react-icons/fa'
import { FaRegEdit } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'

import storeContext from '../../storeContext'
import chooseDbConnection from '../../src/chooseDbConnection'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`
const MoreMenu = styled(UncontrolledDropdown)`
  > a {
    padding-left: 18px !important;
  }
`
const Version = styled.div`
  padding: 4px 24px;
  color: grey;
  user-select: none;
  font-style: italic;
`
const StyledDropdownItem = styled(DropdownItem)`
  display: flex !important;
  justify-content: space-between;
`
const Svg = styled.div`
  svg {
    margin-left: 9px;
    font-size: large;
  }
`

const onClickIssues = () =>
  window.electronAPI.openUrl('https://github.com/barbalex/awel-personal/issues')

const More = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    showDeleted,
    setShowDeleted,
    showMutationNoetig,
    setShowMutationNoetig,
  } = store

  const toggleShowDeleted = useCallback(
    () => setShowDeleted(!showDeleted),
    [setShowDeleted, showDeleted],
  )
  const toggleShowMutationNoetig = useCallback(
    () => setShowMutationNoetig(!showMutationNoetig),
    [setShowMutationNoetig, showMutationNoetig],
  )
  const showMutations = useCallback(() => navigate('mutations'), [navigate])

  const [dbPath, setDbPath] = useState('')
  useEffect(() => {
    window.electronAPI.getConfig().then((config) => setDbPath(config?.dbPath))
  }, [])

  return (
    <MoreMenu nav inNavbar>
      <DropdownToggle nav caret>
        Mehr
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={chooseDbConnection}>
          Datenbank w??hlen
          <br />
          <DbPath>{`Aktuell: ${dbPath}`}</DbPath>
        </DropdownItem>
        {!pathname.startsWith('/mutations') && (
          <div>
            <DropdownItem divider />
            <DropdownItem onClick={showMutations}>
              Daten-??nderungen anzeigen
            </DropdownItem>
          </div>
        )}
        <DropdownItem divider />
        <StyledDropdownItem onClick={toggleShowDeleted}>
          <div>
            {showDeleted
              ? 'Gel??schte Datens??tze verbergen'
              : 'Gel??schte Datens??tze anzeigen'}
          </div>
          <Svg>
            <FaTrashAlt />
          </Svg>
        </StyledDropdownItem>
        <DropdownItem divider />
        <StyledDropdownItem onClick={toggleShowMutationNoetig}>
          <div>
            {showMutationNoetig
              ? 'Datens??tze mit Handlungsbedarf nicht hervorheben'
              : 'Datens??tze mit Handlungsbedarf hervorheben'}
          </div>
          <Svg>
            <FaRegEdit />
          </Svg>
        </StyledDropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und W??nsche melden
        </DropdownItem>
        <DropdownItem divider />
        <Version>Version: 1.2.14 vom 17.09.2021</Version>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default observer(More)
