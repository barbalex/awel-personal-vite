import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams, Outlet } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import List from './List'
import fetchAemter from '../../src/fetchAemter'
import fetchAbteilungen from '../../src/fetchAbteilungen'
import fetchWerte from '../../src/fetchWerte'
import storeContext from '../../storeContext'
import fetchAbteilung from '../../src/fetchAbteilung'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when AbteilungContainer is built
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

const AbteilungContainer = () => {
  const { abteilungId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, abteilungen } = store
  const abteilung = abteilungen.find((p) => p.id === +abteilungId)
  // pass list the active abteilung's props to enable instant updates
  const abteilungJson = abteilung ? abteilung.toJSON() : {}

  useEffect(() => {
    fetchAbteilungen({ store })
    fetchAemter({ store })
    fetchWerte({ store, table: 'kostenstelleWerte' })
  }, [store])

  useEffect(() => {
    fetchAbteilung({ store, id: abteilungId })
  }, [abteilungId, store])

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
            <List {...abteilungJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement showfilter={showFilter}>
            {abteilungId && <Outlet context={[listRef]} />}
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(AbteilungContainer)
