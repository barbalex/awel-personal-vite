import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams, Outlet } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import List from './List.jsx'
import fetchPersonen from '../../src/fetchPersonen.js'
import fetchSektionen from '../../src/fetchSektionen.js'
import fetchAbteilungen from '../../src/fetchAbteilungen.js'
import fetchWerte from '../../src/fetchWerte.js'
import storeContext from '../../storeContext.js'
import fetchSektion from '../../src/fetchSektion.js'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when SektionContainer is built
const Container = styled.div`
  height: calc(100vh - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${(props) =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow-x: hidden !important;
  > div {
    height: unset !important;
  }
`

const SektionContainer = () => {
  const { sektionId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, sektionen } = store
  const sektion = sektionen.find((p) => p.id === +sektionId)
  // pass list the active sektion's props to enable instant updates
  const sektionJson = sektion ? sektion.toJSON() : {}

  useEffect(() => {
    fetchSektionen({ store })
    fetchAbteilungen({ store })
    fetchPersonen({ store })
    fetchWerte({ store, table: 'kostenstelleWerte' })
  }, [store])

  useEffect(() => {
    fetchSektion({ store, id: sektionId })
  }, [sektion, sektionId, store])

  const listRef = useRef(null)

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.25}
            propagateDimensions
            renderOnResizeRate={100}
            renderOnResize
          >
            <List {...sektionJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement showfilter={showFilter}>
            {sektionId && <Outlet context={[listRef]} />}
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(SektionContainer)
