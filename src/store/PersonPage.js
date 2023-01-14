import { types } from 'mobx-state-tree'

export default types
  .model('PersonPage', {
    rows: types.array(types.integer),
    full: types.optional(types.boolean, false),
  })
  .actions(self => ({
    addRow(row) {
      self.rows.push(row)
    },
  }))
