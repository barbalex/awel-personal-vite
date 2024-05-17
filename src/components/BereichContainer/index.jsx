import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Outlet, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import List from './List.jsx'
import fetchPersonen from '../../src/fetchPersonen.js'
import fetchBereiche from '../../src/fetchBereiche.js'
import fetchAbteilungen from '../../src/fetchAbteilungen.js'
import fetchWerte from '../../src/fetchWerte.js'
import storeContext from '../../storeContext.js'
import fetchBereich from '../../src/fetchBereich.js'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when BereichContainer is built
const Container = styled.div`
  height: calc(100vh - 56px);
  overflow: hidden;
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${(props) =>
    props['data-showfilter'] ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow-x: hidden !important;
  > div {
    height: unset !important;
  }
`

const BereichContainer = () => {
  const { bereichId: bereichIdInUrl = 0 } = useParams()
  const bereichId = +bereichIdInUrl

  const store = useContext(storeContext)
  const { showFilter, bereiche } = store
  const bereich = bereiche.find((p) => p.id === bereichId)
  // pass list the active bereich's props to enable instant updates
  const bereichJson = bereich ? bereich.toJSON() : {}

  useEffect(() => {
    fetchBereiche({ store })
    fetchAbteilungen({ store })
    fetchPersonen({ store })
    fetchWerte({ store, table: 'kostenstelleWerte' })
  }, [store])

  useEffect(() => {
    fetchBereich({ store, id: bereichId })
  }, [bereich, bereichId, store])

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
            <List {...bereichJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement data-showfilter={showFilter}>
            {!!bereichId && <Outlet context={[listRef]} />}
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(BereichContainer)
