import React, { useEffect, useContext, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import Data from './Data'
import List from './List'
import fetchWerte from '../../src/fetchWerte'
import storeContext from '../../storeContext'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when StammdatenContainer is built
const Container = styled.div`
  height: calc(100% - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  > div {
    height: unset !important;
  }
`

const StammdatenContainer = () => {
  const { tableName, tableId } = useParams()

  const store = useContext(storeContext)

  const data = store[tableName]
  const dat = data.find((d) => d.id === +tableId)

  // pass list the active dat's props to enable instant updates
  const datJson = dat || {}

  useEffect(() => {
    fetchWerte({ store, table: 'statusWerte' })
    fetchWerte({ store, table: 'anredeWerte' })
    fetchWerte({ store, table: 'kostenstelleWerte' })
    fetchWerte({ store, table: 'mobileAboTypWerte' })
    fetchWerte({ store, table: 'telefonTypWerte' })
    fetchWerte({ store, table: 'schluesselTypWerte' })
    fetchWerte({ store, table: 'schluesselAnlageWerte' })
    fetchWerte({ store, table: 'funktionWerte' })
    fetchWerte({ store, table: 'kaderFunktionWerte' })
    fetchWerte({ store, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ store, table: 'etikettWerte' })
    fetchWerte({ store, table: 'anwesenheitstagWerte' })
    fetchWerte({ store, table: 'landWerte' })
    fetchWerte({ store, table: 'mutationArtWerte' })
    fetchWerte({ store, table: 'standortWerte' })
  }, [store])

  const listRef = useRef(null)

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.33}
            propagateDimensions
            renderOnResizeRate={100}
            renderOnResize
          >
            <List {...datJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement>
            {!!tableId && <Data listRef={listRef} />}
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(StammdatenContainer)
