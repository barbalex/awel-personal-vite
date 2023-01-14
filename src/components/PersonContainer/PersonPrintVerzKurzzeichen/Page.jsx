import React, { useContext } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import Column from './Column'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  /* Divide single pages with some space and center all pages horizontally */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;

  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set page size and padding for screen */
  width: 29.7cm;
  height: 21cm;
  padding: 1.2cm;

  overflow: hidden;

  font-size: 10.5px;
  font-family: Arial, Helvetica, sans-serif;

  @media print {
    width: 29.7cm;
    /* 
     * set this too high and:
     * an empty page is added at the end
     * second page is placed lower than first
    */
    height: 20.3cm;

    /* gingerly set margins and padding */
    margin: 0 !important;

    overflow: hidden !important;

    page-break-before: always !important;
    page-break-after: always !important;
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
  position: relative;
  top: 0.2cm;
  height: 18.2cm;
  width: 27.3cm;
  display: grid;
  grid-template-rows: 5mm 16.75cm 5mm;
  grid-column-gap: 2mm;
  grid-template-areas: 'column0 column1 column2';
  max-height: 18.6cm;
  max-width: 27.3cm;
  /*
 * need overflow while building list
 * so list does not flow outside padding
 */
  overflow-y: ${props => (props.building ? 'auto' : 'hidden')};
  overflow-x: hidden;
`
const Footer = styled.div`
  position: relative;
  bottom: 0.5cm;
  height: 0.3cm;
  width: 27.3cm;
  display: flex;
  justify-content: space-between;
`
const Title = styled.div`
  position: relative;
  top: 0;
  height: 0.4cm;
  width: 27.3cm;
  font-size: 1.2em;
  font-family: Arial Black;
  text-align: center;
`
const Column0 = styled.div`
  grid-area: column0;
`
const Column1 = styled.div`
  grid-area: column1;
`
const Column2 = styled.div`
  grid-area: column2;
`

const PersonPrintVerzKurzzeichenPage = ({ pageIndex }) => {
  const store = useContext(storeContext)
  const { personVerzeichnis } = store
  const { pages, building } = personVerzeichnis

  return (
    <Container>
      <Title>AWEL Kurzzeichen-Verzeichnis</Title>
      <InnerPageContainer building={building}>
        <Column0>
          <Column pageIndex={pageIndex} columnIndex={0} />
        </Column0>
        <Column1>
          <Column pageIndex={pageIndex} columnIndex={1} />
        </Column1>
        <Column2>
          <Column pageIndex={pageIndex} columnIndex={2} />
        </Column2>
      </InnerPageContainer>
      <Footer>
        <div>{`Stand: ${moment().format('DD.MM.YYYY')}`}</div>
        <div>
          Seite {pageIndex + 1}/{pages.length}
        </div>
      </Footer>
    </Container>
  )
}

export default observer(PersonPrintVerzKurzzeichenPage)
