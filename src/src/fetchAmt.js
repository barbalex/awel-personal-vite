const fetchAmt = async ({ store, id }) => {
  const { addError, setWatchMutations, setAmt } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from aemter where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const amt = result?.[0]
  if (!amt) return

  setWatchMutations(false)
  setAmt(amt)
  setWatchMutations(true)
}

export default fetchAmt
