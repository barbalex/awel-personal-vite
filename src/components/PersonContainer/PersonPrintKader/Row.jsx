import { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext.js'

const Field = styled.div`
  flex: 1;
  padding: 2px;
`
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 3px;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
  /* get background colors to show */
  @media print {
    -webkit-print-color-adjust: exact;
  }
  page-break-inside: avoid !important;
`

function isOdd(num) {
  return num % 2
}

const PersonRow = ({ p, i }) => {
  const store = useContext(storeContext)
  const {
    abteilungen,
    sektionen,
    bereiche,
    funktionen,
    kaderFunktionen,
  } = store
  const abteilung = p.abteilung
    ? abteilungen.find(a => a.id === p.abteilung)
    : null
  const abteilungName = abteilung && abteilung.name ? abteilung.name : ''
  const sektion = p.sektion ? sektionen.find(a => a.id === p.sektion) : null
  const sektionName = sektion && sektion.name ? sektion.name : ''
  const bereich = p.bereich ? bereiche.find(a => a.id === p.bereich) : null
  const bereichName = bereich && bereich.name ? bereich.name : ''

  return (
    <Row key={p.id} shaded={!isOdd(i)}>
      <Field>{p.name || ''}</Field>
      <Field>{p.vorname || ''}</Field>
      <Field>{abteilungName}</Field>
      <Field>{sektionName}</Field>
      <Field>{bereichName}</Field>
      <Field>
        {funktionen
          .filter(f => f.idPerson === p.id)
          .filter(f => f.deleted === 0)
          .map(f => f.funktion)
          .join(', ')}
      </Field>
      <Field>
        {kaderFunktionen
          .filter(f => f.idPerson === p.id)
          .filter(f => f.deleted === 0)
          .map(f => f.funktion)
          .join(', ')}
      </Field>
    </Row>
  )
}

export default observer(PersonRow)
