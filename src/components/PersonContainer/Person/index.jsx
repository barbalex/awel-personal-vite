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
import { useParams } from 'react-router-dom'

import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import Input from '../../shared/Input.jsx'
import Date from '../../shared/Date'
import Select from '../../shared/Select.jsx'
import SelectMulti from '../../shared/SelectMulti'
import Textarea from '../../shared/Textarea'
import SharedCheckbox from '../../shared/Checkbox_01.jsx'
import Handlungsbedarf from '../../shared/Handlungsbedarf.jsx'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber.js'
import isDateField from '../../../src/isDateField.js'
import Links from './Links'
import Schluessels from './Schluessels'
import MobileAbos from './MobileAbos'
import Telefones from './Telefones'
import Zuletzt from '../../shared/Zuletzt.jsx'
import storeContext from '../../../storeContext.js'
import PersonImage from './PersonImage'
import addFunktion from '../../../src/addFunktion'
import deleteFunktionModule from '../../../src/deleteFunktion'
import addKaderFunktionModule from '../../../src/addKaderFunktion'
import deleteKaderFunktionModule from '../../../src/deleteKaderFunktion'
import updateField from '../../../src/updateField.js'
import addEtikettModule from '../../../src/addEtikett'
import deleteEtikettModule from '../../../src/deleteEtikett'
import addAnwesenheitstagModule from '../../../src/addAnwesenheitstag'
import deleteAnwesenheitstagModule from '../../../src/deleteAnwesenheitstag'

const Container = styled.div`
  hyphens: auto;
  word-wrap: break-word;
  overflow: hidden;
`
// ISSUE
// styled-components do not allow container queries (yet?)
// so css depending on width and showFilter is set in styles.css
// and id is set depending on showFilter
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
`

const AreaPersonalien = styled.div`
  grid-area: personalien;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-areas:
    'p_area_title p_area_title'
    'p_name p_bild'
    'p_vorname p_bild'
    'p_anrede p_bild'
    'p_titel p_bild'
    'p_kurzzeichen p_bild'
    'p_adresse p_adresse'
    'p_plz p_plz'
    'p_ort p_ort'
    'p_land p_land'
    'p_email p_email'
    'p_geburtsdatum p_geburtsdatum'
    'p_telefon p_telefon';
  background-color: ${(props) =>
    props.isPdf ? 'white' : 'rgba(249, 230, 0, .3)'};
  padding: 8px;
  border: ${(props) => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const AreaPAreaTitle = styled.div`
  grid-area: p_area_title;
`
const AreaPName = styled.div`
  grid-area: p_name;
`
const AreaPBild = styled.div`
  grid-area: p_bild;
  padding-left: 8px;
`
const AreaPVorname = styled.div`
  grid-area: p_vorname;
`
const AreaPAnrede = styled.div`
  grid-area: p_anrede;
`
const AreaPTitel = styled.div`
  grid-area: p_titel;
`
const AreaPKurzzeichen = styled.div`
  grid-area: p_kurzzeichen;
`
const AreaPAdresse = styled.div`
  grid-area: p_adresse;
`
const AreaPPLZ = styled.div`
  grid-area: p_plz;
`
const AreaPOrt = styled.div`
  grid-area: p_ort;
`
const AreaPLand = styled.div`
  grid-area: p_land;
`
const AreaPEmail = styled.div`
  grid-area: p_email;
`
const AreaPGeburtsdatum = styled.div`
  grid-area: p_geburtsdatum;
`
const AreaPTelefon = styled.div`
  grid-area: p_telefon;
`
const AreaAnstellung = styled.div`
  grid-area: anstellung;
  background-color: ${(props) =>
    props.isPdf ? 'white' : 'rgba(0, 103, 249, .3)'};
  padding: 8px;
  border: ${(props) => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const AreaFunktionen = styled.div`
  grid-area: funktionen;
  background-color: ${(props) =>
    props.isPdf ? 'white' : 'rgba(61, 0, 247,.3)'};
  padding: 8px;
  border: ${(props) => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const AreaVerzeichnis = styled.div`
  grid-area: verzeichnis;
  background-color: ${(props) =>
    props.isPdf ? 'white' : 'rgba(249, 115, 0, .3)'};
  padding: 8px;
  border: ${(props) => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const AreaZuletzt = styled.div`
  grid-area: zuletzt;
  background-color: ${(props) =>
    props.isPdf ? 'white' : 'rgb(227, 232, 255)'};
  padding: 8px;
  border: ${(props) => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 18px;
`

const Person = ({ listRef }) => {
  const { personId: personIdInUrl = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    abteilungen,
    aemter,
    anredeWerte,
    anwesenheitstagWerte,
    anwesenheitstage,
    bereiche,
    etikettWerte,
    etiketten,
    existsFilter,
    filterAnwesenheitstage,
    filterEtikett,
    filterFunktion,
    filterKaderFunktion,
    filterPerson,
    funktionWerte,
    funktionen,
    kaderFunktionWerte,
    kaderFunktionen,
    landWerte,
    personen,
    sektionen,
    setDirty,
    setFilter,
    showDeleted,
    showFilter,
    showMutationNoetig,
    standortWerte,
    statusWerte,
  } = store

  let person
  if (showFilter) {
    person = filterPerson
  } else {
    person = personen.find((p) => p.id === +personIdInUrl) || {}
  }
  const personId = showFilter ? '' : +personIdInUrl

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [person.id])

  useEffect(() => {
    setDirty(false)
  }, [person.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!person && !showFilter) {
        throw new Error(`Person with id ${personId} not found`)
      }
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
          model: 'filterPerson',
          value: { ...filterPerson, ...{ [field]: newValue } },
        })
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ abteilung: null } },
            })
          }
          if (person.sektion) {
            // reset sektion
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ sektion: null } },
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          setFilter({
            model: 'filterPerson',
            value: { ...filterPerson, ...{ sektion: null } },
          })
        }
      } else {
        updateField({
          table: 'personen',
          parentModel: 'personen',
          field,
          value: newValue,
          id: personId,
          personId,
          setErrors,
          store,
        })
        if (field === 'mutationFrist' && newValue && !person.mutationNoetig) {
          // set mutationNoetig to true of not yet so
          updateField({
            table: 'personen',
            parentModel: 'personen',
            field: 'mutationNoetig',
            value: 1,
            id: personId,
            personId,
            store,
          })
        }
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'abteilung',
              value: null,
              id: personId,
              personId,
              setErrors,
              store,
            })
          }
          if (person.sektion) {
            // reset sektion
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'sektion',
              value: null,
              id: personId,
              personId,
              setErrors,
              store,
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          updateField({
            table: 'personen',
            parentModel: 'personen',
            field: 'sektion',
            value: null,
            id: personId,
            personId,
            setErrors,
            store,
          })
        }
        if (['name', 'vorname'].includes(field)) {
          const index = findIndex(
            store.personenFilteredSortedByHandlungsbedarf,
            (p) => p.id === person.id,
          )
          listRef.current.scrollToItem(index)
        }
      }
    },
    [person, showFilter, personId, setFilter, filterPerson, store, listRef],
  )
  const addEtikett = useCallback(
    (etikett) => {
      if (showFilter) {
        setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett } },
        })
      } else {
        addEtikettModule({ etikett, personId, store })
      }
    },
    [showFilter, setFilter, filterEtikett, store, personId],
  )
  const deleteEtikett = useCallback(
    (etikett) => {
      if (showFilter) {
        setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett: null } },
        })
      } else {
        deleteEtikettModule({ etikett, personId, store })
      }
    },
    [filterEtikett, personId, setFilter, showFilter, store],
  )
  const saveToDbEtikett = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterEtikett',
          value: { ...filterEtikett, ...{ etikett: value } },
        })
      }
      setFilter({
        model: 'filterEtikett',
        value: { ...filterEtikett, ...{ etikett: null } },
      })
    },
    [filterEtikett, setFilter],
  )

  const addAnwesenheitstag = useCallback(
    (tag) => {
      if (showFilter) {
        setFilter({
          model: 'filterAnwesenheitstage',
          value: { ...filterAnwesenheitstage, ...{ tag } },
        })
      } else {
        addAnwesenheitstagModule({ tag, personId, store })
      }
    },
    [showFilter, setFilter, filterAnwesenheitstage, store, personId],
  )
  const deleteAnwesenheitstag = useCallback(
    (tag) => {
      if (showFilter) {
        setFilter({
          model: 'filterAnwesenheitstage',
          value: { ...filterAnwesenheitstage, ...{ tag: null } },
        })
      } else {
        deleteAnwesenheitstagModule({ tag, personId, store })
      }
    },
    [filterAnwesenheitstage, personId, setFilter, showFilter, store],
  )
  const setFilterAnwesenheitstage = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterAnwesenheitstage',
          value: { ...filterAnwesenheitstage, ...{ tag: value } },
        })
      }
      setFilter({
        model: 'filterAnwesenheitstage',
        value: { ...filterAnwesenheitstage, ...{ tag: null } },
      })
    },
    [filterAnwesenheitstage, setFilter],
  )

  const addFunktionModule = useCallback(
    (funktion) => {
      if (showFilter) {
        setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion } },
        })
      } else {
        addFunktion({ funktion, personId, store })
      }
    },
    [showFilter, setFilter, filterFunktion, store, personId],
  )
  const deleteFunktion = useCallback(
    (funktion) => {
      if (showFilter) {
        setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion: null } },
        })
      } else {
        deleteFunktionModule({ funktion, personId, store })
      }
    },
    [filterFunktion, personId, setFilter, showFilter, store],
  )
  const setFilterFunktion = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterFunktion',
          value: { ...filterFunktion, ...{ funktion: value } },
        })
      }
      setFilter({
        model: 'filterFunktion',
        value: { ...filterFunktion, ...{ funktion: null } },
      })
    },
    [filterFunktion, setFilter],
  )

  const addKaderFunktion = useCallback(
    (funktion) => {
      if (showFilter) {
        setFilter({
          model: 'filterKaderFunktion',
          value: { ...filterKaderFunktion, ...{ funktion } },
        })
      } else {
        addKaderFunktionModule({ funktion, personId, store })
      }
    },
    [showFilter, setFilter, filterKaderFunktion, store, personId],
  )
  const deleteKaderFunktion = useCallback(
    (funktion) => {
      if (showFilter) {
        setFilter({
          model: 'filterKaderFunktion',
          value: { ...filterKaderFunktion, ...{ funktion: null } },
        })
      } else {
        deleteKaderFunktionModule({ funktion, personId, store })
      }
    },
    [filterKaderFunktion, personId, setFilter, showFilter, store],
  )
  const setFilterKaderFunktion = useCallback(
    ({ value }) => {
      if (value) {
        return setFilter({
          model: 'filterKaderFunktion',
          value: { ...filterKaderFunktion, ...{ funktion: value } },
        })
      }
      setFilter({
        model: 'filterKaderFunktion',
        value: { ...filterKaderFunktion, ...{ funktion: null } },
      })
    },
    [filterKaderFunktion, setFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter((w) => !!w.name && !!w.vorname && w.deleted === 0)
        .filter((w) => showFilter || (!showFilter && w.id !== person.id))
        .map((w) => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [person.id, personen, showFilter],
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
  const abteilungOptions = useMemo(
    () =>
      sortBy(abteilungen, ['name'])
        .filter((w) => !!w.name && w.deleted === 0)
        .filter((w) => {
          if (person.amt) {
            return w.amt === person.amt
          }
          return true
        })
        .map((w) => ({
          label: w.name,
          value: w.id,
        })),
    [abteilungen, person.amt],
  )
  const sektionOptions = useMemo(
    () =>
      sortBy(sektionen, ['name'])
        .filter((w) => !!w.name && w.deleted === 0)
        .filter((w) => {
          if (person.abteilung) {
            return w.abteilung === person.abteilung
          }
          return true
        })
        .map((w) => ({
          label: w.name,
          value: w.id,
        })),
    [sektionen, person.abteilung],
  )
  const bereichOptions = useMemo(
    () =>
      sortBy(bereiche, ['name'])
        .filter((b) => !!b.name && b.deleted === 0)
        .filter((b) => {
          if (person.sektion) {
            return !b.sektion || b.sektion === person.sektion
          }
          return true
        })
        .filter((b) => {
          if (person.abteilung) {
            return !b.abteilung || b.abteilung === person.abteilung
          }
          return true
        })
        .filter((b) => {
          if (person.amt) {
            return !b.amt || b.amt === person.amt
          }
          return true
        })
        .map((b) => ({
          label: b.name,
          value: b.id,
        })),
    [bereiche, person.sektion, person.abteilung, person.amt],
  )
  const statusOptions = useMemo(
    () =>
      sortBy(statusWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [statusWerte],
  )
  const anredeOptions = useMemo(
    () =>
      sortBy(anredeWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [anredeWerte],
  )
  const etikettenOptions = useMemo(
    () =>
      sortBy(etikettWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [etikettWerte],
  )
  const anwesenheitstageOptions = useMemo(
    () =>
      sortBy(anwesenheitstagWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [anwesenheitstagWerte],
  )
  const funktionenOptions = useMemo(
    () =>
      sortBy(funktionWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [funktionWerte],
  )
  const kaderFunktionenOptions = useMemo(
    () =>
      sortBy(kaderFunktionWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [kaderFunktionWerte],
  )
  const landOptions = useMemo(
    () =>
      sortBy(landWerte, ['sort', 'value'])
        .filter((p) => p.deleted === 0)
        .map((w) => ({
          label: w.value,
          value: w.value,
        })),
    [landWerte],
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
  const myEtiketten = useMemo(
    () =>
      sortBy(
        etiketten.filter((e) => e.idPerson === personId),
        'etikett',
      )
        .filter((w) => !!w.etikett)
        .filter((p) => p.deleted === 0)
        .map((e) => ({
          label: e.etikett,
          value: e.etikett,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personId, JSON.stringify(etiketten)],
  )
  const myAnwesenheitstage = useMemo(
    () =>
      sortBy(
        anwesenheitstage.filter((e) => e.idPerson === personId),
        (e) => {
          const awWert = anwesenheitstagWerte.find((w) => w.value === e.tag)
          if (awWert && awWert.sort) return awWert.sort
          return 1
        },
      )
        .filter((w) => !!w.tag)
        .filter((p) => p.deleted === 0)
        .map((e) => ({
          label: e.tag,
          value: e.tag,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personId, anwesenheitstagWerte, JSON.stringify(anwesenheitstage)],
  )
  const myFunktionen = useMemo(
    () =>
      sortBy(
        funktionen.filter((e) => e.idPerson === personId),
        'funktion',
      )
        .filter((w) => !!w.funktion)
        .filter((p) => p.deleted === 0)
        .map((e) => ({
          label: e.funktion,
          value: e.funktion,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personId, JSON.stringify(funktionen)],
  )
  const myKaderFunktionen = useMemo(
    () =>
      sortBy(
        kaderFunktionen.filter((e) => e.idPerson === personId),
        'funktion',
      )
        .filter((w) => !!w.funktion)
        .filter((p) => p.deleted === 0)
        .map((e) => ({
          label: e.funktion,
          value: e.funktion,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personId, JSON.stringify(kaderFunktionen)],
  )

  if (!showFilter && !personId) return null

  return (
    <ErrorBoundary>
      <Container>
        <Form>
          <Wrapper id={`person-form-wrapper${showFilter ? '-filter' : ''}`}>
            <AreaPersonalien>
              <AreaPAreaTitle>
                <Title>Personalien</Title>
              </AreaPAreaTitle>
              <AreaPBild>
                <PersonImage person={person} />
              </AreaPBild>
              <AreaPName>
                <Input
                  key={`${personId}name`}
                  value={person.name}
                  field="name"
                  label="Name"
                  saveToDb={saveToDb}
                  error={errors.name}
                  row={false}
                />
              </AreaPName>
              <AreaPVorname>
                <Input
                  key={`${personId}vorname`}
                  value={person.vorname}
                  field="vorname"
                  label="Vorname"
                  saveToDb={saveToDb}
                  error={errors.vorname}
                  row={false}
                />
              </AreaPVorname>
              <AreaPAnrede>
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}anrede`}
                  value={person.anrede}
                  field="anrede"
                  label="Anrede"
                  options={anredeOptions}
                  saveToDb={saveToDb}
                  error={errors.anrede}
                  row={false}
                />
              </AreaPAnrede>
              <AreaPTitel>
                <Input
                  key={`${personId}titel`}
                  value={person.titel}
                  field="titel"
                  label="Titel"
                  saveToDb={saveToDb}
                  error={errors.titel}
                  row={false}
                />
              </AreaPTitel>
              <AreaPKurzzeichen>
                <Input
                  key={`${personId}kurzzeichen`}
                  value={person.kurzzeichen}
                  field="kurzzeichen"
                  label="Kurzzei&shy;chen"
                  saveToDb={saveToDb}
                  error={errors.kurzzeichen}
                  row={false}
                />
              </AreaPKurzzeichen>
              <AreaPAdresse>
                <Input
                  key={`${personId}adresse`}
                  value={person.adresse}
                  field="adresse"
                  label="Adresse"
                  saveToDb={saveToDb}
                  error={errors.adresse}
                  row={false}
                />
              </AreaPAdresse>
              <AreaPPLZ>
                <Input
                  key={`${personId}plz`}
                  value={person.plz}
                  field="plz"
                  label="PLZ"
                  saveToDb={saveToDb}
                  type="number"
                  error={errors.plz}
                  row={false}
                />
              </AreaPPLZ>
              <AreaPOrt>
                <Input
                  key={`${personId}ort`}
                  value={person.ort}
                  field="ort"
                  label="Ort"
                  saveToDb={saveToDb}
                  error={errors.ort}
                  row={false}
                />
              </AreaPOrt>
              <AreaPLand>
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}land`}
                  value={person.land}
                  field="land"
                  label="Land"
                  options={landOptions}
                  saveToDb={saveToDb}
                  error={errors.land}
                  row={false}
                />
              </AreaPLand>
              <AreaPEmail>
                <Input
                  key={`${personId}email`}
                  value={person.email}
                  field="email"
                  label="Email"
                  saveToDb={saveToDb}
                  error={errors.email}
                  row={false}
                />
              </AreaPEmail>
              <AreaPGeburtsdatum>
                <Date
                  key={`${personId}geburtDatum`}
                  value={person.geburtDatum}
                  field="geburtDatum"
                  label="Geburts&shy;datum"
                  saveToDb={saveToDb}
                  error={errors.geburtDatum}
                  row={false}
                />
              </AreaPGeburtsdatum>
              <AreaPTelefon>
                <Telefones row={false} />
              </AreaPTelefon>
            </AreaPersonalien>
            <AreaAnstellung>
              <Title>Anstellung</Title>
              <Select
                key={`${personId}${existsFilter ? 1 : 0}status`}
                value={person.status}
                field="status"
                label="Status"
                options={statusOptions}
                saveToDb={saveToDb}
                error={errors.status}
                row={false}
              />
              <Date
                key={`${personId}${existsFilter ? 1 : 0}eintrittDatum`}
                value={person.eintrittDatum}
                field="eintrittDatum"
                label="Eintritt"
                saveToDb={saveToDb}
                error={errors.eintrittDatum}
                row={false}
              />
              <Date
                key={`${personId}${existsFilter ? 1 : 0}austrittDatum`}
                value={person.austrittDatum}
                field="austrittDatum"
                label="Austritt"
                saveToDb={saveToDb}
                error={errors.austrittDatum}
                row={false}
              />
              <Input
                key={`${personId}beschaeftigungsgrad`}
                value={person.beschaeftigungsgrad}
                field="beschaeftigungsgrad"
                label="Beschäfti&shy;gungs&shy;grad (%)"
                saveToDb={saveToDb}
                type="number"
                error={errors.beschaeftigungsgrad}
                row={false}
              />
              {showFilter ? (
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}anwesenheitstag`}
                  value={filterAnwesenheitstage.tag}
                  field="anwesenheitstage"
                  label="Anwesenheitstage"
                  options={anwesenheitstageOptions}
                  saveToDb={setFilterAnwesenheitstage}
                  error={errors.anwesenheitstage}
                  row={false}
                />
              ) : (
                <SelectMulti
                  key={`${personId}${existsFilter ? 1 : 0}anwesenheitstage`}
                  value={myAnwesenheitstage}
                  field="anwesenheitstage"
                  label="Anwesenheitstage"
                  options={anwesenheitstageOptions}
                  add={addAnwesenheitstag}
                  remove={deleteAnwesenheitstag}
                  error={errors.anwesenheitstage}
                  row={false}
                />
              )}
              <Select
                key={`${personId}${existsFilter ? 1 : 0}standort`}
                value={person.standort}
                field="standort"
                label="Standort"
                options={standortOptions}
                saveToDb={saveToDb}
                error={errors.standort}
                row={false}
              />
              <Input
                key={`${personId}bueroNr`}
                value={person.bueroNr}
                field="bueroNr"
                label="Büro Nr."
                saveToDb={saveToDb}
                error={errors.bueroNr}
                row={false}
              />
            </AreaAnstellung>
            <AreaFunktionen>
              <Title>Funktionen</Title>
              <Select
                key={`${personId}${existsFilter ? 1 : 0}amt`}
                value={person.amt}
                field="amt"
                label="Amt"
                options={amtOptions}
                saveToDb={saveToDb}
                error={errors.amt}
                row={false}
              />
              <Select
                key={`${personId}${existsFilter ? 1 : 0}abteilung`}
                value={person.abteilung}
                field="abteilung"
                label="Abteilung"
                options={abteilungOptions}
                saveToDb={saveToDb}
                error={errors.abteilung}
                row={false}
              />
              <Select
                key={`${personId}${existsFilter ? 1 : 0}sektion`}
                value={person.sektion}
                field="sektion"
                label="Sektion"
                options={sektionOptions}
                saveToDb={saveToDb}
                error={errors.sektion}
                row={false}
              />
              <Select
                key={`${personId}${existsFilter ? 1 : 0}bereich`}
                value={person.bereich}
                field="bereich"
                label="Bereich"
                options={bereichOptions}
                saveToDb={saveToDb}
                error={errors.bereich}
                row={false}
              />
              <Select
                key={`${personId}${existsFilter ? 1 : 0}vorgesetztId`}
                value={person.vorgesetztId}
                field="vorgesetztId"
                label="Vorge&shy;setz&shy;te(r)"
                options={personOptions}
                saveToDb={saveToDb}
                error={errors.vorgesetztId}
                row={false}
              />
              {showFilter ? (
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}funktion`}
                  value={filterFunktion.funktion}
                  field="funktion"
                  label="Funktion"
                  options={funktionenOptions}
                  saveToDb={setFilterFunktion}
                  error={errors.funktion}
                  row={false}
                />
              ) : (
                <SelectMulti
                  key={`${personId}${existsFilter ? 1 : 0}funktion`}
                  value={myFunktionen}
                  field="funktion"
                  label="Funktio&shy;nen"
                  options={funktionenOptions}
                  add={addFunktionModule}
                  remove={deleteFunktion}
                  error={errors.funktion}
                  row={false}
                />
              )}
              {showFilter ? (
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}kaderFunktion`}
                  value={filterKaderFunktion.funktion}
                  field="funktion"
                  label="Kader-&shy;Funktion"
                  options={kaderFunktionenOptions}
                  saveToDb={setFilterKaderFunktion}
                  error={errors.kaderFunktion}
                  row={false}
                />
              ) : (
                <SelectMulti
                  key={`${personId}${existsFilter ? 1 : 0}kaderFunktion`}
                  value={myKaderFunktionen}
                  field="funktion"
                  label="Kader-&shy;Funktio&shy;nen"
                  options={kaderFunktionenOptions}
                  add={addKaderFunktion}
                  remove={deleteKaderFunktion}
                  error={errors.kaderFunktion}
                  row={false}
                />
              )}
            </AreaFunktionen>
            <AreaVerzeichnis>
              <Title>Verzeichnis</Title>
              <Input
                key={`${personId}parkplatzNr`}
                value={person.parkplatzNr}
                field="parkplatzNr"
                label="Parkplatz Nr."
                saveToDb={saveToDb}
                error={errors.parkplatzNr}
                row={false}
              />
              {showFilter ? (
                <Select
                  key={`${personId}${existsFilter ? 1 : 0}etikett`}
                  value={filterEtikett.etikett}
                  field="etikett"
                  label="Etikett"
                  options={etikettenOptions}
                  saveToDb={saveToDbEtikett}
                  error={errors.etikett}
                  row={false}
                />
              ) : (
                <SelectMulti
                  key={`${personId}${existsFilter ? 1 : 0}etikett`}
                  value={myEtiketten}
                  field="etikett"
                  label="Etiketten"
                  options={etikettenOptions}
                  add={addEtikett}
                  remove={deleteEtikett}
                  error={errors.etikett}
                  row={false}
                />
              )}
              <Textarea
                key={`${personId}bemerkungen`}
                value={person.bemerkungen}
                field="bemerkungen"
                label="Bemerkun&shy;gen"
                saveToDb={saveToDb}
                error={errors.bemerkungen}
              />
              {!showFilter && <Links row={false} />}
              <Schluessels row={false} />
              <MobileAbos row={false} />
            </AreaVerzeichnis>
            {!showFilter && (
              <AreaZuletzt>
                {showMutationNoetig && (
                  <Handlungsbedarf
                    key={`${personId}mutationHandlungsbedarf`}
                    mutationFristValue={person.mutationFrist}
                    mutationBemerkungValue={person.mutationBemerkung}
                    mutationNoetigValue={person.mutationNoetig}
                    label="Handlungs&shy;bedarf"
                    saveToDb={saveToDb}
                    errorMutationNoetig={errors.mutationNoetig}
                    errorMutationFrist={errors.mutationFrist}
                    errorMutationBemerkung={errors.mutationBemerkung}
                  />
                )}
                {showDeleted && (
                  <SharedCheckbox
                    key={`${personId}deleted`}
                    value={person.deleted}
                    field="deleted"
                    label="Gelöscht"
                    saveToDb={saveToDb}
                    error={errors.deleted}
                    row={true}
                  />
                )}
                <Zuletzt padleft={13} row={person} />
              </AreaZuletzt>
            )}
          </Wrapper>
        </Form>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Person)
