import React, { useState, useCallback } from 'react'
import { Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import Textarea from './Textarea'
import Date from './Date'

const Container = styled.div`
  grid-column: 1;
  display: flex;
  margin-bottom: 8px;
`
const Label = styled.div`
  width: calc(16.667% + 8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Data = styled.div`
  display: flex;
  width: calc(83.332% - 8px);
  align-items: center;
`
const StyledInput = styled(Input)`
  position: relative !important;
  margin-left: 0 !important;
  margin-right: 10px;
  top: -2px;
  /* larger-sized Checkboxes */
  -webkit-transform: scale(1.5);
`
const DateContainer = styled.div`
  width: 95px;
`
const MutationBemerkungContainer = styled.div`
  flex-grow: 1;
  padding-left: 8px;
`

const Handlungsbedarf = ({
  mutationFristValue,
  mutationBemerkungValue,
  mutationNoetigValue,
  label,
  saveToDb,
  errorMutationNoetig,
  errorMutationFrist,
  errorMutationBemerkung,
}) => {
  const [mutationNoetigStateValue, setMutationNoetigStateValue] = useState(
    !!mutationNoetigValue,
  )
  const onChangeMutationNoetig = useCallback(() => {
    const newValue = !mutationNoetigStateValue
    saveToDb({ value: newValue ? 1 : 0, field: 'mutationNoetig' })
    return setMutationNoetigStateValue(newValue)
  }, [mutationNoetigStateValue, saveToDb])

  return (
    <Container>
      <Label htmlFor="mutationNoetig" sm={2}>
        {label}
      </Label>
      <Data>
        <StyledInput
          id="mutationNoetig"
          type="checkbox"
          checked={mutationNoetigValue === 1}
          onChange={onChangeMutationNoetig}
          invalid={!!errorMutationNoetig}
          title="Besteht Handlungsbedarf?"
        />
        <DateContainer>
          <Date
            value={mutationFristValue}
            field="mutationFrist"
            saveToDb={saveToDb}
            error={errorMutationFrist}
            row={false}
            marginBottom={0}
          />
        </DateContainer>
        <MutationBemerkungContainer>
          <Textarea
            id="mutationBemerkung"
            value={mutationBemerkungValue}
            field="mutationBemerkung"
            saveToDb={saveToDb}
            error={errorMutationBemerkung}
            title="Bemerkung zum Handlungsbedarf"
            marginBottom={0}
          />
        </MutationBemerkungContainer>
      </Data>
    </Container>
  )
}

export default observer(Handlungsbedarf)
