import { useContext, useCallback, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FormGroup, Input, FormFeedback, Button } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

import storeContext from '../storeContext'
import fetchUser from '../src/fetchUserByName'

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
  const { userIsLoggedIn, setUserIsLoggedIn, username } = store

  const navigate = useNavigate()

  const [user, setUser] = useState()
  useEffect(() => {
    fetchUser({ store }).then((user) => setUser(user))
  }, [store])

  const [errorMsg, setErrorMsg] = useState()

  const inputRef = useRef(null)

  const [pwd, setPwd] = useState()
  useEffect(() => {
    if (!user?.pwd) {
      console.log('effect, no pwd')
      return /*setPwd('')*/
    }
    window.electronAPI.decryptString(user.pwd).then((decrypted) => {
      setPwd(decrypted)
      console.log('effect, inputRef.current', inputRef.current)
      setTimeout(() => inputRef.current.focus())
    })
  }, [user?.pwd])

  console.log('Login', {
    pwd,
    user,
    errorMsg,
    errorMsgExists: !!errorMsg,
    userIsLoggedIn,
    inputRef: inputRef.current,
  })

  // const callbackRef = useCallback((inputElement) => {
  //   if (inputElement) {
  //     inputElement.focus()
  //   }
  // }, [])

  const onBlur = useCallback(
    (e) => {
      console.log('value:', { value: e.target.value, pwd })
      if (!e.target.value || e.target.value !== pwd) {
        console.log('Das Passwort ist falsch')
        return setErrorMsg('Das Passwort ist falsch')
      }

      setErrorMsg(undefined)
      setUserIsLoggedIn(true)
      navigate('/Personen')
    },
    [navigate, pwd, setUserIsLoggedIn],
  )

  if (!username) {
    return (
      <Container>{`Oh je. Ihr Benutzername konnte nicht ausgelesen werden. Daher ist die Anmeldung nicht möglich.`}</Container>
    )
  }

  return (
    <Container>
      <P>{`Willkommen ${username}`}</P>
      <P>{`Bitte mit Passwort anmelden:`}</P>
      <StyledFormGroup>
        <StyledInput
          id="thisfuckinginput"
          innerRef={inputRef}
          type="password"
          onBlur={onBlur}
          autoFocus
          invalid={!!errorMsg}
        />
        {!!errorMsg && <Feedback>{errorMsg}</Feedback>}
      </StyledFormGroup>
      <StyledButton
        color="primary"
        onClick={() => console.log('clicked')}
        block={false}
        outline={true}
      >
        anmelden
      </StyledButton>
    </Container>
  )
}

export default observer(Login)
