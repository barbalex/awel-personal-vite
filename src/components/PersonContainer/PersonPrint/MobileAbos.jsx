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
const Typ = styled.div`
  grid-column: 1 / span 1;
  font-size: smaller;
`
const Kostenstelle = styled.div`
  grid-column: 2 / span 1;
  font-size: smaller;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
  font-size: smaller;
`

const MobileAbos = () => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const mobileAbos = store.mobileAbos.filter((s) => s.idPerson === +personId)

  if (mobileAbos.length === 0) return null

  return (
    <>
      <Label>Mobile Abo</Label>
      <TitleRow>
        <Typ>Typ</Typ>
        <Kostenstelle>Kostenstelle</Kostenstelle>
        <Bemerkungen>Bemerkungen</Bemerkungen>
      </TitleRow>
      {mobileAbos.map((mobileAbo, index) => (
        <Row key={mobileAbo.id} index={index}>
          <Typ>
            <Value>{mobileAbo.typ}</Value>
          </Typ>
          <Kostenstelle>
            <Value>{mobileAbo.kostenstelle}</Value>
          </Kostenstelle>
          <Bemerkungen>
            <Value>{mobileAbo.bemerkungen}</Value>
          </Bemerkungen>
        </Row>
      ))}
    </>
  )
}

export default MobileAbos
