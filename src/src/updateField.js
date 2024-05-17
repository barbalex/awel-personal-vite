import updatePersonsMutation from './updatePersonsMutation.js'

const updateField = async ({
  table,
  parentModel,
  field,
  value,
  id,
  setErrors,
  personId,
  store,
}) => {
  // 1. update in db
  try {
    await window.electronAPI.editWithParam(
      `update ${table} set ${field} = @value, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      {
        value,
        id,
        user: store.userName,
        time: Date.now(),
      },
    )
  } catch (error) {
    if (setErrors) {
      return setErrors({
        [field]: error.message,
      })
    }
    store.addError(error)
    return
  }
  // 2. update in store
  store.updateField({
    table,
    parentModel,
    field,
    value,
    id,
    setErrors,
  })
  if (
    [
      'links',
      'schluessel',
      'mobileAbos',
      'telefones',
      'funktionen',
      'kaderFunktionen',
      'etiketten',
      'anwesenheitstage',
    ].includes(parentModel) &&
    personId
  ) {
    // set persons letzteMutation
    updatePersonsMutation({ personId, store })
  }
}

export default updateField
