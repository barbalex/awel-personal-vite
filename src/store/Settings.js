import { types } from 'mobx-state-tree'

export default types.model('Settings', {
  id: types.integer,
  schluesselFormPath: types.union(types.string, types.null),
  personMutationWeiterleiten: types.union(types.string, types.null),
  verzeichnisZeilenhoeheMm: types.optional(types.number, 4),
  mutationFormPath: types.maybe(types.union(types.string, types.null)),
})
