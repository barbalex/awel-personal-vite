import { useContext, useState, useCallback, useEffect } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown,
} from 'reactstrap'
import pick from 'lodash/pick'
import { observer } from 'mobx-react-lite'

import personenPrepareData from './personenPrepareData.js'
import personenKaderPrepareData from './personenKaderPrepareData.js'
import bereichePrepareData from './bereichePrepareData.js'
import sektionenPrepareData from './sektionenPrepareData.js'
import abteilungenPrepareData from './abteilungenPrepareData.js'
import aemterPrepareData from './aemterPrepareData.js'
import doExport from './doExport.js'
import storeContext from '../../../storeContext.js'
import fetchAemter from '../../../src/fetchAemter.js'
import fetchAbteilungen from '../../../src/fetchAbteilungen.js'
import fetchBereiche from '../../../src/fetchBereiche.js'
import fetchSektionen from '../../../src/fetchSektionen.js'

const adressenFields = ['name', 'vorname', 'adresse', 'plz', 'ort', 'land']

const Export = () => {
  const store = useContext(storeContext)
  const { personenSorted, personenFilteredSorted, addError } = store

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    fetchAemter({ store })
    fetchAbteilungen({ store })
    fetchBereiche({ store })
    fetchSektionen({ store })
  }, [store])

  const onClickExportPersonen = useCallback(() => {
    const exportObjects = personenPrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Personen',
    })
  }, [addError, store])
  const onClickExportAdressen = useCallback(() => {
    const exportObjects = personenFilteredSorted
      .slice()
      .map((p) => pick(p, adressenFields))
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [addError, personenFilteredSorted])
  const onClickExportAdressenAktive = useCallback(() => {
    const exportObjects = personenSorted
      .slice()
      .filter((p) => p.status === 'aktiv')
      // no deleted
      .filter((p) => p.deleted === 0)
      .map((p) => pick(p, adressenFields))
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [addError, personenSorted])
  const onClickExportAdressenPensionierte = useCallback(() => {
    const exportObjects = personenSorted
      .slice()
      .filter((p) => p.status === 'pensioniert')
      // no deleted
      .filter((p) => p.deleted === 0)
      .map((p) => pick(p, adressenFields))
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Adressen',
      sorting: { name: 1, vorname: 2, adresse: 3, plz: 4, ort: 5, land: 6 },
    })
  }, [addError, personenSorted])
  const onClickExportPersonenKader = useCallback(() => {
    const exportObjects = personenKaderPrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Kader',
      sorting: {
        name: 1,
        vorname: 2,
        amt: 3,
        abteilung: 4,
        sektion: 5,
        bereich: 6,
        kaderFunktionen: 7,
        funktionen: 8,
      },
    })
  }, [addError, store])

  const onClickExportBereiche = useCallback(() => {
    const exportObjects = bereichePrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Bereiche',
    })
  }, [addError, store])
  const onClickExportSektionen = useCallback(() => {
    const exportObjects = sektionenPrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Sektionen',
    })
  }, [addError, store])
  const onClickExportAbteilungen = useCallback(() => {
    const exportObjects = abteilungenPrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Abteilungen',
    })
  }, [addError, store])
  const onClickExportAemter = useCallback(() => {
    const exportObjects = aemterPrepareData({ store })
    if (!exportObjects.length) {
      return addError(new Error('Es gibt keine Daten zu exportieren'))
    }
    doExport({
      exportObjects,
      setModalOpen,
      setModalMessage,
      subject: 'Aemter',
    })
  }, [addError, store])
  const toggleModal = useCallback(() => setModalOpen(!modalOpen), [modalOpen])

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Exporte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem onClick={onClickExportPersonen}>
          Personen: alle Felder
        </DropdownItem>
        <DropdownItem onClick={onClickExportAdressen}>
          Personen: Adress-Felder
        </DropdownItem>
        <DropdownItem onClick={onClickExportBereiche}>Bereiche</DropdownItem>
        <DropdownItem onClick={onClickExportSektionen}>Sektionen</DropdownItem>
        <DropdownItem onClick={onClickExportAbteilungen}>
          Abteilungen
        </DropdownItem>
        <DropdownItem onClick={onClickExportAemter}>Ämter</DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem onClick={onClickExportAdressenAktive}>
          Adressen Aktive
        </DropdownItem>
        <DropdownItem onClick={onClickExportAdressenPensionierte}>
          Adressen Pensionierte
        </DropdownItem>
        <DropdownItem onClick={onClickExportPersonenKader}>Kader</DropdownItem>
      </DropdownMenu>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
