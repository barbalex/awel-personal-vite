import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import { FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import tables from '../../../src/tables.js'
import storeContext from '../../../storeContext.js'

const Row = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${(props) =>
    props['data-active'] ? 'rgb(255, 250, 198)' : 'unset'};
  border-top: ${(props) =>
    props['data-active'] ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  height: 50px;
  padding: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1em;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`

const StammdatenRow = ({ index, style }) => {
  const navigate = useNavigate()
  const { tableId, tableName } = useParams()

  const store = useContext(storeContext)
  const { showDeleted } = store

  let data = store[tableName].slice().filter((p) => {
    if (!showDeleted) return p.deleted === 0
    return true
  })
  data = sortBy(data, ['sort', 'value'])
  const table = tables.find((t) => t.table === tableName)
  const row = data[index]

  const onClickRow = useCallback(
    () => navigate(`/Werte/${tableName}/${row.id}`),
    [tableName, navigate, row.id],
  )

  return (
    <Row style={style} onClick={onClickRow} data-active={+tableId === row.id}>
      {row.value || '(kein Wert)'}
      {row.deleted === 1 && (
        <>
          <FaTrashAlt id={`deletedIcon${row.id}`} />
          <UncontrolledTooltip placement="left" target={`deletedIcon${row.id}`}>
            {`Dieser ${table ? table.model : 'Datensatz'} wurde gelöscht`}
          </UncontrolledTooltip>
        </>
      )}
    </Row>
  )
}

export default observer(StammdatenRow)
