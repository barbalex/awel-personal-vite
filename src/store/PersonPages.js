import { types, getParent } from 'mobx-state-tree'

import PersonPage from './PersonPage'

export default types
  .model('PersonPage', {
    pages: types.array(PersonPage),
    activePageIndex: types.optional(types.integer, 0),
    remainingRows: types.array(types.integer),
    building: types.optional(types.boolean, false),
    title: types.optional(types.union(types.string, types.integer), ''),
  })
  .actions(self => ({
    reset() {
      self.pages = []
      self.activePageIndex = 0
      self.remainingRows = []
      self.building = false
      self.title = ''
    },
    initiate() {
      const store = getParent(self, 1)
      const { personenFilteredSorted } = store
      self.reset()
      self.remainingRows = personenFilteredSorted.map(p => p.id)
      self.building = true
      self.pages.push({ rows: [], full: false })
    },
    setTitle(val) {
      self.title = val
    },
    setRemainingRows(rows) {
      self.remainingRows = rows
    },
    newPage() {
      self.activePageIndex += 1
      self.pages.push({ rows: [], full: false })
    },
    addRow() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.rows.push(self.remainingRows.shift())
      }
    },
    moveRowToNewPage() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.full = true
        self.remainingRows.unshift(activePage.rows.pop())
        self.newPage()
        self.addRow()
      }
    },
    stop() {
      self.building = false
    },
  }))
  .views(self => ({
    get modal() {
      const store = getParent(self, 1)
      const msgLine2Txt = `Bisher ${self.pages.length} Seiten, noch ${self.remainingRows.length} Personen zu verarbeiten`
      const textLine2 =
        store.personenFilteredSorted.length > 50 ? msgLine2Txt : ''

      return {
        textLine1: 'Der Bericht wird aufgebaut...',
        textLine2,
      }
    },
  }))
