import React, { useContext, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext.js'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  /*
 * need overflow while building list
 * so list does not flow outside padding
 */
  overflow-y: ${props => (props.building ? 'auto' : 'hidden')};
  overflow-x: hidden;

  height: 17.35cm;
  width: 8.9cm;
  max-height: 17.6cm;
  max-width: 8.9cm;
`
const Field = styled.div`
  flex: 1;
  padding: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StyledName = styled(Field)`
  min-width: 17mm;
`
const StyledVorname = styled(Field)``
const StyledKurzzeichen = styled(Field)`
  max-width: 8mm;
`
const StyledTelefon = styled(Field)`
  min-width: 19mm;
`
const StyledBueroNr = styled(Field)``
const StyledBereich = styled(Field)`
  max-width: 6mm;
`
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 0;
  page-break-inside: avoid !important;
  background-color: ${props =>
    props.type === 'title' ? 'rgba(0,0,0,0.1)' : 'unset'};
  /* get background colors to show */
  @media print {
    -webkit-print-color-adjust: exact;
  }
  border-top: ${props =>
    props.topborder === 'true' ? '1px rgba(0, 0, 0, 0.5) solid' : 'unset'};
  border-bottom: 1px rgba(0, 0, 0, 0.5) solid;
  font-weight: ${props => (props.type === 'title' ? '800' : 'unset')};
  font-family: ${props => (props.type === 'title' ? 'Arial Black' : 'unset')};
`

const PersonPrintVerzMobiltelColumn = ({ pageIndex, columnIndex }) => {
  const containerEl = useRef(null)
  const store = useContext(storeContext)
  const {
    abteilungen,
    telefones,
    personVerzeichnis,
    personenFilteredSorted,
  } = store
  const {
    pages,
    activePageIndex,
    remainingRows,
    stop,
    addRow,
  } = personVerzeichnis

  const page = pages[pageIndex]
  const { full: pageIsFull, moveRowToNewColumn } = page
  const column = page[`column${columnIndex}`]
  const { rows, full: columnIsFull } = column

  setTimeout(() => {
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
      const offsetHeight = containerEl ? containerEl.current?.offsetHeight : null
      const scrollHeight = containerEl ? containerEl.current?.scrollHeight : null

      if (!pageIsFull && remainingRows.length > 0) {
        if (offsetHeight < scrollHeight) {
          // if second last row is title, move two to next column
          if (isNaN(rows[rows.length - 2])) {
            moveRowToNewColumn('two')
          } else {
            moveRowToNewColumn()
          }
        } else {
          addRow()
        }
      }
      if (remainingRows.length === 0) {
        if (offsetHeight < scrollHeight) {
          moveRowToNewColumn()
        } else {
          // for unknown reason setTimeout is needed
          setTimeout(() => {
            stop()
          })
        }
      }
    }
  })

  if (!rows) return null

  const data = rows
    .map(r => {
      if (isNaN(r)) {
        return { type: 'title', name: r }
      }
      return personenFilteredSorted.find(p => p.id === r)
    })
    // while new filter is applied, undefined rows exist
    .filter(r => !!r)

  return (
    <Container building={!columnIsFull} ref={containerEl}>
      {data.map((r, i) => {
        const abteilung = r.abteilung
          ? abteilungen.find(a => a.id === r.abteilung)
          : null
        const abteilungKurzzeichen =
          abteilung && abteilung.kurzzeichen ? abteilung.kurzzeichen : ''

        return (
          <Row
            key={r.id || r.name}
            type={r.type || 'row'}
            topborder={(i === 0).toString()}
          >
            <StyledName>{r.name || ''}</StyledName>
            <StyledVorname>{r.vorname || ''}</StyledVorname>
            <StyledKurzzeichen>{r.kurzzeichen || ''}</StyledKurzzeichen>
            <StyledTelefon>
              {
                telefones
                  .filter(f => f.idPerson === r.id)
                  .filter(f => f.typ === 'mobile')
                  .filter(f => f.deleted === 0)
                  .map(f => f.nr)[0]
              }
            </StyledTelefon>
            <StyledBueroNr>{r.bueroNr || ''}</StyledBueroNr>
            <StyledBereich>{abteilungKurzzeichen}</StyledBereich>
          </Row>
        )
      })}
    </Container>
  )
}

export default observer(PersonPrintVerzMobiltelColumn)
