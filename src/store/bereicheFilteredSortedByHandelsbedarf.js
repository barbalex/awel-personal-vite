export default self =>
  self.bereicheFiltered.sort((a, b) => {
    if (self.showMutationNoetig) {
      if (a.mutationFrist && b.mutationFrist) {
        const aDate = new Date(a.mutationFrist)
        const bDate = new Date(b.mutationFrist)
        return aDate - bDate
      } else if (a.mutationFrist) {
        return -1
      } else if (b.mutationFrist) {
        return 1
      } else if (a.mutationNoetig && !b.mutationNoetig) {
        return -1
      } else if (!a.mutationNoetig && b.mutationNoetig) {
        return 1
      }
    }
    return (a.name || '').localeCompare(b.name || '', 'de-Ch')
  })
