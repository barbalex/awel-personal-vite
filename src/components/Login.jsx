import { useContext, useCallback, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FormGroup, Input, FormFeedback, Button } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

import storeContext from '../storeContext'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 20px !important;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
`
const P = styled.p`
  margin-left: auto;
  margin-right: auto;
  &:first-of-type {
    margin-bottom: 0;
  }
`
const StyledInput = styled(Input)`
  text-align: center;
`
const Feedback = styled(FormFeedback)`
  text-align: center;
`
const StyledButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`

const Login = () => {
  const store = useContext(storeContext)
  const { userIsLoggedIn, setUserIsLoggedIn, username, userPwd } = store

  const navigate = useNavigate()

  const inputRef = useRef()

  // const [pwd, setPwd] = useState()
  useEffect(() => {
    setTimeout(() => {
      console.log('effect, will focus inputRef:', inputRef.current)
      inputRef.current?.focus?.()
    })
  }, [])

  console.log('Login', {
    userPwd,
    userIsLoggedIn,
    inputRef: inputRef.current,
  })

  const [errorMsg, setErrorMsg] = useState()
  const [value, setValue] = useState('')

  const onChange = useCallback((e) => setValue(e.target.value), [])
  const onBlur = useCallback(() => {
    if (!value || value !== userPwd) {
      return setErrorMsg('Das Passwort ist falsch')
    }

    setErrorMsg(undefined)
    setUserIsLoggedIn(true)
    navigate('/Personen')
  }, [navigate, setUserIsLoggedIn, userPwd, value])

  // enable using enter key to submit
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onBlur()
      }
    }
    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [onBlur])

  if (!username) {
    return (
      <Container>{`Oh je. Ihr Benutzername konnte nicht ausgelesen werden. Daher ist eine Anmeldung nicht möglich.`}</Container>
    )
  }

  return (
    <Container>
      <P>{`Willkommen ${username}`}</P>
      <P>{`Bitte mit Passwort anmelden:`}</P>
      <StyledFormGroup>
        <StyledInput
          value={value}
          innerRef={inputRef}
          type="password"
          onChange={onChange}
          onBlur={onBlur}
          autoFocus
          invalid={!!errorMsg}
        />
        {!!errorMsg && <Feedback>{errorMsg}</Feedback>}
      </StyledFormGroup>
      <StyledButton
        color="primary"
        onClick={onBlur}
        block={false}
        outline={true}
      >
        anmelden
      </StyledButton>
    </Container>
  )
}

export default observer(Login)
