import isNumeric from './isNumeric'

const ifIsNumericAsNumber = (value) => (isNumeric(value) ? +value : value)

export default ifIsNumericAsNumber
