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
    if (!user?.pwd) return

    window.electronAPI.decryptString(user.pwd).then((decrypted) => {
      setPwd(decrypted)
      setTimeout(() => {
        console.log('effect, inputRef.current', inputRef.current)
        inputRef.current.focus()
      })
    })
  }, [user?.pwd])

  console.log('Login', {
    pwd,
    user,
    userIsLoggedIn,
    inputRef: inputRef.current,
  })

  const [value, setValue] = useState('')
  const onChange = useCallback((e) => setValue(e.target.value), [])
  const onBlur = useCallback(() => {
    if (!value || value !== pwd) {
      return setErrorMsg('Das Passwort ist falsch')
    }

    setErrorMsg(undefined)
    setUserIsLoggedIn(true)
    navigate('/Personen')
  }, [navigate, pwd, setUserIsLoggedIn, value])

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
      <Container>{`Oh je. Ihr Benutzername konnte nicht ausgelesen werden. Daher ist die Anmeldung nicht möglich.`}</Container>
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
