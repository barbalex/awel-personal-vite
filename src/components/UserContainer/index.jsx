import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Outlet, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import List from './List'
import fetchUsers from '../../src/fetchUsers'
import storeContext from '../../storeContext'
import fetchUser from '../../src/fetchUser'

// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${(props) =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow-x: hidden !important;
  > div {
    height: unset !important;
  }
`

const UserContainer = () => {
  const { userId = 0 } = useParams()
  const store = useContext(storeContext)
  const { showFilter, users } = store
  const user = users.find((p) => p.id === +userId)
  // pass list the active amt's props to enable instant updates
  const userJson = user ? user.toJSON() : {}

  useEffect(() => {
    fetchUsers({ store })
  }, [store])

  useEffect(() => {
    fetchUser({ store, id: userId })
  }, [userId, store])

  const listRef = useRef(null)

  return (
    <ErrorBoundary>
      <ReflexContainer orientation="vertical">
        <ReflexElement
          flex={0.25}
          propagateDimensions
          renderOnResizeRate={100}
          renderOnResize
        >
          <List {...userJson} listRef={listRef} />
        </ReflexElement>
        <ReflexSplitter />
        <StyledReflexElement showfilter={showFilter}>
          {!!userId && <Outlet context={[listRef]} />}
        </StyledReflexElement>
      </ReflexContainer>
    </ErrorBoundary>
  )
}

export default observer(UserContainer)
