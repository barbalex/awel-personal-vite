import { useContext } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext.js'

const Label = styled.label`
  font-size: smaller;
  margin-bottom: 0;
  color: grey;
`
const Value = styled.p`
  margin-bottom: 0;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  grid-gap: 5px;
  border-bottom: ${(props) =>
    props.index === 0 || props.index ? 'thin solid #dedede' : 'none'};
  border-top: ${(props) => (props.index === 0 ? 'thin solid #dedede' : 'none')};
`
const TitleRow = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  grid-gap: 5px;
  border-top: ${(props) => (props.index === 0 ? 'thin solid #dedede' : 'none')};
  color: rgba(146, 146, 146, 1);
`
const Typ = styled.div`
  grid-column: 1 / span 1;
  font-size: smaller;
`
const Anlage = styled.div`
  grid-column: 2 / span 1;
  font-size: smaller;
`
const Bezeichnung = styled.div`
  grid-column: 3 / span 1;
  font-size: smaller;
`
const Nr = styled.div`
  grid-column: 4 / span 1;
  font-size: smaller;
`

export const Schluessels = observer(() => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const schluessels = store.schluessel.filter((s) => s.idPerson === +personId)

  if (schluessels.length === 0) return null

  return (
    <>
      <Label>Schlüssel</Label>
      <TitleRow>
        <Typ>Typ</Typ>
        <Anlage>Anlage</Anlage>
        <Bezeichnung>Bezeichung</Bezeichnung>
        <Nr>Nr.</Nr>
      </TitleRow>
      {schluessels.map((schluessel, index) => (
        <Row
          key={schluessel.id}
          index={index}
        >
          <Typ>
            <Value>{schluessel.typ}</Value>
          </Typ>
          <Anlage>
            <Value>{schluessel.anlage}</Value>
          </Anlage>
          <Bezeichnung>
            <Value>{schluessel.bezeichnung}</Value>
          </Bezeichnung>
          <Nr>
            <Value>{schluessel.nr}</Value>
          </Nr>
        </Row>
      ))}
    </>
  )
})
