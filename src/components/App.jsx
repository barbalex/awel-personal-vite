import React from 'react'
// need to use HashRouter instead of BrowserRouter
// https://stackoverflow.com/a/50404777/712005
import { Routes, Route, HashRouter } from 'react-router-dom'
import styled from 'styled-components'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import PersonContainer from './PersonContainer/index.jsx'
import PersonTab from './PersonContainer/PersonTab.jsx'
import PrintPreview from './PersonContainer/PrintPreview.jsx'
import AmtContainer from './AmtContainer/index.jsx'
import Amt from './AmtContainer/Amt/index.jsx'
import UserContainer from './UserContainer/index.jsx'
import User from './UserContainer/User.jsx'
import AbteilungContainer from './AbteilungContainer/index.jsx'
import Abteilung from './AbteilungContainer/Abteilung/index.jsx'
import SektionContainer from './SektionContainer/index.jsx'
import Sektion from './SektionContainer/Sektion/index.jsx'
import BereichContainer from './BereichContainer/index.jsx'
import Bereich from './BereichContainer/Bereich/index.jsx'
import StammdatenContainer from './StammdatenContainer/index.jsx'
import DeletionModal from './DeletionModal.jsx'
import Mutations from './Mutations/index.jsx'
import Errors from './Errors.jsx'
import NavigateSetter from './NavigateSetter.jsx'
import Print from './Print.jsx'
import Layout from './Layout.jsx'
import Login from './Login.jsx'

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

// TODO: when upgrading react-router to v7, prints for all persons are broken
const RouterComponent = () => (
  <Container>
    <HashRouter 
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Personen/print/:report" element={<Print />} />
        <Route path="/Personen/print/:report/:personId" element={<Print />} />
        <Route element={<Layout />}>
          <Route path="/Personen" element={<PersonContainer />}>
            <Route path="print-preview/:report" element={<PrintPreview />} />
            <Route  path=":personId" >
              <Route index element={<PersonTab />} />
              <Route path="print-preview/:report" element={<PrintPreview />} />
            </Route>
          </Route>
          <Route path="/Aemter" element={<AmtContainer />}>
            <Route path=":amtId" element={<Amt />} />
          </Route>
          <Route path="/Users" element={<UserContainer />}>
            <Route path=":userId" element={<User />} />
          </Route>
          <Route path="/Sektionen" element={<SektionContainer />} >
            <Route path=":sektionId" element={<Sektion />} />
          </Route>
          <Route path="/Bereiche" element={<BereichContainer />}>
            <Route path=":bereichId" element={<Bereich />} />
          </Route>
          <Route path="/Abteilungen" element={<AbteilungContainer />}>
            <Route path=":abteilungId" element={<Abteilung />} />
          </Route>
          <Route path="/Werte">
            <Route path=":tableName"  element={<StammdatenContainer />} >
              <Route path=":tableId" element={<StammdatenContainer />} />
            </Route>
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
