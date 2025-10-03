import { useContext } from 'react'
import { List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import { ListRow } from './ListRow.jsx'
import storeContext from '../../storeContext.js'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
  height: ${(props) => props['data-height']}px;
`

const AbteilungList = ({ dimensions, listRef }) => {
  const store = useContext(storeContext)
  const abteilungen = store.abteilungenFilteredSortedByHandlungsbedarf

  const height = isNaN(dimensions.height) ? 250 : dimensions.height

  return (
    <ErrorBoundary>
      <Container data-height={height}>
        <List
          rowComponent={ListRow}
          rowHeight={50}
          rowCount={abteilungen.length}
          rowProps={{ abteilungen }}
          ref={listRef}
        />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AbteilungList)
