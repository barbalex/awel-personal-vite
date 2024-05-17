import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import ErrorBoundary from './shared/ErrorBoundary.jsx'
import storeContext from '../storeContext'

const DeletionModal = () => {
  const store = useContext(storeContext)
  const {
    deletionCallback,
    setDeletionCallback,
    setDeletionTitle,
    setDeletionMessage,
  } = store

  const remove = useCallback(() => {
    deletionCallback()
    setDeletionCallback(null)
    setDeletionTitle(null)
    setDeletionMessage(null)
  }, [
    deletionCallback,
    setDeletionCallback,
    setDeletionMessage,
    setDeletionTitle,
  ])
  const close = useCallback(() => {
    setDeletionCallback(null)
    setDeletionTitle(null)
    setDeletionMessage(null)
  }, [setDeletionCallback, setDeletionMessage, setDeletionTitle])

  return (
    <ErrorBoundary>
      <Modal isOpen={!!store.deletionMessage} toggle={close}>
        <ModalHeader toggle={close}>{store.deletionTitle}</ModalHeader>
        <ModalBody>{store.deletionMessage}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={remove} outline>
            ja
          </Button>
          <Button color="secondary" onClick={close} outline>
            nein
          </Button>
        </ModalFooter>
      </Modal>
    </ErrorBoundary>
  )
}

export default observer(DeletionModal)
