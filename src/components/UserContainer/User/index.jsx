import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import findIndex from 'lodash/findIndex'
import moment from 'moment'
import { useParams, useOutletContext } from 'react-router-dom'

import ErrorBoundary from '../../shared/ErrorBoundary'
import Input from '../../shared/Input'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import Zuletzt from '../../shared/Zuletzt'
import storeContext from '../../../storeContext'
import isDateField from '../../../src/isDateField'
import updateField from '../../../src/updateField'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const User = () => {
  const { userId: userIdInUrl = 0 } = useParams()
  const [listRef] = useOutletContext()

  const store = useContext(storeContext)
  const { users, showFilter, filterUser, setFilter, setDirty } = store

  let user
  if (showFilter) {
    user = filterUser
  } else {
    user = users.find((p) => p.id === +userIdInUrl)
    if (!user) user = {}
  }
  const userId = showFilter ? '' : +userIdInUrl

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [user.id])

  useEffect(() => {
    setDirty(false)
  }, [user.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!user && !showFilter)
        throw new Error(`User with id ${userId} not found`)

      let newValue
      if (isDateField(field)) {
        if (value) {
          newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        }
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
          model: 'filterUser',
          value: { ...filterUser, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'users',
          parentModel: 'users',
          field,
          value: newValue,
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
      }
    },
    [user, showFilter, userId, setFilter, filterUser, store, listRef],
  )

  if (!showFilter && !userId) return null

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
          <Input
            key={`${userId}password`}
            value={user.password}
            field="password"
            label="Passwort"
            saveToDb={saveToDb}
            error={errors.password}
          />
          <SharedCheckbox
            key={`${userId}isAdmin`}
            value={user.isAdmin}
            field="isAdmin"
            label="Ist Admin"
            saveToDb={saveToDb}
            error={errors.isAdmin}
          />
          {!showFilter && <Zuletzt row={user} />}
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(User)
