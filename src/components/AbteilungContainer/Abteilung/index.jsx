import {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'
import moment from 'moment'
import { useParams, useOutletContext } from 'react-router-dom'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import Input from '../../shared/Input.jsx'
import Select from '../../shared/Select.jsx'
import Handlungsbedarf from '../../shared/Handlungsbedarf.jsx'
import SharedCheckbox from '../../shared/Checkbox_01.jsx'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber.js'
import Zuletzt from '../../shared/Zuletzt.jsx'
import storeContext from '../../../storeContext.js'
import isDateField from '../../../src/isDateField.js'
import updateField from '../../../src/updateField.js'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Abteilung = () => {
  const { abteilungId: abteilungIdInUrl = 0 } = useParams()
  const [listRef] = useOutletContext()

  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    abteilungen,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    standortWerte,
    showFilter,
    filterAbteilung,
    existsFilter,
    setFilter,
    setDirty,
  } = store

  let abteilung
  if (showFilter) {
    abteilung = filterAbteilung
  } else {
    abteilung = abteilungen.find((p) => p.id === +abteilungIdInUrl)
    if (!abteilung) abteilung = {}
  }
  const abteilungId = showFilter ? '' : +abteilungIdInUrl

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [abteilung.id])

  useEffect(() => {
    setDirty(false)
  }, [abteilung.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!abteilung && !showFilter)
        throw new Error(`Abteilung with id ${abteilungId} not found`)

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
          model: 'filterAbteilung',
          value: { ...filterAbteilung, ...{ [field]: newValue } },
        })
      } else {
        console.log('Abteilung, will update:', {
          field,
          value: newValue,
          id: abteilung.id,
        })
        updateField({
          table: 'abteilungen',
          parentModel: 'abteilungen',
          field,
          value: newValue,
          id: abteilung.id,
          setErrors,
          store,
        })
        if (
          field === 'mutationFrist' &&
          newValue &&
          !abteilung.mutationNoetig
        ) {
          // set mutationNoetig to true of not yet so
          updateField({
            table: 'abteilungen',
            parentModel: 'abteilungen',
            field: 'mutationNoetig',
            value: 1,
            id: abteilung.id,
            store,
          })
        }
        if (field === 'name') {
          const index = findIndex(
            store.abteilungenFilteredSortedByHandlungsbedarf,
            (p) => p.id === abteilung.id,
          )
          listRef.current.scrollToItem(index)
        }
      }
    },
    [
      abteilung,
      showFilter,
      abteilungId,
      setFilter,
      filterAbteilung,
      store,
      listRef,
    ],
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

  if (!showFilter && !abteilungId) return null

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <StyledForm>
          <Input
            key={`${abteilungId}name`}
            value={abteilung.name}
            field="name"
            label="Name"
            saveToDb={saveToDb}
            error={errors.name}
          />
          <Select
            key={`${abteilungId}${existsFilter ? 1 : 0}amt`}
            value={abteilung.amt}
            field="amt"
            label="Amt"
            options={amtOptions}
            saveToDb={saveToDb}
            error={errors.amt}
          />
          <Input
            key={`${abteilungId}kurzzeichen`}
            value={abteilung.kurzzeichen}
            field="kurzzeichen"
            label="Kurzzeichen"
            saveToDb={saveToDb}
            error={errors.kurzzeichen}
          />
          <Input
            key={`${abteilungId}telefonNr`}
            value={abteilung.telefonNr}
            field="telefonNr"
            label="Telefon"
            saveToDb={saveToDb}
            error={errors.telefonNr}
          />
          <Input
            key={`${abteilungId}email`}
            value={abteilung.email}
            field="email"
            label="Email"
            saveToDb={saveToDb}
            error={errors.email}
          />
          <Select
            key={`${abteilungId}${existsFilter ? 1 : 0}standort`}
            value={abteilung.standort}
            field="standort"
            label="Standort"
            options={standortOptions}
            saveToDb={saveToDb}
            error={errors.standort}
          />
          <Select
            key={`${abteilungId}${existsFilter ? 1 : 0}leiter`}
            value={abteilung.leiter}
            field="leiter"
            label="Leiter"
            options={personOptions}
            saveToDb={saveToDb}
            error={errors.leiter}
          />
          <Select
            key={`${abteilungId}${existsFilter ? 1 : 0}kostenstelle`}
            value={abteilung.kostenstelle}
            field="kostenstelle"
            label="Kostenstelle"
            options={kostenstelleOptions}
            saveToDb={saveToDb}
            error={errors.kostenstelle}
          />
          {showMutationNoetig && (
            <Handlungsbedarf
              key={`${abteilungId}mutationHandlungsbedarf`}
              mutationFristValue={abteilung.mutationFrist}
              mutationNoetigValue={abteilung.mutationNoetig}
              label="Handlungs&shy;bedarf"
              saveToDb={saveToDb}
              errorMutationNoetig={errors.mutationNoetig}
              errorMutationFrist={errors.mutationFrist}
            />
          )}
          {showDeleted && (
            <SharedCheckbox
              key={`${abteilungId}deleted`}
              value={abteilung.deleted}
              field="deleted"
              label="Gelöscht"
              saveToDb={saveToDb}
              error={errors.deleted}
            />
          )}
          {!showFilter && <Zuletzt row={abteilung} />}
        </StyledForm>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Abteilung)
