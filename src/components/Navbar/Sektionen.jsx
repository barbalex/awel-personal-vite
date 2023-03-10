import React, { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import storeContext from '../../storeContext'
import addSektionModule from '../../src/addSektion'
import setSektionDeleted from '../../src/setSektionDeleted'
import deleteSektionModule from '../../src/deleteSektion'

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

const Sektion = () => {
  const navigate = useNavigate()
  const { sektionId = 0, report } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    showDeleted,
    sektionenFiltered,
    sektionen,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
  } = store

  const showTab = useCallback(
    (e) => {
      e.preventDefault()
      navigate('/Sektionen')
    },
    [navigate],
  )
  const addSektion = useCallback(
    () => addSektionModule({ store, navigate }),
    [navigate, store],
  )
  const deleteSektion = useCallback(() => {
    const activeSektion = sektionen.find((p) => p.id === +sektionId)
    if (activeSektion.deleted === 1) {
      // sektion.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        deleteSektionModule({ id: +sektionId, store })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeSektion.name
        ? `"${activeSektion.name}"`
        : 'Dieser Datensatz'
      const namer1 = activeSektion.name ? 'sie' : 'ihn'
      const namer2 = activeSektion.name ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gel??scht. Wenn Sie ${namer1} nochmals l??schen, wird ${namer2} endg??ltig und unwiederbringlich gel??scht. M??chten Sie das?`,
      )
      setDeletionTitle('Sektion unwiederbringlich l??schen')
    } else {
      // do not true delete yet
      // only set sektion.deleted = 1
      setDeletionCallback(() => {
        setSektionDeleted({ id: +sektionId, store })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activeSektion.name ? `"${activeSektion.name}"` : 'Diesen Datensatz'
        } wirklich l??schen?`,
      )
      setDeletionTitle('Sektion l??schen')
    }
  }, [
    sektionen,
    sektionId,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    store,
  ])

  const sektionenSum = showDeleted
    ? sektionen.length
    : sektionen.filter((p) => p.deleted === 0).length
  const sektionenSumSup =
    sektionenFiltered.length !== sektionenSum
      ? `${sektionenFiltered.length}/${sektionenSum}`
      : sektionenFiltered.length
  const active = pathname.startsWith('/Sektionen') && !report
  const existsActiveSektion = active && !!+sektionId

  return (
    <StyledNavItem active={active}>
      <NavLink id="Sektionen" onClick={showTab}>
        Sektionen
        {active && <Sup>{sektionenSumSup}</Sup>}
      </NavLink>
      {!pathname.startsWith('/Sektionen') && (
        <UncontrolledTooltip placement="bottom" target="Sektionen">
          Sektionen anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton id="newSektionButton" onClick={addSektion}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newSektionButton">
            neue Sektion erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteSektionButton"
            onClick={deleteSektion}
            disabled={!existsActiveSektion}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveSektion && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteSektionButton"
            >
              markierte Sektion l??schen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Sektion)
