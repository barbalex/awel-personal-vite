import { useContext } from 'react'
import { List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import sortBy from 'lodash/sortBy'
import { useParams } from 'react-router-dom'

import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import storeContext from '../../../storeContext.js'
import Row from './Row.jsx'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
  height: ${(props) => props['data-height']}px;
`

const DataList = ({ dimensions, listRef }) => {
  const { tableName } = useParams()

  const store = useContext(storeContext)
  const { showDeleted } = store

  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  let data = store[tableName].slice().filter((p) => {
    if (!showDeleted) return p.deleted === 0
    return true
  })
  data = sortBy(data, ['sort', 'value'])

  return (
    <ErrorBoundary>
      <Container data-height={height}>
        <List
          rowComponent={Row}
          rowHeight={50}
          rowCount={data.length}
          rowProps={{ data }}
          ref={listRef}
        />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(DataList)
