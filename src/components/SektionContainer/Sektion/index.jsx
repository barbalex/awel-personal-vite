import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'
import { useParams, useOutletContext } from 'react-router-dom'

import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import Input from '../../shared/Input.jsx'
import Select from '../../shared/Select.jsx'
import SharedCheckbox from '../../shared/Checkbox_01.jsx'
import Handlungsbedarf from '../../shared/Handlungsbedarf.jsx'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber.js'
import isDateField from '../../../src/isDateField.js'
import Zuletzt from '../../shared/Zuletzt.jsx'
import storeContext from '../../../storeContext.js'
import updateField from '../../../src/updateField.js'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Sektion = () => {
  const { sektionId: sektionIdInUrl = 0 } = useParams()
  const [listRef] = useOutletContext()

  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    sektionen,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    standortWerte,
    showFilter,
    filterSektion,
    existsFilter,
    setFilter,
    setDirty,
  } = store

  let sektion
  if (showFilter) {
    sektion = filterSektion
  } else {
    sektion = sektionen.find((p) => p.id === +sektionIdInUrl)
    if (!sektion) sektion = {}
  }
  const sektionId = showFilter ? '' : +sektionIdInUrl

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [sektion.id])

  useEffect(() => {
    setDirty(false)
  }, [sektion.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!sektion && !showFilter)
        throw new Error(`Sektion with id ${sektionId} not found`)
      let newValue
      if (isDateField(field)) {
        if (value) newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
          model: 'filterSektion',
          value: { ...filterSektion, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'sektionen',
          parentModel: 'sektionen',
          field,
          value: newValue,
          id: sektion.id,
          setErrors,
          store,
        })
        if (field === 'mutationFrist' && newValue && !sektion.mutationNoetig) {
          // set mutationNoetig to true of not yet so
          updateField({
            table: 'sektionen',
            parentModel: 'sektionen',
            field: 'mutationNoetig',
            value: 1,
            id: sektion.id,
            store,
          })
        }
        if (field === 'name') {
          const index = findIndex(
            store.sektionenFilteredSortedByHandelsbedarf,
            (p) => p.id === sektion.id,
          )
          listRef.current.scrollToItem(index)
        }
      }
    },
    [sektion, showFilter, sektionId, setFilter, filterSektion, store, listRef],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter((w) => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(() => !showFilter)
        .map((w) => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen, showFilter],
  )
  const kostenstelleOptions = useMemo(
    () =>
      sortBy(kostenstelleWerte, ['sort', 'value'])
        .filter((w) => !!w.value)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [kostenstelleWerte],
  )
  const standortOptions = useMemo(
    () =>
      sortBy(standortWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [standortWerte],
  )
  const abteilungOptions = useMemo(
    () =>
      sortBy(abteilungen, ['name'])
        .filter((w) => !!w.name && w.deleted === 0)
        .map((w) => ({
          label: w.name,
          value: w.id,
        })),
    [abteilungen],
  )

  if (!showFilter && !sektionId) return null

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <StyledForm>
          <Input
            key={`${sektionId}name`}
            value={sektion.name}
            field="name"
            label="Name"
            saveToDb={saveToDb}
            error={errors.name}
          />
          <Select
            key={`${sektionId}${existsFilter ? 1 : 0}abteilung`}
            value={sektion.abteilung}
            field="abteilung"
            label="Abteilung"
            options={abteilungOptions}
            saveToDb={saveToDb}
            error={errors.abteilung}
          />
          <Input
            key={`${sektionId}kurzzeichen`}
            value={sektion.kurzzeichen}
            field="kurzzeichen"
            label="Kurzzeichen"
            saveToDb={saveToDb}
            error={errors.kurzzeichen}
          />
          <Input
            key={`${sektionId}telefonNr`}
            value={sektion.telefonNr}
            field="telefonNr"
            label="Telefon"
            saveToDb={saveToDb}
            error={errors.telefonNr}
          />
          <Input
            key={`${sektionId}email`}
            value={sektion.email}
            field="email"
            label="Email"
            saveToDb={saveToDb}
            error={errors.email}
          />
          <Select
            key={`${sektionId}${existsFilter ? 1 : 0}standort`}
            value={sektion.standort}
            field="standort"
            label="Standort"
            options={standortOptions}
            saveToDb={saveToDb}
            error={errors.standort}
          />
          <Select
            key={`${sektionId}${existsFilter ? 1 : 0}leiter`}
            value={sektion.leiter}
            field="leiter"
            label="Leiter"
            options={personOptions}
            saveToDb={saveToDb}
            error={errors.leiter}
          />
          <Select
            key={`${sektionId}${existsFilter ? 1 : 0}kostenstelle`}
            value={sektion.kostenstelle}
            field="kostenstelle"
            label="Kostenstelle"
            options={kostenstelleOptions}
            saveToDb={saveToDb}
            error={errors.kostenstelle}
          />
          {showMutationNoetig && (
            <Handlungsbedarf
              key={`${sektionId}mutationHandlungsbedarf`}
              mutationFristValue={sektion.mutationFrist}
              mutationNoetigValue={sektion.mutationNoetig}
              label="Handlungs&shy;bedarf"
              saveToDb={saveToDb}
              errorMutationNoetig={errors.mutationNoetig}
              errorMutationFrist={errors.mutationFrist}
            />
          )}
          {showDeleted && (
            <SharedCheckbox
              key={`${sektionId}deleted`}
              value={sektion.deleted}
              field="deleted"
              label="Gelöscht"
              saveToDb={saveToDb}
              error={errors.deleted}
            />
          )}
          {!showFilter && <Zuletzt row={sektion} />}
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Sektion)
