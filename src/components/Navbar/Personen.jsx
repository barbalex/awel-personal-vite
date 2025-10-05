import { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'

import storeContext from '../../storeContext.js'
import addPerson from '../../src/addPerson.js'
import setPersonDeleted from '../../src/setPersonDeleted.js'
import fetchPersonen from '../../src/fetchPersonen.js'

const Sup = styled.sup`
  padding-left: 3px;
`
const StyledNavItem = styled(NavItem)`
  display: flex;
  border: ${(props) =>
    props['data-active'] ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Person = () => {
  const navigate = useNavigate()
  const { personId = 0, report } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    showDeleted,
    personenFiltered,
    personen,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
  } = store

  const showTab = useCallback(
    (e) => {
      e.preventDefault()
      navigate('/Personen')
    },
    [navigate],
  )
  const deletePerson = useCallback(() => {
    const activePerson = personen.find((p) => p.id === +personId)
    console.log('Person, activePerson:', activePerson)
    if (activePerson.deleted === 1) {
      // person.deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        store.deletePerson(+personId)
        setDeletionMessage(null)
        setDeletionTitle(null)
        fetchPersonen({ store })
      })
      const name = activePerson.name
        ? `"${activePerson.name} ${activePerson.vorname}"`
        : 'Dieser Datensatz'
      const namer1 = activePerson.anrede === 'Frau' ? 'sie' : 'ihn'
      const namer2 = activePerson.anrede === 'Frau' ? 'sie' : 'er'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ${namer1} nochmals löschen, wird ${namer2} endgültig und unwiederbringlich gelöscht. Möchten Sie das?`,
      )
      setDeletionTitle('Person unwiederbringlich löschen')

      return
    }
    // soft delete
    // only set person.deleted = 1
    setDeletionCallback(() => {
      setPersonDeleted({ id: +personId, store })
      setDeletionMessage(null)
      setDeletionTitle(null)
      fetchPersonen({ store })
    })
    setDeletionMessage(
      `${
        activePerson.name
          ? `"${activePerson.name} ${activePerson.vorname}"`
          : 'Diesen Datensatz'
      } wirklich löschen?`,
    )
    setDeletionTitle('Person löschen')
  }, [
    personen,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    personId,
    store,
  ])

  const existsActivePerson = pathname.startsWith('/Personen') && !!+personId
  const personenSum = showDeleted
    ? personen.length
    : personen.filter((p) => p.deleted === 0).length
  const personenSumSup =
    personenFiltered.length !== personenSum
      ? `${personenFiltered.length}/${personenSum}`
      : personenFiltered.length
  const active = pathname.startsWith('/Personen') && !report

  return (
    <StyledNavItem data-active={active}>
      <NavLink id="Personen" onClick={showTab}>
        Personen
        {active && <Sup>{personenSumSup}</Sup>}
      </NavLink>
      {!pathname.startsWith('/Personen') && (
        <UncontrolledTooltip placement="bottom" target="Personen">
          Personen anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton
            id="newPersonButton"
            onClick={() => addPerson({ store })}
          >
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newPersonButton">
            neue Person erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deletePersonButton"
            onClick={deletePerson}
            disabled={!existsActivePerson}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActivePerson && (
            <UncontrolledTooltip placement="bottom" target="deletePersonButton">
              markierte Person löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(Person)
