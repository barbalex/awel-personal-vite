import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import storeContext from '../../../storeContext.js'
import Page from './Page.jsx'

const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  /*
  * need defined height and overflow
  * to make the pages scrollable in UI
  * is removed in print
  */
  overflow-y: auto;
  height: 100vh;

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible !important;
    /* make sure body grows as needed */
    height: auto !important;
  }
`

const PersonPrintVerzKurzzeichenPages = () => {
  const store = useContext(storeContext)
  const { pages, modal, reset, building } = store.personVerzeichnis

  return (
    <ErrorBoundary>
      <Container className="printer-content">
        {pages.map((page, pageIndex) => (
          <Page key={pageIndex} pageIndex={pageIndex} />
        ))}
        <Modal isOpen={building}>
          <ModalBody>
            <p>{modal.textLine1}</p>
            <p>{modal.textLine2}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={reset} outline>
              abbrechen
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PersonPrintVerzKurzzeichenPages)
