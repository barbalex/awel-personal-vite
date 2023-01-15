import React, { useContext, useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import storeContext from '../../storeContext'

const StyledUncontrolledDropdown = styled(UncontrolledDropdown)`
  display: flex;
  border: ${(props) =>
    props.active ? '1px solid rgb(255, 255, 255, .5)' : 'unset'};
  border-radius: 0.25rem;
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  border: unset !important;
`

const Berichte = () => {
  const navigate = useNavigate()
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    setPrinting,
    activePrintForm,
    setActivePrintForm,
    resetActivePrintForm,
    setFilter,
    emptyFilter,
    setFilterPersonKader,
    setFilterPersonAktivJetztMitTel,
    setFilterPersonAktivJetztMitMobiltel,
    setFilterPersonAktivJetztMitKurzzeichen,
    settings,
  } = store
  const showPD = !!+personId

  const onClickPD = useCallback(
    () => setActivePrintForm('personalblatt'),
    [setActivePrintForm],
  )
  const onClickMutationsFormular = useCallback(
    () => setActivePrintForm('personMutation'),
    [setActivePrintForm],
  )
  const onClickPrint = useCallback(() => {
    setPrinting(true)
    setTimeout(async () => {
      window.print()
      setPrinting(false)
    })
  }, [setPrinting])
  const onClickCreatePdf = useCallback(() => {
    const printToPDFOptions = {
      marginsType: 0,
      printBackground: true,
    }
    const isPersonMutation = !!+personId && activePrintForm === 'personMutation'
    const dialogOptions = {
      title: 'pdf speichern',
      filters: [
        {
          name: 'pdf',
          extensions: ['pdf'],
        },
      ],
    }
    if (isPersonMutation && !!settings.mutationFormPath) {
      dialogOptions.defaultPath = settings.mutationFormPath
    }

    setPrinting(true)
    setTimeout(async () => {
      try {
        await window.electronAPI.printToPdf(printToPDFOptions, dialogOptions)
      } catch (error) {
        console.log('print-to-pdf ERROR', error)
        setPrinting(false)
        resetActivePrintForm()
        throw new Error({ message: error })
      }

      // await ipcRenderer.invoke('print-to-pdf', printToPDFOptions, dialogOptions)
      // ipcRenderer.once('ERROR', (error) => {
      //   console.log('print-to-pdf ERROR', error)
      //   setPrinting(false)
      //   resetActivePrintForm()
      //   throw new Error(error)
      // })
      // ipcRenderer.once('PRINTED-TO-PDF', () => {
      //   console.log('print-to-pdf PRINTED-TO-PDF')
      //   setPrinting(false)
      //   resetActivePrintForm()
      // })
      console.log('pdf print is over')
      setPrinting(false)
      resetActivePrintForm()
    })
  }, [
    activePrintForm,
    personId,
    resetActivePrintForm,
    setPrinting,
    settings.mutationFormPath,
  ])

  return (
    <StyledUncontrolledDropdown nav inNavbar active={!!activePrintForm}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            setActivePrintForm('personFunktionen')
            store.personPages.initiate()
          }}
        >
          Personen: Funktionen
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem header>Vorbereitete: setzen eigenen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            emptyFilter()
            setFilterPersonKader(true)
            setTimeout(() => {
              setActivePrintForm('personKader')
              store.personPages.initiate()
            }, 1000)
          }}
        >
          Personen: Kader
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            emptyFilter()
            setFilter({
              model: 'filterPerson',
              value: { status: 'pensioniert' },
            })
            setTimeout(() => {
              setActivePrintForm('personPensionierte')
              store.personPages.initiate()
            }, 1000)
          }}
        >
          Personen: Pensionierte
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            emptyFilter()
            setFilterPersonAktivJetztMitKurzzeichen(true)
            setTimeout(() => {
              setActivePrintForm('personVerzKurzzeichen')
              store.personVerzeichnis.initiate('personVerzKurzzeichen')
            }, 1000)
          }}
        >
          Personen: Kurzzeichen
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            emptyFilter()
            setFilterPersonAktivJetztMitTel(true)
            setTimeout(() => {
              setActivePrintForm('personVerzTel')
              store.personVerzeichnis.initiate()
            }, 1000)
          }}
        >
          Personen: Telefone
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen')
            emptyFilter()
            setFilterPersonAktivJetztMitMobiltel(true)
            setTimeout(() => {
              setActivePrintForm('personVerzMobiltel')
              store.personVerzeichnis.initiate()
            }, 1000)
          }}
        >
          Personen: Mobil-Telefone
        </DropdownItem>
        {showPD && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Für den aktiven Datensatz</DropdownItem>
            <DropdownItem onClick={onClickPD}>Personal-Blatt</DropdownItem>
            <DropdownItem onClick={onClickMutationsFormular}>
              Mutations-Formular
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
      {!!activePrintForm && (
        <>
          <StyledButton title="drucken" onClick={onClickPrint}>
            <FaPrint />
          </StyledButton>
          <StyledButton title="PDF erzeugen" onClick={onClickCreatePdf}>
            <FaRegFilePdf />
          </StyledButton>
        </>
      )}
    </StyledUncontrolledDropdown>
  )
}

export default observer(Berichte)
