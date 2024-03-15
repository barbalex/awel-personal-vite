import React, { useCallback } from 'react'
import { FormGroup, Label, FormFeedback, Col } from 'reactstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) =>
    props['data-margin-bottom'] !== undefined
      ? `${props['data-margin-bottom']}px !important`
      : props.row
        ? '16px'
        : '8px !important'};
  .react-datepicker-wrapper {
    width: 100%;
  }
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledDatePicker = styled(DatePicker)`
  height: 38px;
  width: 100%;
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  min-height: 34px;
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`
const dateFormat = [
  'dd.MM.yyyy',
  'd.MM.yyyy',
  'd.M.yyyy',
  'dd.M.yyyy',
  'dd.MM.yy',
  'd.MM.yy',
  'd.M.yy',
  'dd.M.yy',
  'd.M',
  'd.MM',
  'dd.M',
  'dd.MM',
  'd',
  'dd',
]

const DateField = ({
  value,
  field,
  label,
  saveToDb,
  error,
  row = true,
  popperPlacement = 'bottom',
  marginBottom = undefined,
}) => {
  const onChangeDatePicker = useCallback(
    (date) =>
      saveToDb({
        value: moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY'),
        field,
      }),
    [field, saveToDb],
  )
  const selected = moment(value, 'DD.MM.YYYY').isValid()
    ? new Date(moment(value, 'DD.MM.YYYY').toDate())
    : null

  // for popperPlacement see https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-361833919
  if (row) {
    return (
      <StyledFormGroup row={row} data-margin-bottom={marginBottom}>
        <Label for={field} sm={2}>
          {label}
        </Label>
        <Col sm={10}>
          <StyledDatePicker
            id={field}
            selected={selected}
            onChange={onChangeDatePicker}
            dateFormat={dateFormat}
            popperPlacement={popperPlacement}
          />
          <FormFeedback>{error}</FormFeedback>
        </Col>
      </StyledFormGroup>
    )
  }
  return (
    <StyledFormGroup row={row} data-margin-bottom={marginBottom}>
      {label && <NonRowLabel for={field}>{label}</NonRowLabel>}
      <StyledDatePicker
        id={field}
        selected={selected}
        onChange={onChangeDatePicker}
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
      />
      <FormFeedback>{error}</FormFeedback>
    </StyledFormGroup>
  )
}

export default observer(DateField)
