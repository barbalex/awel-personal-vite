import fetchAnwesenheitstage from './fetchAnwesenheitstage'

const addPerson = ({ store }) => {
  const { db, username, addError, navigate } = store
  // 1. create new Person in db, returning id
  let info
  try {
    info = db
      .prepare(
        'insert into personen (letzteMutationUser, letzteMutationZeit, land, status) values (@user, @zeit, @land, @status)',
      )
      .run({
        user: username,
        zeit: Date.now(),
        land: 'Schweiz',
        status: 'aktiv',
      })
  } catch (error) {
    addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addPerson({
    id: info.lastInsertRowid,
    letzteMutationUser: username,
    letzteMutationZeit: Date.now(),
    land: 'Schweiz',
    status: 'aktiv',
  })
  navigate(`/Personen/${info.lastInsertRowid}`)
  // 3 requery anwesenheitstage (are added in db by trigger)
  fetchAnwesenheitstage({
    store,
  })
}

export default addPerson
