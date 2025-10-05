import React from 'react'
import { useParams } from 'react-router-dom'

import { PersonPrint } from './PersonPrint/index.jsx'
import { PersonMutationPrint } from './PersonMutationPrint.jsx'
import { PersonPrintFunktionen } from './PersonPrintFunktionen/index.jsx'
import { PersonPrintPensionierte } from './PersonPrintPensionierte/index.jsx'
import { PersonPrintKader } from './PersonPrintKader/index.jsx'
import { PersonPrintVerzTel } from './PersonPrintVerzTel/index.jsx'
import { PersonPrintVerzMobiltel } from './PersonPrintVerzMobiltel/index.jsx'
import { PersonPrintVerzKurzzeichen } from './PersonPrintVerzKurzzeichen/index.jsx'

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
