import React, { useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTimes } from 'react-icons/fa'
import sortBy from 'lodash/sortBy'
import { useParams } from 'react-router-dom'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber.js'
import InputWithoutLabel from '../../../shared/InputWithoutLabel.jsx'
import Textarea from '../../../shared/Textarea.jsx'
import storeContext from '../../../../storeContext.js'
import Select from '../Select.jsx'
import deleteSchluessel from '../../../../src/deleteSchluessel.js'
import updateField from '../../../../src/updateField.js'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${(props) =>
    props['data-nosymbol'] ? '2fr 2fr 2fr 1fr' : '2fr 2fr 2fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  &:first-of-type {
    border-top: thin solid #cccccc;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Typ = styled.div`
  grid-column: 1 / span 1;
`
const Anlage = styled.div`
  grid-column: 2 / span 1;
`
const Bezeichnung = styled.div`
  grid-column: 3 / span 1;
`
const Nr = styled.div`
  grid-column: 4 / span 1;
`
const Delete = styled.div`
  grid-column: 5 / span 1;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  color: #ff8f00;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`

const SchluesselComponent = ({ id }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    showFilter,
    filterSchluessel,
    setFilter,
    schluesselTypWerte,
    schluesselAnlageWerte,
  } = store
  let schluessel
  if (showFilter) {
    schluessel = filterSchluessel
  } else {
    schluessel = store.schluessel.find((s) => s.id === id)
  }

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [schluessel?.id])

  const schluesselTypOptions = sortBy(schluesselTypWerte, ['sort', 'value'])
    .filter((w) => !!w.value)
    .map((w) => ({
      label: w.value,
      value: w.value,
    }))
  const schluesselAnlageOptions = sortBy(schluesselAnlageWerte, [
    'sort',
    'value',
  ])
    .filter((w) => !!w.value)
    .map((w) => ({
      label: w.value,
      value: w.value,
    }))

  const onBlur = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterSchluessel',
          value: { ...filterSchluessel, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'schluessel',
          parentModel: 'schluessel',
          field,
          value: newValue,
          id: schluessel?.id,
          setErrors,
          personId: +personId,
          store,
        })
      }
    },
    [showFilter, setFilter, filterSchluessel, schluessel?.id, personId, store],
  )
  const onChangeSelectSchluesselTyp = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterSchluessel',
          value: { ...filterSchluessel, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'schluessel',
          parentModel: 'schluessel',
          field,
          value: newValue,
          id,
          setErrors,
          personId: +personId,
          store,
        })
      }
    },
    [filterSchluessel, id, personId, setFilter, showFilter, store],
  )
  const onChangeSelectSchluesselAnlage = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterSchluessel',
          value: { ...filterSchluessel, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'schluessel',
          parentModel: 'schluessel',
          field,
          value: newValue,
          id,
          setErrors,
          personId: +personId,
          store,
        })
      }
    },
    [filterSchluessel, id, personId, setFilter, showFilter, store],
  )
  const onClickDelete = useCallback(
    () => deleteSchluessel({ id, personId: +personId, store }),
    [id, personId, store],
  )

  if (!schluessel) return null

  return (
    <Row key={`${id}`} data-nosymbol={showFilter}>
      <Typ>
        <Select
          key={`${id}typ`}
          value={schluessel.typ}
          field="typ"
          label="Typ"
          options={schluesselTypOptions}
          saveToDb={onChangeSelectSchluesselTyp}
          error={errors.typ}
        />
      </Typ>
      <Anlage>
        <Select
          key={`${id}anlage`}
          value={schluessel.anlage}
          field="anlage"
          label="Anlage"
          options={schluesselAnlageOptions}
          saveToDb={onChangeSelectSchluesselAnlage}
          error={errors.anlage}
        />
      </Anlage>
      <Bezeichnung>
        <Textarea
          key={`${id}bezeichnung`}
          value={schluessel.bezeichnung}
          field="bezeichnung"
          saveToDb={onBlur}
          error={errors.bezeichnung}
          marginBottom={0}
        />
      </Bezeichnung>
      <Nr>
        <InputWithoutLabel
          key={`${id}nr`}
          value={schluessel.nr}
          field="nr"
          saveToDb={onBlur}
          type="text"
          error={errors.nr}
        />
      </Nr>
      {!showFilter && (
        <>
          <Delete onClick={onClickDelete} id={`deleteSchluesselIcon${id}`}>
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteSchluesselIcon${id}`}
          >
            Schlüssel entfernen
          </UncontrolledTooltip>
        </>
      )}
    </Row>
  )
}

export default observer(SchluesselComponent)
