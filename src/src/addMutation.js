import { splitJsonPath } from 'mobx-state-tree'
import flatten from 'lodash/flatten'
import findLast from 'lodash/findLast'

import { undoManager } from '../store'

const addMutation = ({ tableName, patch, inversePatch, store }) => {
  // watchMutations is false while data is loaded from server
  // as these additions should not be added to mutations
  if (!store?.watchMutations) return

  // need to wait for undoManager to list deletion
  setTimeout(async () => {
    let info
    const { username } = store
    const time = Date.now()
    const { op, path, value: valueIn } = patch
    const [index, field] = splitJsonPath(path)
    // do not document mutation documentation
    if (field && field.includes('letzteMutation')) return
    let previousValue = null
    const value =
      valueIn !== null && typeof valueIn === 'object'
        ? JSON.stringify(valueIn)
        : valueIn
    let rowId
    switch (op) {
      case 'add':
        rowId = valueIn.id
        break
      case 'remove': {
        /**
         * Problem:
         * - inversePatch is undefined
         * - patch has no value
         * - store[tableName][index] was already removed
         * so how get id or better value of removed dataset?
         * Solution: get this from undoManager's history
         * But: need to setTimeout to let undoManager catch up
         */
        const historyChanges = undoManager.history
        const historyInversePatches = flatten(
          historyChanges.map((c) => c.inversePatches),
        )
        const historyInversePatch =
          findLast(
            historyInversePatches,
            (p) => p.op === 'add' && p.path === `/${tableName}/${index}`,
          ) || {}
        previousValue = JSON.stringify(historyInversePatch.value)
        rowId = historyInversePatch.value.id
        break
      }
      case 'replace': {
        const storeObject = store[tableName][index]
        rowId = storeObject.id
        previousValue = inversePatch.value
        break
      }
      default:
      // do nothing
    }
    try {
      info = await window.electronAPI.editWithParam(
        `insert into mutations (time, user, op, tableName, rowId, field, value, previousValue, reverts) values (@time, @username, @op, @tableName, @rowId, @field, @value, @previousValue, @reverts)`,
        {
          username,
          time,
          tableName,
          op,
          rowId,
          field,
          value,
          previousValue,
          reverts: store.revertingMutationId,
        },
      )
    } catch (error) {
      store.addError(error)
      return console.log(error)
    }
    // 2. add to store
    // need to call other action as this happens inside timeout
    store.addMutation({
      id: info.lastInsertRowid,
      time,
      user: username,
      op,
      tableName,
      rowId,
      field,
      value,
      previousValue,
      reverts: store.revertingMutationId,
    })
  })
  store.setRevertingMutationId(null)
}

export default addMutation
