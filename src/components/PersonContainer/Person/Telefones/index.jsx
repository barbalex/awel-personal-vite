import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'
import { FaPlus } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import Telefon from './Telefon'
import storeContext from '../../../../storeContext'

const Container = styled.div``
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 180px 160px 1fr 20px;
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Nr = styled.div`
  grid-column: 1 / span 1;
`
const Typ = styled.div`
  grid-column: 2 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props.row ? '16px' : '8px !important')};
`
const PlusIcon = styled(FaPlus)`
  margin-top: -4px;
`

const TelefonesComponent = ({ row = true }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, filterTelefon, addTelefon } = store
  let telefones
  if (showFilter) {
    telefones = [filterTelefon]
  } else {
    telefones = store.telefones.filter((s) => s.idPerson === +personId)
  }
  const mayAddNew =
    !showFilter &&
    (telefones.length === 0 ||
      !telefones.map((s) => s.name).some((n) => n === null))
  const Content = () => (
    <Container name="telefone">
      {telefones.length > 0 && (
        <Row>
          <Nr>Nr.</Nr>
          <Typ>Typ</Typ>
          <Bemerkungen>Bemerkungen</Bemerkungen>
          <div />
        </Row>
      )}
      {telefones.map((telefone) => (
        <Telefon key={telefone.id || 'filter'} id={telefone.id || 'filter'} />
      ))}
      {mayAddNew && (
        <StyledButton
          title="neues Telefon"
          onClick={() => addTelefon(+personId)}
          outline
        >
          <PlusIcon id={`plusIconTelefon${personId}`} />
        </StyledButton>
      )}
    </Container>
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for="telefone" sm={2}>
            Telefon
          </Label>
          <Col sm={10}>
            <Content />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for="telefone">Telefon</NonRowLabel>
          <Content />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(TelefonesComponent)
