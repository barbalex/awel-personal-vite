import { types } from 'mobx-state-tree'

export default types.model('SchluesselTypWert', {
  id: types.integer,
  value: types.maybe(types.union(types.string, types.integer, types.null)),
  deleted: types.optional(types.integer, 0),
  historic: types.optional(types.integer, 0),
  sort: types.maybe(types.union(types.integer, types.null)),
})
