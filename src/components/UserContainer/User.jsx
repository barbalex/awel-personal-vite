import { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import findIndex from 'lodash/findIndex'
import { useParams, useOutletContext } from 'react-router-dom'

import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import Input from '../shared/Input.jsx'
import PasswordInput from './PasswordInput.jsx'
import SharedCheckbox from '../shared/Checkbox_01.jsx'
import Zuletzt from '../shared/Zuletzt.jsx'
import storeContext from '../../storeContext.js'
import updateField from '../../src/updateField.js'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const User = () => {
  const { userId: userIdInUrl = 0 } = useParams()
  const [listRef] = useOutletContext()

  const store = useContext(storeContext)
  const { users, userName, showFilter, filterUser, setFilter, setDirty } = store

  let user
  if (showFilter) {
    user = filterUser
  } else {
    user = users.find((p) => p.id === +userIdInUrl)
    if (!user) user = {}
  }
  const userId = showFilter ? '' : +userIdInUrl
  // logged in user may not change own isAdmin status
  const loggedInUser = users.find(
    (u) => u.name?.toLowerCase?.() === userName?.toLowerCase?.(),
  )
  const loggedInUserIsAdmin = loggedInUser?.isAdmin === 1
  const loggedInUserId = loggedInUser?.id
  const shownUserIsLoggedIn = loggedInUserId === user.id
  const loggedInUserMaySetAdmin = !shownUserIsLoggedIn && loggedInUserIsAdmin

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [user.id])

  useEffect(() => {
    setDirty(false)
  }, [user.id, setDirty])

  const [pwd, setPwd] = useState()
  useEffect(() => {
    if (!user.pwd) return setPwd('')
    window.electronAPI
      .decryptString(user.pwd)
      .then((decrypted) => setPwd(decrypted))
  }, [user.pwd])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!user && !showFilter) {
        throw new Error(`User with id ${userId} not found`)
      }

      if (showFilter) {
        return setFilter({
          model: 'filterUser',
          value: { ...filterUser, ...{ [field]: value } },
        })
      }

      // logged in user may not change own name (other than change casing)
      if (
        field === 'name' &&
        shownUserIsLoggedIn &&
        userName?.toLowerCase?.() !== value?.toLowerCase?.()
      ) {
        return setErrors({
          name: 'Angemeldete Benutzer können am eigenen Namen nur die Gross-/Kleinschreibung ändern',
        })
      }

      updateField({
        table: 'users',
        parentModel: 'users',
        field,
        value,
        id: user.id,
        setErrors,
        store,
      })
      if (field === 'name') {
        const index = findIndex(
          store.usersFilteredSorted,
          (p) => p.id === user.id,
        )
        listRef.current.scrollToItem(index)
      }
    },
    [
      user,
      showFilter,
      shownUserIsLoggedIn,
      userName,
      store,
      userId,
      setFilter,
      filterUser,
      listRef,
    ],
  )
  const onChange = useCallback((val) => setPwd(val), [])

  if (!showFilter && !userId) return null

  console.log('User', {
    user: { ...user },
    loggedInUser: { ...loggedInUser },
    showFilter,
    userId,
    loggedInUserMaySetAdmin,
    loggedInUserIsAdmin,
    loggedInUserId,
    filterUser: { ...filterUser },
    shownUserIsLoggedIn,
  })

  // loggged in user may not change own isAdmin status
  // logged in user may not change own name (other than change casing)
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <StyledForm>
          <Input
            key={`${userId}name`}
            value={user.name}
            field="name"
            label="Name"
            saveToDb={saveToDb}
            error={errors.name}
          />
          <SharedCheckbox
            key={`${userId}isAdmin`}
            value={user.isAdmin}
            field="isAdmin"
            label="Ist Admin"
            saveToDb={saveToDb}
            error={errors.isAdmin}
            formText={
              !showFilter && !loggedInUserMaySetAdmin
                ? 'Angemeldete Admins können ihre eigenen Admin-Rechte nicht entfernen'
                : undefined
            }
            disabled={!showFilter && !loggedInUserMaySetAdmin}
          />
          {!showFilter && (
            <PasswordInput
              key={`${userId}pwd`}
              value={pwd}
              onChange={onChange}
              saveToDb={saveToDb}
              error={errors.pwd}
              user={user}
            />
          )}
          {!showFilter && <Zuletzt row={user} />}
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(User)
