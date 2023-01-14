const personenSorted = (personen) =>
  personen.slice().sort((a, b) => {
    const nameCompared = (a.name || '').localeCompare(b.name || '', 'de-Ch')
    if (nameCompared !== 0) return nameCompared
    return (a.vorname || '').localeCompare(b.vorname || '', 'de-Ch')
  })

export default personenSorted
