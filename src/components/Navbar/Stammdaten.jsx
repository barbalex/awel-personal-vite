import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  UncontrolledTooltip,
} from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import storeContext from '../../storeContext.js'
import addWertModule from '../../src/addWert.js'
import setWertDeleted from '../../src/setWertDeleted.js'
import deleteWertModule from '../../src/deleteWert.js'

const Sup = styled.sup`
  padding-left: 3px;
`
const StamdatenContainer = styled.div`
  display: flex;
  border: ${(props) =>
    props['data-active'] ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Stammdaten = () => {
  const navigate = useNavigate()
  const { tableName, tableId = 0 } = useParams()

  // console.log('Stammdaten', { tableName, tableId })

  const store = useContext(storeContext)
  const { setDeletionMessage, setDeletionTitle, setDeletionCallback } = store
  let stammdatenCount = 0
  if (tableName?.includes('Werte')) {
    stammdatenCount = store[tableName].length
  }
  const existsActiveWert = tableName?.includes('Werte') && !!+tableId

  const addWert = useCallback(
    () => addWertModule({ table: tableName, store, navigate }),
    [tableName, store, navigate],
  )

  const deleteWert = useCallback(() => {
    const activeWert = store[tableName].find((p) => p.id === +tableId)
    if (activeWert.deleted === 1) {
      // deleted is already = 1
      // prepare true deletion
      setDeletionCallback(() => {
        deleteWertModule({ id: +tableId, table: tableName, store })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      const name = activeWert.value
        ? `"${activeWert.value}"`
        : 'Dieser Datensatz'
      setDeletionMessage(
        `${name} war schon gelöscht. Wenn Sie ihn nochmals löschen, ist das endgültig und unwiederbringlich. Möchten Sie das?`,
      )
      setDeletionTitle(`${tableName} unwiederbringlich löschen`)
    } else {
      // do not true delete yet
      // only set deleted = 1
      setDeletionCallback(() => {
        setWertDeleted({ id: +tableId, table: tableName, store })
        setDeletionMessage(null)
        setDeletionTitle(null)
      })
      setDeletionMessage(
        `${
          activeWert.value ? `"${activeWert.value}"` : 'Diesen Datensatz'
        } wirklich löschen?`,
      )
      setDeletionTitle(`${tableName} löschen`)
    }
  }, [
    store,
    tableName,
    tableId,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
  ])
  const onClickStatusTable = useCallback(
    (e) => navigate(`/Werte/${e.target.name}`),
    [navigate],
  )

  return (
    <StamdatenContainer data-active={tableName?.includes('Werte')}>
      <UncontrolledDropdown
        nav
        inNavbar
        data-active={tableName?.includes('Werte')}
      >
        <DropdownToggle nav caret>
          {tableName?.includes('Werte') ? (
            <span>
              {tableName}
              <Sup>{stammdatenCount}</Sup>
            </span>
          ) : (
            'Stammdaten'
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem name="anredeWerte" onClick={onClickStatusTable}>
            Anrede
          </DropdownItem>
          <DropdownItem
            name="anwesenheitstagWerte"
            onClick={onClickStatusTable}
          >
            Anwesenheits-Tage
          </DropdownItem>
          <DropdownItem name="etikettWerte" onClick={onClickStatusTable}>
            Etikett
          </DropdownItem>
          <DropdownItem name="funktionWerte" onClick={onClickStatusTable}>
            Funktion
          </DropdownItem>
          <DropdownItem name="kaderFunktionWerte" onClick={onClickStatusTable}>
            Kader-Funktion
          </DropdownItem>
          <DropdownItem name="kostenstelleWerte" onClick={onClickStatusTable}>
            Kostenstelle
          </DropdownItem>
          <DropdownItem name="landWerte" onClick={onClickStatusTable}>
            Land
          </DropdownItem>
          <DropdownItem
            name="mobileAboKostenstelleWerte"
            onClick={onClickStatusTable}
          >
            Mobile Abo Kostenstelle
          </DropdownItem>
          <DropdownItem name="mobileAboTypWerte" onClick={onClickStatusTable}>
            Mobile Abo Typ
          </DropdownItem>
          <DropdownItem name="mutationArtWerte" onClick={onClickStatusTable}>
            Mutations-Art
          </DropdownItem>
          <DropdownItem
            name="schluesselAnlageWerte"
            onClick={onClickStatusTable}
          >
            Schlüssel Anlage
          </DropdownItem>
          <DropdownItem name="schluesselTypWerte" onClick={onClickStatusTable}>
            Schlüssel Typ
          </DropdownItem>
          <DropdownItem name="standortWerte" onClick={onClickStatusTable}>
            Standort
          </DropdownItem>
          <DropdownItem name="statusWerte" onClick={onClickStatusTable}>
            Status
          </DropdownItem>
          <DropdownItem name="telefonTypWerte" onClick={onClickStatusTable}>
            Telefon Typ
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      {tableName?.includes('Werte') && (
        <>
          <StyledButton id="newStammdatenButton" onClick={addWert}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newStammdatenButton">
            neuen Wert erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteStammdatenButton"
            onClick={deleteWert}
            disabled={!existsActiveWert}
          >
            <FaTrashAlt />
          </StyledButton>
          {existsActiveWert && (
            <UncontrolledTooltip
              placement="bottom"
              target="deleteStammdatenButton"
            >
              markierten Wert löschen
            </UncontrolledTooltip>
          )}
        </>
      )}
    </StamdatenContainer>
  )
}

export default observer(Stammdaten)
