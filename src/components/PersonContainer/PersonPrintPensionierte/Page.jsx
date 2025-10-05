import React, { useContext, useRef, useEffect } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext.js'
import LogoAwel from '../../../etc/LogoAwel.jpg'
import PageTitle from './PageTitle.jsx'
import Row from './Row.jsx'

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
  height: 20.95cm;
  padding: 1.5cm;

  overflow: hidden;
  overflow-y: visible;

  font-size: 10.5px;
  font-family: Arial, Helvetica, sans-serif;

  /* When the document is actually printed */
  @media print {
    /**
   * something seems to change the measurements
   * if they are not repeated here using important
   * seems like export to pdf is moved right down
   * without this
   */
    width: inherit;
    height: inherit;

    /* gingerly set margins and padding */
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0.5cm !important;
    padding-left: 0.5cm !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;

    overflow: hidden !important;

    page-break-inside: avoid !important;
    page-break-before: always !important;
    page-break-after: always !important;
  }
`
/**
 * width of PageContainer is set in print by @page
 * somehow this makes positioning of its children not react as usual
 * flex and relative/absolute positioning behave as if the page were not full size
 * but would grow with the rowsContainer
 * Solution:
 * set a InnerPageContainer inside PageContainer
 * and give it full page size
 */
const InnerPageContainer = styled.div`
  width: 26.7cm;
  height: 17.95cm;

  /* place rowsContainer top and footer bottom */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledRowsContainer = styled.div`
  max-height: 17.2cm;
  max-width: 26.7cm;
  /*
   * need overflow while building list
   * so list does not flow outside padding
   */
  overflow-y: ${(props) =>
    props['data-building'] === 'true' ? 'auto' : 'hidden'};
  overflow-x: hidden;
  /* grow to fill page and thus move single rows to top */
  flex-grow: 2;

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`
const Footer = styled.div`
  height: 0.4cm !important;
  max-height: 0.4cm !important;
  width: 26.7cm;
  max-width: 26.7cm;

  display: flex;
  justify-content: space-between;

  div {
    /* push down as far as possible */
    margin-bottom: 0;
    text-align: right;
  }

  div:first-of-type {
    text-align: left;
  }

  @media print {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`
const LogoImg = styled.img`
  max-width: 260px;
  margin-top: -20px;
  margin-left: -10px;
`
const StyledHeader = styled.div`
  border-bottom: 2px solid #717171;
  font-weight: 700;
`
const HeaderRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 3px;
  font-family: Arial Black;
`
const Field = styled.div`
  flex: 1;
  padding: 2px;
`

const PersonPrintPensioniertePage = ({ pageIndex }) => {
  const store = useContext(storeContext)
  const { personPages, personenFilteredSorted } = store
  const {
    pages,
    building,
    activePageIndex,
    remainingRows,
    moveRowToNewPage,
    addRow,
    stop,
  } = personPages
  const rowsContainer = useRef(null)

  const page = pages[pageIndex]
  const { rows } = page

  useEffect(() => {
    /**
     * - measure height of pageSize-component
     * - if > desired page height:
     *  - move last row to next page
     *  - render
     * - else:
     *  - insert next row
     *  - render
     */
    // don't do anything on not active pages
    if (pageIndex === activePageIndex) {
      const offsetHeight =
        rowsContainer ? rowsContainer.current?.offsetHeight : null
      const scrollHeight =
        rowsContainer ? rowsContainer.current?.scrollHeight : null
      const activePageIsFull = page.full

      if (!activePageIsFull && remainingRows.length > 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewPage(activePageIndex)
          //this.showPagesModal()
        } else {
          addRow(page)
        }
      }
      if (remainingRows.length === 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewPage(activePageIndex)
          //this.showPagesModal()
        } else {
          // for unknown reason setTimeout is needed
          setTimeout(() => {
            stop()
          })
        }
      }
    }
  }, [
    activePageIndex,
    addRow,
    moveRowToNewPage,
    page,
    pageIndex,
    remainingRows.length,
    stop,
  ])

  if (!rows) return null

  const personen = personenFilteredSorted.filter((p) => rows.includes(p.id))

  return (
    <Container>
      <InnerPageContainer>
        {pageIndex === 0 && (
          <>
            <LogoImg src={LogoAwel} />
            <PageTitle />
          </>
        )}
        <StyledHeader>
          <HeaderRow>
            <Field>Name</Field>
            <Field>Vorname</Field>
            <Field>Abteilung</Field>
            <Field>Sektion</Field>
            <Field>Bereich</Field>
            <Field>Funktionen</Field>
            <Field>Austrittsdatum</Field>
          </HeaderRow>
        </StyledHeader>
        <StyledRowsContainer
          data-building={building.toString()}
          ref={rowsContainer}
        >
          {personen.map((p, i) => (
            <Row
              key={p.id}
              p={p}
              i={i}
            />
          ))}
        </StyledRowsContainer>
        <Footer>
          <div>{moment().format('DD.MM.YYYY')}</div>
          <div>
            Seite {pageIndex + 1}/{pages.length}
          </div>
        </Footer>
      </InnerPageContainer>
    </Container>
  )
}

export default observer(PersonPrintPensioniertePage)
