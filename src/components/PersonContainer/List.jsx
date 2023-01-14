import React, { useContext } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTrashAlt } from 'react-icons/fa'
import { FaRegEdit } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary'
import storeContext from '../../storeContext'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
  @media print {
    display: none;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? 'rgb(255, 250, 198)' : 'unset'};
  border-top: ${(props) =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  height: 50px;
  padding: 15px;
  line-height: 1.25em;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const RowContainer = styled.div`
  display: flex;
  align-items: center;
`
const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  flex-grow: 1;
  line-height: 1.5em;
`
const Infos = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  justify-content: flex-end;
`
const Svg = styled.div`
  margin-left: 4px;
  font-size: large;
  display: flex;
`
const MutationFrist = styled.div`
  padding-right: 5px;
  font-size: 1rem;
`

const PersonList = ({ dimensions, listRef }) => {
  const navigate = useNavigate()
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const {
    showFilter,
    setShowFilter,
    showMutationNoetig,
    setActivePrintForm,
    activePrintForm,
  } = store
  // eslint-disable-next-line no-restricted-globals
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  // eslint-disable-next-line no-restricted-globals
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const personen = store.personenFilteredSortedByHandlungsbedarf

  return (
    <ErrorBoundary>
      <Container>
        <List
          height={height}
          itemCount={personen.length}
          itemSize={50}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => {
            const row = personen[index]
            const showDelSvg = row.deleted === 1
            const showMutationNoetigSvg =
              row.mutationNoetig === 1 && showMutationNoetig

            return (
              <Row
                style={style}
                onClick={() => {
                  navigate(`/Personen/${row.id}`)
                  if (showFilter) setShowFilter(false)
                  if (activePrintForm) setActivePrintForm(null)
                }}
                active={!showFilter && +personId === row.id}
              >
                <RowContainer>
                  <Text>{`${row.name || ''} ${row.vorname || ''}`}</Text>
                  <Infos>
                    {showMutationNoetigSvg && (
                      <Svg>
                        {row.mutationFrist && (
                          <>
                            <MutationFrist id={`mutationFrist${row.id}`}>
                              {row.mutationFrist}
                            </MutationFrist>
                            <UncontrolledTooltip
                              placement="bottom"
                              target={`mutationFrist${row.id}`}
                            >
                              Frist für Handlungs-Bedarf
                            </UncontrolledTooltip>
                          </>
                        )}
                        <FaRegEdit id={`mutationNoetig${row.id}`} />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={`mutationNoetig${row.id}`}
                        >
                          Handlungs-Bedarf vorhanden
                        </UncontrolledTooltip>
                      </Svg>
                    )}
                    {!showDelSvg && !showMutationNoetigSvg && ''}
                    {showDelSvg && (
                      <Svg>
                        <FaTrashAlt id={`deletedIcon${row.id}`} />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={`deletedIcon${row.id}`}
                        >
                          Diese Person wurde gelöscht
                        </UncontrolledTooltip>
                      </Svg>
                    )}
                  </Infos>
                </RowContainer>
              </Row>
            )
          }}
        </List>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PersonList)
