import { useContext } from 'react'
import { List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'
import { ListRow } from './ListRow.jsx'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
  overflow: hidden;
  height: ${(props) => props['data-height']}px;
`

const BereichList = ({ dimensions, listRef }) => {
  const store = useContext(storeContext)
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const bereiche = store.bereicheFilteredSortedByHandelsbedarf

  return (
    <ErrorBoundary>
      <Container data-height={height}>
        <List
          rowComponent={ListRow}
          rowHeight={50}
          rowCount={bereiche.length}
          rowProps={{ bereiche }}
          ref={listRef}
        />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(BereichList)
