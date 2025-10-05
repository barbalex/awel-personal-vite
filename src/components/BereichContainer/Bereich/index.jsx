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

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
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

const Bereich = () => {
  const { bereichId: bereichIdInUrl = 0 } = useParams()
  const [listRef] = useOutletContext()

  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    sektionen,
    aemter,
    bereiche,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    standortWerte,
    showFilter,
    filterBereich,
    existsFilter,
    setFilter,
    setDirty,
  } = store

  let bereich
  if (showFilter) {
    bereich = filterBereich
  } else {
    bereich = bereiche.find((p) => p.id === +bereichIdInUrl)
    if (!bereich) bereich = {}
  }
  const bereichId = showFilter ? '' : +bereichIdInUrl

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [bereich.id])

  useEffect(() => {
    setDirty(false)
  }, [bereich.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!bereich && !showFilter)
        throw new Error(`Bereich with id ${bereichId} not found`)
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
          model: 'filterBereich',
          value: { ...filterBereich, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'bereiche',
          parentModel: 'bereiche',
          field,
          value: newValue,
          id: bereich.id,
          setErrors,
          store,
        })
        if (field === 'mutationFrist' && newValue && !bereich.mutationNoetig) {
          // set mutationNoetig to true of not yet so
          updateField({
            table: 'bereiche',
            parentModel: 'bereiche',
            field: 'mutationNoetig',
            value: 1,
            id: bereich.id,
            store,
          })
        }
        if (field === 'name') {
          const index = findIndex(
            store.bereicheFilteredSortedByHandelsbedarf,
            (p) => p.id === bereich.id,
          )
          listRef.current.scrollToItem(index)
        }
      }
    },
    [bereich, showFilter, bereichId, setFilter, filterBereich, store, listRef],
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
  const sektionOptions = useMemo(
    () =>
      sortBy(sektionen, ['name'])
        .filter((w) => !!w.name && w.deleted === 0)
        .map((w) => ({
          label: w.name,
          value: w.id,
        })),
    [sektionen],
  )
  const amtOptions = useMemo(
    () =>
      sortBy(aemter, ['name'])
        .filter((w) => !!w.name && w.deleted === 0)
        .map((w) => ({
          label: w.name,
          value: w.id,
        })),
    [aemter],
  )

  if (!showFilter && !bereichId) return null

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <StyledForm>
          <Input
            key={`${bereichId}name`}
            value={bereich.name}
            field="name"
            label="Name"
            saveToDb={saveToDb}
            error={errors.name}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}amt`}
            value={bereich.amt}
            field="amt"
            label="Amt"
            options={amtOptions}
            saveToDb={saveToDb}
            error={errors.amt}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}abteilung`}
            value={bereich.abteilung}
            field="abteilung"
            label="Abteilung"
            options={abteilungOptions}
            saveToDb={saveToDb}
            error={errors.abteilung}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}sektion`}
            value={bereich.sektion}
            field="sektion"
            label="Sektion"
            options={sektionOptions}
            saveToDb={saveToDb}
            error={errors.sektion}
          />
          <Input
            key={`${bereichId}kurzzeichen`}
            value={bereich.kurzzeichen}
            field="kurzzeichen"
            label="Kurzzeichen"
            saveToDb={saveToDb}
            error={errors.kurzzeichen}
          />
          <Input
            key={`${bereichId}telefonNr`}
            value={bereich.telefonNr}
            field="telefonNr"
            label="Telefon"
            saveToDb={saveToDb}
            error={errors.telefonNr}
          />
          <Input
            key={`${bereichId}email`}
            value={bereich.email}
            field="email"
            label="Email"
            saveToDb={saveToDb}
            error={errors.email}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}standort`}
            value={bereich.standort}
            field="standort"
            label="Standort"
            options={standortOptions}
            saveToDb={saveToDb}
            error={errors.standort}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}leiter`}
            value={bereich.leiter}
            field="leiter"
            label="Leiter"
            options={personOptions}
            saveToDb={saveToDb}
            error={errors.leiter}
          />
          <Select
            key={`${bereichId}${existsFilter ? 1 : 0}kostenstelle`}
            value={bereich.kostenstelle}
            field="kostenstelle"
            label="Kostenstelle"
            options={kostenstelleOptions}
            saveToDb={saveToDb}
            error={errors.kostenstelle}
          />
          {showMutationNoetig && (
            <Handlungsbedarf
              key={`${bereichId}mutationHandlungsbedarf`}
              mutationFristValue={bereich.mutationFrist}
              mutationNoetigValue={bereich.mutationNoetig}
              label="Handlungs&shy;bedarf"
              saveToDb={saveToDb}
              errorMutationNoetig={errors.mutationNoetig}
              errorMutationFrist={errors.mutationFrist}
            />
          )}
          {showDeleted && (
            <SharedCheckbox
              key={`${bereichId}deleted`}
              value={bereich.deleted}
              field="deleted"
              label="Gelöscht"
              saveToDb={saveToDb}
              error={errors.deleted}
            />
          )}
          {!showFilter && <Zuletzt row={bereich} />}
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Bereich)
