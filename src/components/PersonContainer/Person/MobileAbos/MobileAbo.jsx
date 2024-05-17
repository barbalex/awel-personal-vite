import React, { useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import { FaTimes } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import Select from '../Select'
import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber.js'
import Textarea from '../../../shared/Textarea'
import storeContext from '../../../../storeContext'
import deleteMobileAbo from '../../../../src/deleteMobileAbo'
import updateField from '../../../../src/updateField'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${(props) =>
    props['data-nosymbol'] ? '1fr 1fr 1fr' : '1fr 1fr 1fr 20px'};
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
const Kostenstelle = styled.div`
  grid-column: 2 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
`
const DeleteContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const Delete = styled.div`
  grid-column: 3 / span 1;
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

const MobileAbo = ({ id }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    showFilter,
    mobileAbos,
    mobileAboTypWerte,
    mobileAboKostenstelleWerte,
    filterMobileAbo,
    setFilter,
  } = store
  let mobileAbo
  if (showFilter) {
    mobileAbo = filterMobileAbo
  } else {
    mobileAbo = mobileAbos.find((s) => s.id === id)
  }

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [mobileAbo.id])

  const mobileAboTypOptions = sortBy(mobileAboTypWerte, ['sort', 'value'])
    .filter((w) => !!w.value)
    .map((w) => ({
      label: w.value,
      value: w.value,
    }))
  const mobileAboKostenstelleOptions = sortBy(mobileAboKostenstelleWerte, [
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
          model: 'filterMobileAbo',
          value: { ...filterMobileAbo, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'mobileAbos',
          parentModel: 'mobileAbos',
          field,
          value: newValue,
          id,
          setErrors,
          personId: +personId,
          store,
        })
      }
    },
    [filterMobileAbo, id, personId, setFilter, showFilter, store],
  )
  const onChangeSelect = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterMobileAbo',
          value: { ...filterMobileAbo, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'mobileAbos',
          parentModel: 'mobileAbos',
          field,
          value: newValue,
          id,
          setErrors,
          personId: +personId,
          store,
        })
      }
    },
    [filterMobileAbo, id, personId, setFilter, showFilter, store],
  )
  const onClickDelete = useCallback(
    () => deleteMobileAbo({ id, personId: +personId, store }),
    [id, personId, store],
  )

  return (
    <Row key={`${id}`} data-nosymbol={showFilter}>
      <Typ>
        <Select
          key={`${id}typ`}
          value={mobileAbo.typ}
          field="typ"
          label="Typ"
          options={mobileAboTypOptions}
          saveToDb={onChangeSelect}
          error={errors.typ}
        />
      </Typ>
      <Kostenstelle>
        <Select
          key={`${id}kostenstelle`}
          value={mobileAbo.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={mobileAboKostenstelleOptions}
          saveToDb={onChangeSelect}
          error={errors.kostenstelle}
        />
      </Kostenstelle>
      <Bemerkungen>
        <Textarea
          key={`${id}bemerkungen`}
          value={mobileAbo.bemerkungen}
          field="bemerkungen"
          saveToDb={onBlur}
          error={errors.bemerkungen}
          marginBottom={0}
        />
      </Bemerkungen>
      {!showFilter && (
        <DeleteContainer>
          <Delete onClick={onClickDelete} id={`deleteMobileAboIcon${id}`}>
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteMobileAboIcon${id}`}
          >
            mobile Abo entfernen
          </UncontrolledTooltip>
        </DeleteContainer>
      )}
    </Row>
  )
}

export default observer(MobileAbo)
