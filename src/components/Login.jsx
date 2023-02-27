import { useContext, useCallback, useState, useEffect } from 'react'
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
// Should focus input field on mount
// now renders only once
// but neither autoFocus nor ref.focus() work
// SOLVED. Reason was electron opening dev tools
const Login = () => {
  const store = useContext(storeContext)
  const { setUserIsLoggedIn, userName, userPwd } = store

  const navigate = useNavigate()

  // TODO: if no userPwd, inform
  // console.log('Login, userPwd:', { userPwd, userName })

  const [errorMsg, setErrorMsg] = useState()
  const [value, setValue] = useState('')

  const onChange = useCallback((e) => setValue(e.target.value), [])
  const onBlur = useCallback(() => {
    if (!!value && value !== userPwd) {
      // TODO: RESET
      return setErrorMsg(
        `Sie haben eingegeben: ${value}, das Passwort ist aber: ${userPwd}`,
      )
      // return setErrorMsg('Das Passwort ist falsch')
    }
    if (!value) {
      return setErrorMsg('Bitte Passwort eingeben')
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

  if (!userName) {
    return (
      <Container>{`Oh je. Ihr Benutzername konnte nicht ausgelesen werden. Daher ist eine Anmeldung nicht möglich.`}</Container>
    )
  }

  return (
    <Container>
      <P>{`Willkommen ${userName}`}</P>
      <P>{`Bitte mit Passwort anmelden:`}</P>
      <StyledFormGroup>
        <StyledInput
          value={value}
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
