import keys from 'lodash/keys'
import lValues from 'lodash/values'

import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'
import updateField from '../src/updateField'

const revertMutation = async ({ store, mutationId }) => {
  const { mutations } = store
  const mutation = mutations.find((m) => m.id === mutationId)
  if (!mutation) {
    throw new Error(`Keine Mutation mit id ${mutationId} gefunden`)
  }
  store.revertingMutationId = mutationId
  const { op, tableName, rowId, field, previousValue } = mutation
  switch (op) {
    case 'replace': {
      // 1. check if dataset still exists, warn and exit if not
      const dataset = store[tableName].find((d) => d.id === rowId)
      if (!dataset) {
        throw new Error(
          `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht aktualisiert`,
        )
      }
      // 2. update value
      updateField({
        table: tableName,
        parentModel: tableName,
        field,
        // sqlite stores numbers in text fields by adding .0
        // need to convert to number or it will fail
        value: ifIsNumericAsNumber(previousValue),
        id: rowId,
        store: store,
      })
      break
    }
    case 'add': {
      // not in use
      // 1. check if dataset still exists, warn and exit if not
      const dataset = store[tableName].find((d) => d.id === rowId)
      if (!dataset) {
        throw new Error(
          `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht gelöscht`,
        )
      }
      // 2. remove dataset
      // write to db
      try {
        await window.electronAPI.edit(
          `delete from ${tableName} where id = ${rowId}`,
        )
      } catch (error) {
        store.addError(error)
        return console.log(error)
      }
      // write to store
      store.removeFromTable({ table: tableName, id: rowId })
      break
    }
    case 'remove': {
      // not in use
      // 1. check if dataset exists, warn and exit if does
      const dataset = store[tableName].find((d) => d.id === rowId)
      if (dataset) {
        throw new Error(
          `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert. Daher wird er nicht wiederhergestellt`,
        )
      }
      // 2. add dataset
      // write to db
      const previousObject = JSON.parse(previousValue)
      // need to remove keys with value null
      Object.keys(previousObject).forEach(
        (key) => previousObject[key] == null && delete previousObject[key],
      )
      const objectKeys = keys(previousObject).join()
      const objectValues = lValues(previousObject)
      const sql = `insert into ${tableName} (${objectKeys}) values (${objectValues
        .map(() => '?')
        .join()})`
      try {
        await window.electronAPI.edit(sql)
      } catch (error) {
        store.addError(error)
        return console.log(error)
      }
      // write to store
      store.addToTable({ table: tableName, value: previousObject })
      break
    }
    default:
    // do nothing
  }
}

export default revertMutation
