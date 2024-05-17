/* eslint-disable no-nested-ternary */
import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { Button, UncontrolledTooltip } from 'reactstrap'
import ReactJson from 'react-json-view'
import { FaUndo } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import storeContext from '../../storeContext.js'
import revertMutation from '../../src/revertMutation.js'

moment.locale('de')

const Row = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  background-color: ${(props) =>
    props['data-active'] ? 'rgb(255, 250, 198)' : 'unset'};
  border-top: ${(props) =>
    props['data-active'] ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  padding: 15px 8px;
  display: grid;
  grid-template-columns: 150px 100px 100px 200px 100px 160px 1fr 1fr 50px;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
  overflow: hidden;
  overflow-x: auto;
`
const Field = styled.div`
  padding: 0 10px;
  line-height: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`
const Time = styled(Field)``
const User = styled(Field)``
const Model = styled(Field)``
const Op = styled(Field)``
const Id = styled(Field)`
  text-align: end;
`
const FieldName = styled(Field)``
const Value = styled(Field)`
  overflow: auto;
`
const PreviousValue = styled(Field)`
  overflow: auto;
`
const RevertButton = styled(Button)`
  font-size: 0.8rem !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  margin-top: -5px;
  height: 27px;
  align-self: center;
`

const MutationsRow = ({ style, listIndex, mutations }) => {
  const { mutationId = 0 } = useParams()

  const store = useContext(storeContext)
  const row = mutations[listIndex]
  const { id, time, user, tableName, rowId, field, op, value, previousValue } =
    row

  const revert = useCallback(
    () => revertMutation({ mutationId: row.id, store }),
    [row.id, store],
  )

  return (
    <Row
      style={style}
      // onClick={onClickRow}
      data-active={+mutationId === id}
    >
      <Time>{time}</Time>
      <User>{user}</User>
      <Op>{op}</Op>
      <Model>{tableName}</Model>
      <Id>{rowId}</Id>
      <FieldName>{field}</FieldName>
      <PreviousValue>
        {previousValue && previousValue[0] === '{' ? (
          <ReactJson
            src={JSON.parse(previousValue)}
            name={null}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        ) : (
          previousValue
        )}
      </PreviousValue>
      <Value>
        {value && value[0] === '{' ? (
          <ReactJson
            src={JSON.parse(value)}
            name={null}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        ) : (
          value
        )}
      </Value>
      <RevertButton id={`revertButton${id}`} onClick={revert} outline>
        <FaUndo data-id={id} />
      </RevertButton>
      <UncontrolledTooltip placement="left" target={`revertButton${id}`}>
        alten Wert wiederherstellen
      </UncontrolledTooltip>
    </Row>
  )
}

export default observer(MutationsRow)
