import React from 'react'
import { useParams } from 'react-router-dom'

import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'
import PersonPrintFunktionen from './PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonPrintPensionierte'
import PersonPrintKader from './PersonPrintKader'
import PersonPrintVerzTel from './PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonPrintVerzKurzzeichen'

const PersonPrintPreview = () => {
  const { report } = useParams()

  if (!report) {
    return null
  }

  if (report === 'personalblatt') {
    return <PersonPrint />
  }
  if (report === 'personMutation') {
    return <PersonMutationPrint />
  }
  if (report === 'personFunktionen') {
    return <PersonPrintFunktionen />
  }
  if (report === 'personPensionierte') {
    return <PersonPrintPensionierte />
  }
  if (report === 'personKader') {
    return <PersonPrintKader />
  }
  if (report === 'personVerzTel') {
    return <PersonPrintVerzTel />
  }
  if (report === 'personVerzMobiltel') {
    return <PersonPrintVerzMobiltel />
  }
  if (report === 'personVerzKurzzeichen') {
    return <PersonPrintVerzKurzzeichen />
  }

  console.log('PersonPrintPreview: no report')

  return null
}

export default PersonPrintPreview
