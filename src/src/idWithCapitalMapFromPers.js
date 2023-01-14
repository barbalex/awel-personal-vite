import sortBy from 'lodash/sortBy'

const idWithCapitalMapFromPers = ({ personen, field = 'name' }) => {
  const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]
  const res = []
  /**
   * normally keep sorting by name
   * but for kurzzeichen need to sort by that
   * and needs to be lowercase
   */
  let personenToUse =
    field === 'kurzzeichen'
      ? sortBy(personen, (p) => p.kurzzeichen.toLowerCase())
      : personen
  personenToUse.forEach((p) => {
    const firstChar = (p[field] || '').charAt(0).toLowerCase()
    while (
      !!alphabet.length &&
      alphabet[0].toLowerCase().localeCompare(firstChar, 'de-Ch') <= 0
    ) {
      res.push(alphabet.shift())
    }
    res.push(p.id)
  })
  // add unused from alphabet
  return [...res, ...alphabet]
}

export default idWithCapitalMapFromPers
