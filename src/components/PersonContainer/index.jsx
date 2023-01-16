import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Outlet, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary'
import List from './List'
import storeContext from '../../storeContext'
import Navbar from '../Navbar'
import useDetectPrint from '../../src/useDetectPrint'
import fetchPerson from '../../src/fetchPerson'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built
const Container = styled.div`
  /* height: calc(100vh - 58px); */
  height: 100%;
  display: flex;
  flex-direction: column;
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${(props) =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow: hidden !important;
  /* > div {
    height: unset !important;
  } */
  .tab-content {
    height: calc(100% - 42px);
  }
`

const PersonContainer = () => {
  const { personId: personidInUrl = 0 } = useParams()
  const personId = personidInUrl ? +personidInUrl : undefined

  const store = useContext(storeContext)
  const { showFilter, personen } = store
  const person = personen.find((p) => p.id === personId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}
  const isPrinting = useDetectPrint()

  const listRef = useRef(null)

  useEffect(() => {
    fetchPerson({ store, id: personId })
  }, [person, personId, store])

  return (
    <Container>
      <Navbar />
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={isPrinting ? 0 : 0.25}
            propagateDimensions
            propagateDimensionsRate={100}
          >
            <List {...personJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement
            showfilter={showFilter}
            propagateDimensions
            propagateDimensionsRate={1000}
            resizeHeight={false}
          >
            <Outlet context={[listRef]} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(PersonContainer)
