import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'
import PersonPrintFunktionen from './PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonPrintPensionierte'
import PersonPrintKader from './PersonPrintKader'
import PersonPrintVerzTel from './PersonPrintVerzTel'
import PersonPrintVerzMobiltel from './PersonPrintVerzMobiltel'
import PersonPrintVerzKurzzeichen from './PersonPrintVerzKurzzeichen'
import storeContext from '../../storeContext'

const PersonPrintPreview = () => {
  const store = useContext(storeContext)
  const { activePrintForm } = store

  console.log('PersonTab: activePrintForm:', activePrintForm)

  if (activePrintForm === 'personalblatt') {
    return <PersonPrint />
  }
  if (activePrintForm === 'personMutation') {
    return <PersonMutationPrint />
  }
  if (activePrintForm === 'personFunktionen') {
    return <PersonPrintFunktionen />
  }
  if (activePrintForm === 'personPensionierte') {
    return <PersonPrintPensionierte />
  }
  if (activePrintForm === 'personKader') {
    return <PersonPrintKader />
  }
  if (activePrintForm === 'personVerzTel') {
    return <PersonPrintVerzTel />
  }
  if (activePrintForm === 'personVerzMobiltel') {
    return <PersonPrintVerzMobiltel />
  }
  if (activePrintForm === 'personVerzKurzzeichen') {
    return <PersonPrintVerzKurzzeichen />
  }

  console.log('PersonPrintPreview: no activePrintForm')

  return null
}

export default observer(PersonPrintPreview)
