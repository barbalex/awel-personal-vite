import React, { useContext, useEffect } from 'react'
import { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import storeContext from '../storeContext.js'
import PersonPrint from './PersonContainer/PersonPrint/index.jsx'
import PersonMutationPrint from './PersonContainer/PersonMutationPrint.jsx'
import PersonPrintFunktionen from './PersonContainer/PersonPrintFunktionen/index.jsx'
import PersonPrintPensionierte from './PersonContainer/PersonPrintPensionierte/index.jsx'
import PersonPrintKader from './PersonContainer/PersonPrintKader/index.jsx'
import PersonPrintVerzTel from './PersonContainer/PersonPrintVerzTel/index.jsx'
import PersonPrintVerzMobiltel from './PersonContainer/PersonPrintVerzMobiltel/index.jsx'
import PersonPrintVerzKurzzeichen from './PersonContainer/PersonPrintVerzKurzzeichen/index.jsx'

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

  const store = useContext(storeContext)

  useEffect(() => {
    window.onbeforeunload = () => store.personPages.reset()
  }, [store.personPages])

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

  return null
}

export default observer(Print)
