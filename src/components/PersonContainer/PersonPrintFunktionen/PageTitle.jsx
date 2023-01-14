import React, { useContext, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Input } from 'reactstrap'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledTitle = styled.h4`
  cursor: pointer;
  margin-top: -5px;
  margin-bottom: 5px;
  font-size: 1.5em;
  font-family: Arial Black;
`

const PageTitle = ({ page }) => {
  const store = useContext(storeContext)
  const { title, setTitle } = store.personPages

  const [edit, setEdit] = useState(title ? false : true)

  const onClickTitle = useCallback(() => setEdit(true), [])
  const onChange = useCallback(e => setTitle(e.target.value || ''), [setTitle])
  const onBlur = useCallback(() => setEdit(false), [])
  const onKeyPress = useCallback(
    e => {
      if (e.key === 'Enter') {
        onBlur(e)
      }
    },
    [onBlur],
  )

  return (
    <Container>
      {edit && !store.printing ? (
        <Input
          type="text"
          placeholder="Titel erfassen"
          value={title}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
        />
      ) : (
        <StyledTitle onClick={onClickTitle}>{title}</StyledTitle>
      )}
    </Container>
  )
}

export default observer(PageTitle)
