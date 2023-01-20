import { types } from 'mobx-state-tree'

export default types.model('User', {
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  password: types.maybe(types.union(types.string, types.integer, types.null)),
  letzteMutationZeit: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  letzteMutationUser: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
})
