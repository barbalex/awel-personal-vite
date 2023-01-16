const fetchAmt = ({store, id})=>{
  const { addError, setWatchMutations, setAmt } = store

  let amt = []
  try {
    amt = await window.electronAPI.queryWithParam(
      'SELECT * from aemter where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }
  
  setWatchMutations(false)
  setAmt(amt)
  setWatchMutations(true)
}

export default fetchAmt