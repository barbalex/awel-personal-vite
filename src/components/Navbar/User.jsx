import React, { useContext, useCallback } from 'react'
import { NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import storeContext from '../../storeContext'
import addUserModule from '../../src/addUser'
import deleteUserModule from '../../src/deleteUser'

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

const User = () => {
  const navigate = useNavigate()
  const { userId = 0 } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    usersFiltered,
    users,
    userName,
    setDeletionMessage,
    setDeletionTitle,
    setDeletionCallback,
  } = store

  // console.log('User', { users, usersFiltered })

  const showTab = useCallback(
    (e) => {
      e.preventDefault()
      navigate(`/Users`)
    },
    [navigate],
  )
  const addUser = useCallback(
    () => addUserModule({ store, navigate }),
    [navigate, store],
  )
  const deleteUser = useCallback(() => {
    const activeUser = users.find((p) => p.id === +userId)
    // amt.deleted is already = 1
    // prepare true deletion
    setDeletionCallback(() => {
      deleteUserModule({ id: +userId, store })
      setDeletionMessage(null)
      setDeletionTitle(null)
    })
    setDeletionMessage(
      `${
        activeUser.name ? `"${activeUser.name}"` : 'Diesen Datensatz'
      } wirklich löschen?`,
    )
    setDeletionTitle('Benutzer unwiederbringlich löschen')
  }, [
    userId,
    users,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
    store,
  ])

  const sumSup =
    usersFiltered.length !== users.length
      ? `${usersFiltered.length}/${users.length}`
      : usersFiltered.length
  const active = pathname.startsWith('/Users')
  const existsActiveUser = active && !!+userId
  const activeUserId = users.find((p) => p.id === +userId)?.id
  const loggedInUserId = users.find(
    (u) => u.name?.toLowerCase?.() === userName?.toLowerCase?.(),
  )?.id
  const userMayBeDeleted = activeUserId && activeUserId !== loggedInUserId

  return (
    <StyledNavItem data-active={active}>
      <NavLink id="Users" onClick={showTab}>
        Benutzer
        {active && <Sup>{sumSup}</Sup>}
      </NavLink>
      {!pathname.startsWith('/Users') && (
        <UncontrolledTooltip placement="bottom" target="Users">
          Benutzer anzeigen
        </UncontrolledTooltip>
      )}
      {active && (
        <>
          <StyledButton id="newUserButton" onClick={addUser}>
            <FaPlus />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="newUserButton">
            neuen Benutzer erfassen
          </UncontrolledTooltip>
          <StyledButton
            id="deleteUserButton"
            onClick={deleteUser}
            disabled={!existsActiveUser || !userMayBeDeleted}
          >
            <FaTrashAlt />
          </StyledButton>
          <UncontrolledTooltip placement="bottom" target="deleteUserButton">
            {userMayBeDeleted
              ? 'markierten Benutzer löschen'
              : 'angemeldete Benutzer können sich nicht selber löschen'}
          </UncontrolledTooltip>
        </>
      )}
    </StyledNavItem>
  )
}

export default observer(User)
