import keys from 'lodash/keys'
import lValues from 'lodash/values'
import findIndex from 'lodash/findIndex'

import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

const revertMutation = ({ self, mutationId }) => {
  const { mutations, db } = self
  const mutation = mutations.find((m) => m.id === mutationId)
  if (!mutation) {
    throw new Error(`Keine Mutation mit id ${mutationId} gefunden`)
  }
  self.revertingMutationId = mutationId
  const { op, tableName, rowId, field, previousValue } = mutation
  switch (op) {
    case 'replace': {
      // 1. check if dataset still exists, warn and exit if not
      const dataset = self[tableName].find((d) => d.id === rowId)
      if (!dataset) {
        throw new Error(
          `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht aktualisiert`,
        )
      }
      // 2. update value
      self.updateField({
        table: tableName,
        parentModel: tableName,
        field,
        // sqlite stores numbers in text fields by adding .0
        // need to convert to number or it will fail
        value: ifIsNumericAsNumber(previousValue),
        id: rowId,
      })
      break
    }
    case 'add': {
      // not in use
      // 1. check if dataset still exists, warn and exit if not
      const dataset = self[tableName].find((d) => d.id === rowId)
      if (!dataset) {
        throw new Error(
          `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht gelöscht`,
        )
      }
      // 2. remove dataset
      // write to db
      try {
        db.prepare(`delete from ${tableName} where id = ${rowId}`).run()
      } catch (error) {
        self.addError(error)
        return console.log(error)
      }
      // write to store
      self[tableName].splice(
        findIndex(self[tableName], (p) => p.id === rowId),
        1,
      )
      break
    }
    case 'remove': {
      // not in use
      // 1. check if dataset exists, warn and exit if does
      const dataset = self[tableName].find((d) => d.id === rowId)
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
        db.prepare(sql).run(...objectValues)
      } catch (error) {
        self.addError(error)
        return console.log(error)
      }
      // write to store
      self[tableName].push(previousObject)
      break
    }
    default:
    // do nothing
  }
}

export default revertMutation
