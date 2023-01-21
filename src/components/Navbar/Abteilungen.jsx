import React, { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import storeContext from '../../storeContext'
import addAbteilungModule from '../../src/addAbteilung'
import setAbteilungDeleted from '../../src/setAbteilungDeleted'
import deleteAbteilungModule from '../../src/deleteAbteilung'

const Sup = styled.sup`
  padding-left: 3px;
`
const StyledNavItem = styled(NavItem)`
  display: flex;
  border: ${(props) =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Abteilung = () => {
  const { abteilungId = 0, report } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    showDeleted,
    abteilungenFiltered,
    abteilungen,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
  } = store

  const showTab = useCallback(
    (e) => {
      e.preventDefault()
      navigate(`/Abteilungen`)
    },
    [navigate],
  )
  const addAbteilung = useCallback(
    () => addAbteilungModule({ store, navigate }),
    [navigate, store],
  )
  const deleteAbteilung = useCallback(() => {
    const activeAbteilung = abteilungen.find((p) => p.id === +abteilungId)
    if (activeAbteilung.deleted === 1) {
      // abteilung.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        deleteAbteilungModule({ id: +abteilungId, store })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeAbteilung.name
        ? `"${activeAbteilung.name}"`
        : 'Dieser Datensatz'
      const namer1 = activeAbteilung.name ? 'sie' : 'ihn'
      const namer2 = activeAbteilung.name ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
      )
      setDeletionTitle('Abteilung unwiederbringlich löschen')

      return
    }
    // do not true delete yet
    // only set abteilung.deleted = 1
    setDeletionCallback(() => {
      setAbteilungDeleted({ id: +abteilungId, store })
      setDeletionMessage(null)
      setDeletionTitle(null)
    })
    setDeletionMessage(
      `${
        activeAbteilung.name ? `"${activeAbteilung.name}"` : 'Diesen Datensatz'
      } wirklich löschen?`,
    )
    setDeletionTitle('Abteilung löschen')
  }, [
    abteilungen,
    abteilungId,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    store,
  ])

  const abteilungenSum = showDeleted
    ? abteilungen.length
    : abteilungen.filter((p) => p.deleted === 0).length
  const abteilungenSumSup =
    abteilungenFiltered.length !== abteilungenSum
      ? `${abteilungenFiltered.length}/${abteilungenSum}`
      : abteilungenFiltered.length
  const active = pathname.startsWith('/Abteilungen') && !report
  const existsActiveAbteilung = active && !!+abteilungId

  return (
    <StyledNavItem active={active}>
      <NavLink id="Abteilungen" onClick={showTab}>
        Abteilungen
        {active && <Sup>{abteilungenSumSup}</Sup>}
      </NavLink>
      {!pathname.startsWith('/Abteilungen') && (
        <UncontrolledTooltip placement="bottom" target="Abteilungen">
          Abteilungen anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton id="newAbteilungButton" onClick={addAbteilung}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newAbteilungButton">
            neue Abteilung erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteAbteilungButton"
            onClick={deleteAbteilung}
            disabled={!existsActiveAbteilung}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveAbteilung && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteAbteilungButton"
            >
              markierte Abteilung löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Abteilung)
