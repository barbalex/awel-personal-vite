import React from 'react'
// need to use HashRouter instead of BrowserRouter
// https://stackoverflow.com/a/50404777/712005
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import PersonContainer from './PersonContainer'
import PersonTab from './PersonContainer/PersonTab'
import PrintPreview from './PersonContainer/PrintPreview'
import AmtContainer from './AmtContainer'
import Amt from './AmtContainer/Amt'
import UserContainer from './UserContainer'
import User from './UserContainer/User'
import AbteilungContainer from './AbteilungContainer'
import Abteilung from './AbteilungContainer/Abteilung'
import SektionContainer from './SektionContainer'
import Sektion from './SektionContainer/Sektion'
import BereichContainer from './BereichContainer'
import Bereich from './BereichContainer/Bereich'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'
import Mutations from './Mutations'
import Errors from './Errors'
import NavigateSetter from './NavigateSetter'
import Print from './Print'
import Layout from './Layout'
import Login from './Login'

registerLocale('de', de)
setDefaultLocale('de')

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  @media print {
    height: auto !important;
    width: auto !important;
    overflow: visible !important;
  }
`

const RouterComponent = () => (
  <Container>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/Personen/print/:report" element={<Print />} />
          <Route path="/Personen/print/:report/:personId" element={<Print />} />
          <Route path="/Personen/*" element={<PersonContainer />}>
            <Route path="*" element={<PrintPreview />} />
            <Route path="print-preview/:report" element={<PrintPreview />} />
            <Route path=":personId/*" element={<PersonTab />} />
            <Route
              path=":personId/print-preview/:report"
              element={<PrintPreview />}
            />
          </Route>
          <Route path="/Aemter/*" element={<AmtContainer />}>
            <Route path=":amtId" element={<Amt />} />
          </Route>
          <Route path="/Users/*" element={<UserContainer />}>
            <Route path=":userId" element={<User />} />
          </Route>
          <Route path="/Sektionen/*" element={<SektionContainer />}>
            <Route path=":sektionId" element={<Sektion />} />
          </Route>
          <Route path="/Bereiche/*" element={<BereichContainer />}>
            <Route path=":bereichId" element={<Bereich />} />
          </Route>
          <Route path="/Abteilungen/*" element={<AbteilungContainer />}>
            <Route path=":abteilungId" element={<Abteilung />} />
          </Route>
          <Route path="/Werte/*" element={<StammdatenContainer />}>
            <Route path=":tableName/*" element={<StammdatenContainer />} />
            <Route
              path=":tableName/:tableId"
              element={<StammdatenContainer />}
            />
          </Route>
          <Route path="/mutations" element={<Mutations />} />
        </Route>
      </Routes>
      <Errors />
      <DeletionModal />
      <NavigateSetter />
    </HashRouter>
  </Container>
)

export default RouterComponent
