import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import moment from 'moment'
import get from 'lodash/get'
import { useParams } from 'react-router-dom'

import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'
import LogoAwel from '../../etc/LogoAwel.jpg'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: #eee;
  font-size: 10.5px;
  cursor: default;
  overflow-y: auto;
  height: 100vh;

  & div {
    background-color: white !important;
  }
  & * {
    background-color: transparent !important;
  }

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible;
    height: 29.7cm;
    width: 21cm;

    page-break-inside: avoid;
    page-break-before: avoid;
    page-break-after: avoid;
  }
`
const PageContainer = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* set dimensions */
  height: 29.7cm;
  width: 21cm;
  padding: 1.5cm;

  overflow-y: visible;

  @media print {
    margin: 0 !important;
    padding: 0.5cm !important;
    height: 100%;
    width: 100%;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const InnerPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  height: 100%;
`
const Content = styled.div``
const Footer = styled.div`
  padding-top: 5px;
`
const WrapperNarrow = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 100%);
  grid-template-rows: auto;
  grid-template-areas: 'areaPerson' 'areaTel' 'areaIt' 'areaWeiterleiten';
`
const WrapperWide = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: auto;
  grid-template-areas:
    'areaPerson areaTel'
    'areaPerson areaIt'
    'areaWeiterleiten areaWeiterleiten';
`
const Title = styled.h5`
  font-size: 1.2em;
  font-family: Arial Black;
`
const Area = styled.div`
  padding: 8px;
`
const AreaPerson = styled(Area)`
  grid-area: areaPerson;
  padding-bottom: 4mm;
`
const AreaTel = styled(Area)`
  grid-area: areaTel;
`
const AreaIt = styled(Area)`
  grid-area: areaIt;
`
const AreaWeiterleiten = styled(Area)`
  grid-area: areaWeiterleiten;
  display: flex;
`
const WeiterleitenRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const WRLeft = styled.div`
  display: flex;
`
const EditText = styled.div`
  margin-top: 6px;
`
const LogoImg = styled.img`
  max-width: 260px;
  margin-top: -20px;
  margin-left: -10px;
`
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  line-height: 1.5em;
  border-bottom: 1px solid #e2e2e2;
  &:first-of-type {
    border-top: 1px solid #e2e2e2;
  }
`
const Label = styled.div`
  flex-basis: 190px;
  flex-grow: 0;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
`
const Value = styled.div``
const Field = ({ label, value }) => (
  <Row>
    <Label>{`${label}:`}</Label>
    <Value>{value}</Value>
  </Row>
)

export const PersonMutationPrint = observer(() => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    personen,
    bereiche,
    sektionen,
    abteilungen,
    aemter,
    showFilter,
    existsFilter,
    settings,
  } = store

  if (!showFilter && !personId) return null

  const person = personen.find((p) => p.id === +personId)

  const viewIsNarrow = true
  const Wrapper = viewIsNarrow ? WrapperNarrow : WrapperWide

  const v = personen.find((p) => p.id === person.vorgesetztId)
  const vorgesetzt = v ? `${v.name} ${v.vorname}` : ''

  const tv = personen.find((p) => p.id === person.telefonUebernommenVon)
  const telefonUebernommenVon = tv ? `${tv.name} ${tv.vorname}` : ''

  const amtName =
    get(
      aemter.find((a) => a.id === person.amt),
      'name',
    ) || ''
  const abteilungName =
    get(
      abteilungen.find((a) => a.id === person.abteilung),
      'name',
    ) || ''
  const sektionName =
    get(
      sektionen.find((a) => a.id === person.sektion),
      'name',
    ) || ''
  const bereichName =
    get(
      bereiche.find((a) => a.id === person.bereich),
      'name',
    ) || ''

  return (
    <ErrorBoundary>
      <div className="printer-content">
        <Container>
          <PageContainer>
            <InnerPageContainer>
              <Content>
                <LogoImg src={LogoAwel} />
                <Wrapper>
                  <AreaPerson>
                    <Title>Person</Title>
                    <Field
                      key={`${personId}mutationArt`}
                      value={person.mutationArt}
                      label="Mutations-Art"
                    />
                    <Field
                      key={`${personId}eintrittDatum`}
                      value={person.eintrittDatum}
                      label="Eintritt"
                    />
                    <Field
                      key={`${personId}austrittDatum`}
                      value={person.austrittDatum}
                      label="Austritt"
                    />
                    <Field
                      key={`${personId}name`}
                      value={person.name}
                      label="Name"
                    />
                    <Field
                      key={`${personId}vorname`}
                      value={person.vorname}
                      label="Vorname"
                    />
                    <Field
                      key={`${personId}kurzzeichen`}
                      value={person.kurzzeichen}
                      label="Kurz&shy;zei&shy;chen"
                    />
                    <Field
                      key={`${personId}amt`}
                      value={amtName}
                      label="Amt"
                    />
                    <Field
                      key={`${personId}abteilung`}
                      value={abteilungName}
                      label="Abtei&shy;lung"
                    />
                    <Field
                      key={`${personId}sektion`}
                      value={sektionName}
                      label="Sektion"
                    />
                    <Field
                      key={`${personId}bereich`}
                      value={bereichName}
                      label="Bereich"
                    />
                    <Field
                      key={`${personId}standort`}
                      value={person.standort}
                      label="Stand&shy;ort"
                    />
                    <Field
                      key={`${personId}vorgesetztId`}
                      value={vorgesetzt}
                      label="Vorge&shy;setz&shy;te(r)"
                    />
                    <Field
                      key={`${personId}kostenstelle`}
                      value={person.kostenstelle}
                      label="Kosten&shy;stelle"
                    />
                    <Field
                      key={`${personId}${
                        existsFilter ? 1 : 0
                      }kostenstellenAenderungPer`}
                      value={person.kostenstellenAenderungPer}
                      label="Kosten&shy;stel&shy;le Ände&shy;rung per"
                    />
                    <Field
                      key={`${personId}bueroNr`}
                      value={person.bueroNr}
                      label="Büro Nr."
                    />
                    <Field
                      key={`${personId}bueroWechselPer`}
                      value={person.bueroWechselPer}
                      label="Büro-Wechsel per"
                    />
                  </AreaPerson>
                  <AreaTel>
                    <Title>Telefon / Schlüssel / Badge</Title>
                    <Field
                      key={`${personId}rufnummer`}
                      value={person.rufnummer}
                      label="Ruf&shy;num&shy;mer"
                    />
                    <Field
                      key={`${personId}telefonUebernommenVon`}
                      value={telefonUebernommenVon}
                      label="Tele&shy;fon über&shy;nom&shy;men von"
                    />
                    <Field
                      key={`${personId}schluesselNoetig`}
                      value={person.schluesselNoetig}
                      label="Schlüs&shy;sel nötig"
                    />
                  </AreaTel>
                  <AreaIt>
                    <Title>IT</Title>
                    <Field
                      key={`${personId}${
                        existsFilter ? 1 : 0
                      }arbeitsplatzeroeffnungPer`}
                      value={person.arbeitsplatzeroeffnungPer}
                      label="Arbeitsplatz eröffnen per"
                    />
                    <Field
                      key={`${personId}benoetigteSoftware`}
                      value={person.benoetigteSoftware}
                      label="Benötigte Software"
                    />
                    <Field
                      key={`${personId}standardabweichendeHardware`}
                      value={person.standardabweichendeHardware}
                      label="Vom Standard abweichende Hardware"
                    />
                    <Field
                      key={`${personId}abmeldungArbeitsplatzPer`}
                      value={person.abmeldungArbeitsplatzPer}
                      label="Arbeitsplatz abmelden per"
                    />
                    <Field
                      key={`${personId}itMutationBemerkungen`}
                      value={person.itMutationBemerkungen}
                      label="Bemerkungen zur IT"
                    />
                  </AreaIt>
                  <AreaWeiterleiten>
                    <WeiterleitenRow>
                      <WRLeft>
                        <Linkify>
                          <EditText>
                            {settings.personMutationWeiterleiten}
                          </EditText>
                        </Linkify>
                      </WRLeft>
                    </WeiterleitenRow>
                  </AreaWeiterleiten>
                </Wrapper>
              </Content>
              <Footer>{moment().format('DD.MM.YYYY')}</Footer>
            </InnerPageContainer>
          </PageContainer>
        </Container>
      </div>
    </ErrorBoundary>
  )
})
