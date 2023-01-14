import React, { useContext } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import storeContext from '../../../storeContext'

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
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
  border-bottom: ${(props) =>
    props.index === 0 || props.index ? 'thin solid #dedede' : 'none'};
  border-top: ${(props) => (props.index === 0 ? 'thin solid #dedede' : 'none')};
`
const TitleRow = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
  border-top: ${(props) => (props.index === 0 ? 'thin solid #dedede' : 'none')};
  color: rgba(146, 146, 146, 1);
`
const Nr = styled.div`
  grid-column: 1 / span 1;
  font-size: smaller;
`
const Typ = styled.div`
  grid-column: 2 / span 1;
  font-size: smaller;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
  font-size: smaller;
`

const Telefones = () => {
  const { personId } = useParams()

  const store = useContext(storeContext)
  const telefones = store.telefones.filter((s) => s.idPerson === +personId)

  if (telefones.length === 0) return null

  return (
    <>
      <Label>Telefon</Label>
      <TitleRow>
        <Nr>Nr.</Nr>
        <Typ>Typ</Typ>
        <Bemerkungen>Bemerkungen</Bemerkungen>
      </TitleRow>
      {telefones.map((telefon, index) => (
        <Row key={telefon.id} index={index}>
          <Nr>
            <Value>{telefon.nr}</Value>
          </Nr>
          <Typ>
            <Value>{telefon.typ}</Value>
          </Typ>
          <Bemerkungen>
            <Value>{telefon.bemerkungen}</Value>
          </Bemerkungen>
        </Row>
      ))}
    </>
  )
}

export default Telefones
