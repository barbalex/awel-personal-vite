import React, { useContext, useEffect } from 'react'
import { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams, useNavigate } from 'react-router-dom'

import storeContext from '../storeContext'
import PersonPrint from './PersonContainer/PersonPrint'
import PersonMutationPrint from './PersonContainer/PersonMutationPrint'
import PersonPrintFunktionen from './PersonContainer/PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonContainer/PersonPrintPensionierte'
import PersonPrintKader from './PersonContainer/PersonPrintKader'
import PersonPrintVerzTel from './PersonContainer/PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonContainer/PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonContainer/PersonPrintVerzKurzzeichen'
// import useDetectPrint from '../src/useDetectPrint'

const A4Portrait = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`
const A4Landscape = createGlobalStyle`
  @page {
    size: A4 landscape;
  }
`

const Print = () => {
  const { report, personId } = useParams()
  const navigate = useNavigate()

  const store = useContext(storeContext)

  useEffect(() => {
    window.onbeforeunload = () => store.personPages.reset()
  }, [store.personPages])
  // const isPrinting = useDetectPrint()

  console.log('Print: ', {
    report,
    personId,
  })

  if (personId) {
    if (report === 'personalblatt') {
      return (
        <>
          <A4Portrait />
          <PersonPrint />
        </>
      )
    }
    if (report === 'personMutation') {
      return (
        <>
          <A4Portrait />
          <PersonMutationPrint />
        </>
      )
    }
  }
  if (report === 'personFunktionen') {
    return (
      <>
        <A4Landscape />
        <PersonPrintFunktionen />
      </>
    )
  }
  if (report === 'personPensionierte') {
    return (
      <>
        <A4Landscape />
        <PersonPrintPensionierte />
      </>
    )
  }
  if (report === 'personKader') {
    return (
      <>
        <A4Landscape />
        <PersonPrintKader />
      </>
    )
  }
  if (report === 'personVerzTel') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzTel />
      </>
    )
  }
  if (report === 'personVerzMobiltel') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzMobiltel />
      </>
    )
  }
  if (report === 'personVerzKurzzeichen') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzKurzzeichen />
      </>
    )
  }

  console.log('Print: no printForm found')
  // navigate(`/personen${personId ? `/${personId}` : ''}`)

  return null
}

export default observer(Print)
