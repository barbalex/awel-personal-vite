import isNumeric from './isNumeric.js'

const ifIsNumericAsNumber = (value) => (isNumeric(value) ? +value : value)

export default ifIsNumericAsNumber
