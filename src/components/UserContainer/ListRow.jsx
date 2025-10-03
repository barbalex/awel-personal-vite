import { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'

const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${(props) =>
    props['data-active'] ? 'rgb(255, 250, 198)' : 'unset'};
  border-top: ${(props) =>
    props['data-active'] ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
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

export const ListRow = observer(({ index, style, users }) => {
  const { userId = 0 } = useParams()
  const navigate = useNavigate()

  const store = useContext(storeContext)
  const { showFilter, setShowFilter } = store

  const row = users[index]

  return (
    <ErrorBoundary>
      <Row
        style={style}
        onClick={() => {
          navigate(`/Users/${row.id}`)
          if (showFilter) setShowFilter(false)
        }}
        data-active={!showFilter && +userId === row.id}
      >
        <RowContainer>
          <Text>{`${row.name || ''}`}</Text>
        </RowContainer>
      </Row>
    </ErrorBoundary>
  )
})
