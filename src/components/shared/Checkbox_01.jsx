import { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
} from 'reactstrap'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  position: relative;
  top: ${(props) => (props['data-row'] ? '8px' : '1px')};
  padding: 10px;
`
const LabelSpan = styled.span`
  padding-left: 5px;
`

const SharedCheckbox = ({
  value,
  field,
  label,
  saveToDb,
  error,
  formText = undefined,
  row = true,
  disabled = false,
}) => {
  const [stateValue, setStateValue] = useState(!!value)
  const onChange = useCallback(() => {
    const newValue = !stateValue
    saveToDb({ value: newValue ? 1 : 0, field })
    return setStateValue(newValue)
  }, [stateValue, saveToDb, field])

  useEffect(() => {
    setStateValue(!!value)
  }, [value])

  if (row) {
    return (
      <FormGroup row>
        <Label for={field} sm={2}>
          {label}
        </Label>
        <Col sm={10}>
          <FormGroup check>
            <StyledInput
              id={field}
              type="checkbox"
              checked={value === 1}
              onChange={onChange}
              invalid={!!error}
              data-row={row}
              disabled={disabled}
            />
          </FormGroup>
          <FormFeedback>{error}</FormFeedback>
          {!!formText && <FormText>{formText}</FormText>}
        </Col>
      </FormGroup>
    )
  }

  return (
    <FormGroup check>
      <Label check>
        <StyledInput
          id={field}
          type="checkbox"
          checked={value === 1}
          onChange={onChange}
          invalid={!!error}
          data-row={row}
          disabled={disabled}
        />
        {!row && <LabelSpan>{` ${label}`}</LabelSpan>}
      </Label>
      <FormFeedback>{error}</FormFeedback>
      {!!(<FormText>{formText}</FormText>)}
    </FormGroup>
  )
}

export default observer(SharedCheckbox)
