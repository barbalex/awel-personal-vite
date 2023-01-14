import React from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import styled from 'styled-components'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props['data-row'] ? 'unset' : '2px !important')};
  padding-left: ${(props) =>
    props['data-padleft'] ? `${props['data-padleft']}px` : 'unset'};
  display: flex;
`
const StyledLabel = styled(Label)`
  padding-left: 0;
`
const Value = styled.div`
  padding-top: 7px;
`

moment.locale('de')

const Zuletzt = ({ padleft = 0, row }) => (
  <StyledFormGroup data-padleft={padleft}>
    <StyledLabel for="letzteAenderung" sm={2}>
      Zuletzt geändert
    </StyledLabel>
    <Col sm={10}>
      <Value name="letzteAenderung">
        {`${
          row
            ? moment.unix(row.letzteMutationZeit / 1000).isValid()
              ? moment
                  .unix(row.letzteMutationZeit / 1000)
                  .format('DD.MM.YYYY H:mm:ss')
              : ''
            : ''
        }, ${row.letzteMutationUser || ''}`}
      </Value>
    </Col>
  </StyledFormGroup>
)

export default Zuletzt
