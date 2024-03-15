import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'
import { FaPlus } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import MobileAbo from './MobileAbo'
import storeContext from '../../../../storeContext'
import addMobileAbo from '../../../../src/addMobileAbo'

const Container = styled.div`
  border: none;
`
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${(props) =>
    props['data-nosymbol'] ? '1fr 1fr 1fr' : '1fr 1fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
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
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props.row ? '16px' : '8px !important')};
`
const PlusIcon = styled(FaPlus)`
  margin-top: -4px;
`

const MobileAbosComponent = ({ row = true }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, filterMobileAbo } = store
  let mobileAbos
  if (showFilter) {
    mobileAbos = [filterMobileAbo]
  } else {
    mobileAbos = store.mobileAbos.filter((s) => s.idPerson === +personId)
  }
  const mayAddNew =
    !showFilter &&
    (mobileAbos.length === 0 ||
      !mobileAbos.map((s) => s.name).some((n) => n === null))

  const Content = () => (
    <Container name="mobileAbo">
      {mobileAbos.length > 0 && (
        <Row data-nosymbol={showFilter}>
          <Typ>Typ</Typ>
          <Kostenstelle>Kostenstelle</Kostenstelle>
          <Bemerkungen>Bemerkungen</Bemerkungen>
          {!showFilter && <div />}
        </Row>
      )}
      {mobileAbos.map((mobileAbo) => (
        <MobileAbo
          key={mobileAbo.id || 'filter'}
          id={mobileAbo.id || 'filter'}
        />
      ))}
      {mayAddNew && (
        <StyledButton
          title="neues mobile Abo"
          onClick={() => addMobileAbo({ personId: +personId, store })}
          outline
        >
          <PlusIcon id={`plusIconMobileAbo${personId}`} />
        </StyledButton>
      )}
    </Container>
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for="mobileAbo" sm={2}>
            Mobile Abo
          </Label>
          <Col sm={10}>
            <Content />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for="mobileAbo">Mobile Abo</NonRowLabel>
          <Content />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(MobileAbosComponent)
