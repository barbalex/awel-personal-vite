import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import findIndex from 'lodash/findIndex'
import { useParams, useOutletContext } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary'
import Input from '../shared/Input'
import PasswordInput from './PasswordInput'
import SharedCheckbox from '../shared/Checkbox_01'
import Zuletzt from '../shared/Zuletzt'
import storeContext from '../../storeContext'
import updateField from '../../src/updateField'

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
  const isAdmin = user.isAdmin === 1
  const loggedInUserId = users.find(
    (u) => u.name?.toLowerCase?.() === userName?.toLowerCase?.(),
  )?.id
  const thisUserIsLoggedIn = loggedInUserId === user.id
  const userMaySetAdmin = !thisUserIsLoggedIn && isAdmin

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

      // logged in user may not change own name (other than change casing)
      if (
        field === 'name' &&
        thisUserIsLoggedIn &&
        userName?.toLowerCase?.() !== value?.toLowerCase?.()
      ) {
        return setErrors({
          name: 'Angemeldete Benutzer können am eigenen Namen nur die Gross-/Kleinschreibung ändern',
        })
      }

      if (showFilter) {
        return setFilter({
          model: 'filterUser',
          value: { ...filterUser, ...{ [field]: value } },
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
      thisUserIsLoggedIn,
      store,
      userId,
      setFilter,
      filterUser,
      listRef,
    ],
  )
  const onChange = useCallback((val) => setPwd(val), [])

  if (!showFilter && !userId) return null

  // TODO: loggged in user may not change own isAdmin status
  // TODO: logged in user may not change own name (other than change casing)
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
              !showFilter && !userMaySetAdmin
                ? 'Angemeldete Admins können ihre eigenen Admin-Rechte nicht entfernen'
                : undefined
            }
            disabled={showFilter || !userMaySetAdmin}
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
