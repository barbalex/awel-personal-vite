import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'
import { useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import Input from '../shared/Input.jsx'
import SharedCheckbox from '../shared/Checkbox_01.jsx'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber.js'
import tables from '../../src/tables'
import storeContext from '../../storeContext.js'
import updateField from '../../src/updateField'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Data = ({ listRef }) => {
  const { tableId, tableName } = useParams()

  const store = useContext(storeContext)
  const { showDeleted, setDirty } = store

  const dat = tableId ? store[tableName].find((p) => p.id === +tableId) : []

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [dat.id])

  useEffect(() => {
    setDirty(false)
  }, [dat.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      const { parentModel } = tables.find((t) => t.table === tableName)

      updateField({
        table: tableName,
        parentModel,
        field,
        value: newValue,
        id: dat.id,
        setErrors,
        store,
      })
      if (field === 'value') {
        let data = store[tableName].slice().filter((p) => {
          if (!showDeleted) return p.deleted === 0
          return true
        })
        data = sortBy(data, ['sort', 'value'])
        const index = findIndex(data, (p) => p.id === dat.id)
        listRef.current.scrollToItem(index)
      }
    },
    [tableName, dat.id, store, listRef, showDeleted],
  )

  if (!tableId) return null
  if (!dat) {
    return (
      <Container>
        {`Sorry: keinen Datensatz in Tabelle "${tableName}" mit id "${tableId}" gefunden.`}
      </Container>
    )
  }
  return (
    <ErrorBoundary>
      <Container>
        <StyledForm>
          <Input
            key={`${dat.id}id`}
            value={dat.id}
            field="id"
            label="id"
            saveToDb={saveToDb}
            disabled
            error={errors.id}
          />
          <Input
            key={`${dat.id}value`}
            value={dat.value}
            field="value"
            label="Wert"
            saveToDb={saveToDb}
            error={errors.value}
          />
          {showDeleted && (
            <SharedCheckbox
              key={`${dat.id}deleted`}
              value={dat.deleted}
              field="deleted"
              label="Gelöscht"
              saveToDb={saveToDb}
              error={errors.deleted}
            />
          )}
          <SharedCheckbox
            key={`${dat.id}historic`}
            value={dat.historic}
            field="historic"
            label="historisch"
            saveToDb={saveToDb}
            error={errors.historic}
          />
          <Input
            key={`${dat.id}sort`}
            value={dat.sort}
            field="sort"
            label="Sortierung"
            type="number"
            saveToDb={saveToDb}
            error={errors.sort}
          />
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Data)
