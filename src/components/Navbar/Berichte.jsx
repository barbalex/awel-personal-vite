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
import { useNavigate, useParams, useLocation } from 'react-router-dom'

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
  const { personId = 0, report } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const {
    setFilter,
    emptyFilter,
    setFilterPersonKader,
    setFilterPersonAktivJetztMitTel,
    setFilterPersonAktivJetztMitMobiltel,
    setFilterPersonAktivJetztMitKurzzeichen,
    settings,
  } = store
  const showPD = !!+personId

  const onClickPD = useCallback(() => {
    navigate(`/Personen/${personId}/print-preview/personalblatt`)
  }, [navigate, personId])
  const onClickMutationsFormular = useCallback(() => {
    navigate(`/Personen/${personId}/print-preview/personMutation`)
  }, [navigate, personId])

  const onClickPrint = useCallback(() => {
    const previousPathname = pathname
    navigate(`/Personen/print/${report}`)
    setTimeout(async () => {
      window.print()
      navigate(previousPathname)
    })
  }, [navigate, pathname, report])

  const onClickCreatePdf = useCallback(() => {
    const printToPDFOptions = {
      marginsType: 0,
      printBackground: true,
    }
    const isPersonMutation = !!+personId && report === 'personMutation'
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

    const previousPathname = pathname
    navigate(`/Personen/print/${report}${personId ? `/${personId}` : ''}`)
    setTimeout(async () => {
      try {
        await window.electronAPI.printToPdf(printToPDFOptions, dialogOptions)
      } catch (error) {
        console.log('print-to-pdf ERROR', error)
        navigate(previousPathname)
        throw new Error({ message: error })
      }
      console.log('pdf print is over')
      navigate(previousPathname)
    })
  }, [report, navigate, pathname, personId, settings.mutationFormPath])

  return (
    <StyledUncontrolledDropdown nav inNavbar active={!!report}>
      <DropdownToggle nav caret>
        Berichte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vorlagen: übernehmen Filter</DropdownItem>
        <DropdownItem
          onClick={() => {
            navigate('/Personen/print-preview/personFunktionen')
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
              navigate('/Personen/print-preview/personKader')
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
              navigate('/Personen/print-preview/personPensionierte')
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
              navigate('/Personen/print-preview/personVerzKurzzeichen')
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
              navigate('/Personen/print-preview/personVerzTel')
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
              navigate('/Personen/print-preview/personVerzMobiltel')
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
      {!!report && (
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
