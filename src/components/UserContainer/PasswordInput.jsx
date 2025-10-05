import { useContext, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import styled from 'styled-components'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric'

import storeContext from '../../storeContext.js'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 16px !important;
`
const Checks = styled.div`
  padding: 5px 5px 5px 0;
`

const SharedInput = ({
  value,
  saveToDb,
  onChange: onChangePassed,
  error,
  user,
}) => {
  const store = useContext(storeContext)
  const { showFilter, setDirty } = store
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )
  // console.warn('PasswordInput', { value, stateValue, user })

  const onBlur = useCallback(
    async (event) => {
      let newValue = event.target.value
      if (newValue) {
        // encrypt password
        newValue = await window.electronAPI.encryptString(newValue)
      }
      saveToDb({ value: newValue, field: 'pwd' })
      setDirty(false)
    },
    [saveToDb, setDirty],
  )
  const onChange = useCallback(
    (event) => {
      if (onChangePassed && !showFilter) onChangePassed(event.target.value)
      setStateValue(event.target.value)
      if (event.target.value !== value) setDirty(true)
      if (showFilter) {
        // call onBlur to immediately update filters
        onBlur(event)
      }
    },
    [onBlur, onChangePassed, setDirty, showFilter, value],
  )

  // need this check because of filtering:
  // when filter is emptied, value needs to reset
  useEffect(() => {
    setStateValue(value || value === 0 ? value : '')
  }, [value])

  const hasLetter = useCallback(
    () => /[a-zA-Z]/g.test(stateValue),
    [stateValue],
  )
  const hasUppercase = useCallback(
    () => stateValue?.toLowerCase?.() !== stateValue,
    [stateValue],
  )
  const hasLowercase = useCallback(
    () => stateValue?.toUpperCase?.() !== stateValue,
    [stateValue],
  )
  // https://stackoverflow.com/a/28813213/712005
  const hasNumber = useCallback(() => /\d/.test(stateValue), [stateValue])
  const hasSpecial = useCallback(
    () =>
      typeof stateValue === 'string' && !isAlphanumeric(stateValue, 'de-DE'),
    [stateValue],
  )
  const minLength = user?.isAdmin ? 12 : 8
  const hasMinLength = useCallback(
    () => stateValue?.length >= minLength,
    [minLength, stateValue?.length],
  )

  return (
    <StyledFormGroup row>
      <Label for="pwd" sm={2}>
        Passwort
      </Label>
      <Col sm={10}>
        <Input
          id="pwd"
          type="text"
          name="pwd"
          value={stateValue}
          onChange={onChange}
          onBlur={onBlur}
          invalid={!!error}
          spellCheck={false}
        />
        <FormFeedback>{error}</FormFeedback>
        {!!(stateValue ?? '').length && (
          <Checks>
            <div>Anforderungen:</div>
            <div>{`${hasLetter() ? '✅' : '⛔️'} Enthält Buchstaben`}</div>
            <div>{`${
              hasUppercase() ? '✅' : '⛔️'
            } Enthält Gross-Buchstaben`}</div>
            <div>{`${
              hasLowercase() ? '✅' : '⛔️'
            } Enthält Klein-Buchstaben`}</div>
            <div>{`${hasNumber() ? '✅' : '⛔️'} Enthält Nummern`}</div>
            <div>{`${hasSpecial() ? '✅' : '⛔️'} Enthält Sonderzeichen`}</div>
            <div>{`${
              hasMinLength() ? '✅' : '⛔️'
            } Enthält mindestens ${minLength} Zeichen`}</div>
          </Checks>
        )}
      </Col>
    </StyledFormGroup>
  )
}

export default observer(SharedInput)
