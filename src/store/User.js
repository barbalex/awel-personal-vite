import { types } from 'mobx-state-tree'

export default types
  .model('User', {
    id: types.maybe(types.integer),
    name: types.maybe(types.union(types.string, types.integer, types.null)),
    letzteMutationZeit: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    letzteMutationUser: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
  })
  .volatile(() => ({
    pwd: null,
  }))
  .actions((self) => ({
    setPwd(pwd) {
      self.pwd = pwd
    },
  }))
