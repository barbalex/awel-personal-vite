import { types } from 'mobx-state-tree'

export default types.model('Mutation', {
  id: types.integer,
  time: types.maybe(types.union(types.string, types.integer, types.null)),
  user: types.maybe(types.union(types.string, types.integer, types.null)),
  tableName: types.maybe(types.union(types.string, types.integer, types.null)),
  op: types.maybe(types.union(types.string, types.integer, types.null)),
  rowId: types.maybe(types.union(types.integer, types.null)),
  field: types.maybe(types.union(types.string, types.integer, types.null)),
  value: types.maybe(types.union(types.string, types.integer, types.null)),
  previousValue: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  reverts: types.maybe(types.union(types.integer, types.null)),
})
