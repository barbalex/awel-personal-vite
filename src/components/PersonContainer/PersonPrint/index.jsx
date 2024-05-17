import React, { useContext, useMemo } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import get from 'lodash/get'
import { useParams } from 'react-router-dom'

import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import storeContext from '../../../storeContext.js'
import InputValue from './InputValue.jsx'
import Telefones from './Telefones.jsx'
import Links from './Links.jsx'
import Schluessels from './Schluessels.jsx'
import MobileAbos from './MobileAbos.jsx'
import LogoAwel from '../../../etc/LogoAwel.jpg'

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
    padding: 0.25cm !important;
    height: 100%;
    width: 100%;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
/**
 * width of PageContainer is set in print by @page
 * somehow this makes positioning of its children not react as usual
 * flex and relative/absolute positioning behave as if the page were not full size
 * but would grow with the containerEl
 * Solution:
 * set a InnerPageContainer inside PageContainer
 * and give it full page size
 */
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
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: auto;
  grid-template-areas:
    'personalien verzeichnis'
    'anstellung funktionen'
    'zuletzt zuletzt';
  font-family: Arial, Helvetica, sans-serif;
`
const Area = styled.div`
  padding: 8px;
  border: 1px solid #ccc;
  border-bottom: none;
`
const AreaPersonalien = styled(Area)`
  grid-area: personalien;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-areas:
    'p_area_title p_bild'
    'p_name p_bild'
    'p_vorname p_bild'
    'p_anrede p_bild'
    'p_title p_bild'
    'p_kurzzeichen p_bild'
    'p_adresse p_adresse'
    'p_plz p_plz'
    'p_ort p_ort'
    'p_land p_land'
    'p_email p_email'
    'p_geburtsdatum p_geburtsdatum'
    'p_telefon p_telefon';
`
const AreaPAreaTitle = styled.div`
  grid-area: p_area_title;
`
const AreaPName = styled.div`
  grid-area: p_name;
`
const AreaPBild = styled.div`
  grid-area: p_bild;
  justify-self: end;
`
const AreaPVorname = styled.div`
  grid-area: p_vorname;
`
const AreaPAnrede = styled.div`
  grid-area: p_anrede;
`
const AreaPTitel = styled.div`
  grid-area: p_title;
`
const AreaPKurzzeichen = styled.div`
  grid-area: p_kurzzeichen;
`
const AreaPAdresse = styled.div`
  grid-area: p_adresse;
`
const AreaPPLZ = styled.div`
  grid-area: p_plz;
`
const AreaPOrt = styled.div`
  grid-area: p_ort;
`
const AreaPLand = styled.div`
  grid-area: p_land;
`
const AreaPEmail = styled.div`
  grid-area: p_email;
`
const AreaPGeburtsdatum = styled.div`
  grid-area: p_geburtsdatum;
`
const AreaPTelefon = styled.div`
  grid-area: p_telefon;
`
const AreaAnstellung = styled(Area)`
  grid-area: anstellung;
`
const AreaFunktionen = styled(Area)`
  grid-area: funktionen;
`
const AreaVerzeichnis = styled(Area)`
  grid-area: verzeichnis;
`
const AreaZuletzt = styled(Area)`
  grid-area: zuletzt;
  border-left: none;
  border-right: none;
`
const Title = styled.div`
  font-size: 14px;
  font-family: Arial Black;
`
const Img = styled.img`
  max-height: 180px;
  max-width: 160px;
`
const LogoImg = styled.img`
  max-width: 260px;
  margin-top: -15px;
  margin-left: -10px;
`

const PersonPrint = () => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    abteilungen,
    sektionen,
    bereiche,
    etiketten,
    anwesenheitstage,
    funktionen,
    kaderFunktionen,
  } = store

  const myEtiketten = useMemo(
    () =>
      etiketten
        .filter((e) => e.idPerson === +personId)
        .filter((w) => !!w.etikett)
        .filter((p) => p.deleted === 0)
        .map((e) => e.etikett),
    [personId, etiketten],
  )
  const myAnwesenheitstage = useMemo(
    () =>
      anwesenheitstage
        .filter((e) => e.idPerson === +personId)
        .filter((w) => !!w.tag)
        .filter((p) => p.deleted === 0)
        .map((e) => e.tag),
    [personId, anwesenheitstage],
  )
  const myFunktionen = useMemo(
    () =>
      funktionen
        .filter((e) => e.idPerson === +personId)
        .filter((w) => !!w.funktion)
        .filter((p) => p.deleted === 0)
        .map((e) => e.funktion),
    [personId, funktionen],
  )
  const myKaderFunktionen = useMemo(
    () =>
      kaderFunktionen
        .filter((e) => e.idPerson === +personId)
        .filter((w) => !!w.funktion)
        .filter((p) => p.deleted === 0)
        .map((e) => e.funktion),
    [personId, kaderFunktionen],
  )

  if (!personId) return null

  const person = personen.find((p) => p.id === +personId) || {}

  const personVorgesetzt = personen.find((a) => a.id === person.vorgesetztId)

  return (
    <ErrorBoundary>
      <div className="printer-content">
        <Container>
          <PageContainer>
            <InnerPageContainer>
              <Content>
                <LogoImg src={LogoAwel} />
                <Wrapper>
                  <AreaPersonalien>
                    <AreaPAreaTitle>
                      <Title>Personalien</Title>
                    </AreaPAreaTitle>
                    <AreaPBild>
                      {person.bildUrl && (
                        <Img
                          src={`secure-protocol://${person.bildUrl}`}
                          alt={`${person.vorname} ${person.name}`}
                        />
                      )}
                    </AreaPBild>
                    <AreaPName>
                      <InputValue value={person.name} label="Name" />
                    </AreaPName>
                    <AreaPVorname>
                      <InputValue value={person.vorname} label="Vorname" />
                    </AreaPVorname>
                    <AreaPAnrede>
                      <InputValue value={person.anrede} label="Anrede" />
                    </AreaPAnrede>
                    <AreaPTitel>
                      <InputValue value={person.titel} label="Titel" />
                    </AreaPTitel>
                    <AreaPKurzzeichen>
                      <InputValue
                        value={person.kurzzeichen}
                        label="Kurzzeichen"
                      />
                    </AreaPKurzzeichen>
                    <AreaPAdresse>
                      <InputValue value={person.adresse} label="Adresse" />
                    </AreaPAdresse>
                    <AreaPPLZ>
                      <InputValue value={person.plz} label="PLZ" />
                    </AreaPPLZ>
                    <AreaPOrt>
                      <InputValue value={person.ort} label="Ort" />
                    </AreaPOrt>
                    <AreaPLand>
                      <InputValue label="Land" value={person.land} />
                    </AreaPLand>
                    <AreaPEmail>
                      <InputValue value={person.email} label="Email" />
                    </AreaPEmail>
                    <AreaPGeburtsdatum>
                      <InputValue
                        value={person.geburtDatum}
                        label="Geburtsdatum"
                      />
                    </AreaPGeburtsdatum>
                    <AreaPTelefon>
                      <Telefones />
                    </AreaPTelefon>
                  </AreaPersonalien>
                  <AreaAnstellung>
                    <Title>Anstellung</Title>
                    <InputValue value={person.status} label="Status" />
                    <InputValue value={person.eintrittDatum} label="Eintritt" />
                    <InputValue value={person.austrittDatum} label="Austritt" />
                    <InputValue
                      value={person.beschaeftigungsgrad}
                      label="Beschäftigungsgrad (%)"
                    />
                    <InputValue
                      label="Anwesenheitstage"
                      value={myAnwesenheitstage.join(', ')}
                    />
                    <InputValue value={person.standort} label="Standort" />
                    <InputValue value={person.bueroNr} label="Büro Nr." />
                  </AreaAnstellung>
                  <AreaFunktionen>
                    <Title>Funktionen</Title>
                    <InputValue
                      value={
                        get(
                          aemter.find((a) => a.id === person.amt),
                          'name',
                        ) || ''
                      }
                      label="Amt"
                    />
                    <InputValue
                      label="Abteilung"
                      value={
                        get(
                          abteilungen.find((a) => a.id === person.abteilung),
                          'name',
                        ) || ''
                      }
                    />
                    <InputValue
                      label="Sektion"
                      value={
                        get(
                          sektionen.find((a) => a.id === person.sektion),
                          'name',
                        ) || ''
                      }
                    />
                    <InputValue
                      label="Bereich"
                      value={
                        get(
                          bereiche.find((a) => a.id === person.bereich),
                          'name',
                        ) || ''
                      }
                    />
                    <InputValue
                      label="Vorgesetzte(r)"
                      value={
                        personVorgesetzt
                          ? `${personVorgesetzt.name} ${personVorgesetzt.vorname}`
                          : ''
                      }
                    />
                    <InputValue
                      label="Funktionen"
                      value={myFunktionen.join(', ')}
                    />
                    <InputValue
                      label="Kader-Funktionen"
                      value={myKaderFunktionen.join(', ')}
                    />
                  </AreaFunktionen>
                  <AreaVerzeichnis>
                    <Title>Verzeichnis</Title>
                    <InputValue
                      value={person.parkplatzNr}
                      label="Parkplatz Nr."
                    />
                    <InputValue
                      label="Etiketten"
                      value={myEtiketten.join(', ')}
                    />
                    <InputValue
                      value={person.bemerkungen}
                      label="Bemerkun&shy;gen"
                    />
                    <Links />
                    <Schluessels />
                    <MobileAbos />
                  </AreaVerzeichnis>
                  <AreaZuletzt>
                    {`Zuletzt geändert: ${
                      moment.unix(person.letzteMutationZeit / 1000).isValid()
                        ? moment
                            .unix(person.letzteMutationZeit / 1000)
                            .format('DD.MM.YYYY H:mm:ss')
                        : ''
                    }, ${person.letzteMutationUser || ''}`}
                  </AreaZuletzt>
                </Wrapper>
              </Content>
              <Footer>{moment().format('DD.MM.YYYY')}</Footer>
            </InnerPageContainer>
          </PageContainer>
        </Container>
      </div>
    </ErrorBoundary>
  )
}

export default PersonPrint
