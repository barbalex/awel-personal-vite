import { types, getParent } from 'mobx-state-tree'

import PersonVerzeichnisColumn, {
  standard as standardColumn,
} from './PersonVerzeichnisColumn'

export default types
  .model('PersonVerzeichnisPage', {
    column0: PersonVerzeichnisColumn,
    column1: PersonVerzeichnisColumn,
    column2: PersonVerzeichnisColumn,
    activeColumnIndex: types.optional(types.integer, 0),
    full: types.optional(types.boolean, false),
  })
  .actions(self => ({
    addRow(row) {
      self[`column${self.activeColumnIndex}`].addRow(row)
    },
    moveRowToNewColumn(two) {
      const personVerzeichnis = getParent(self, 2)
      const activeColumn = self[`column${self.activeColumnIndex}`]
      activeColumn.setFull()
      personVerzeichnis.unshiftRemainingRows(activeColumn.rows.pop())
      if (two) {
        personVerzeichnis.unshiftRemainingRows(activeColumn.rows.pop())
      }
      if (self.activeColumnIndex < 2) {
        self.activeColumnIndex += 1
      } else {
        self.setFull()
        personVerzeichnis.newPage()
      }
      personVerzeichnis.addRow()
    },
    setFull() {
      self.full = true
    },
  }))

export const standard = {
  column0: standardColumn,
  column1: standardColumn,
  column2: standardColumn,
  activeColumnIndex: 0,
  full: false,
}
