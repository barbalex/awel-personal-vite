import React, { useContext } from 'react'
import { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import storeContext from '../storeContext'
import PersonPrint from './PersonContainer/PersonPrint'
import PersonMutationPrint from './PersonContainer/PersonMutationPrint'
import PersonPrintFunktionen from './PersonContainer/PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonContainer/PersonPrintPensionierte'
import PersonPrintKader from './PersonContainer/PersonPrintKader'
import PersonPrintVerzTel from './PersonContainer/PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonContainer/PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonContainer/PersonPrintVerzKurzzeichen'
import useDetectPrint from '../src/useDetectPrint'

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
  const { printForm, personId } = useParams()

  const store = useContext(storeContext)
  const { activePrintForm, printing, setPrinting } = store
  const isPrinting = useDetectPrint()

  console.log('Print: ', {
    activePrintForm,
    printForm,
    printing,
    isPrinting,
  })

  if (personId) {
    if (activePrintForm === 'personalblatt') {
      return (
        <>
          <A4Portrait />
          <PersonPrint />
        </>
      )
    }
    if (activePrintForm === 'personMutation') {
      return (
        <>
          <A4Portrait />
          <PersonMutationPrint />
        </>
      )
    }
  }
  if (activePrintForm === 'personFunktionen') {
    return (
      <>
        <A4Landscape />
        <PersonPrintFunktionen />
      </>
    )
  }
  if (activePrintForm === 'personPensionierte') {
    return (
      <>
        <A4Landscape />
        <PersonPrintPensionierte />
      </>
    )
  }
  if (activePrintForm === 'personKader') {
    return (
      <>
        <A4Landscape />
        <PersonPrintKader />
      </>
    )
  }
  if (activePrintForm === 'personVerzTel') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzTel />
      </>
    )
  }
  if (activePrintForm === 'personVerzMobiltel') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzMobiltel />
      </>
    )
  }
  if (activePrintForm === 'personVerzKurzzeichen') {
    return (
      <>
        <A4Landscape />
        <PersonPrintVerzKurzzeichen />
      </>
    )
  }

  console.log('Print: no printForm found', { printing, isPrinting })
  setPrinting(false)

  return null
}

export default observer(Print)
