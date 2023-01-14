import React, { useCallback, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import Select from 'react-select'
import styled from 'styled-components'

const StyledSelect = styled(Select)`
  height: 38px;
  > div > div > div {
    top: 46% !important;
  }
  > div {
    background-color: rgba(255, 255, 255, 1) !important;
  }
  > div:focus-within {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  > div:hover {
    border-color: rgb(204, 204, 204);
  }
`

const noOptionsMessage = () => '(keine)'

const SharedSelect = ({ value, field, options, saveToDb }) => {
  const onChange = useCallback(
    option => saveToDb({ value: option ? option.value : null, field }),
    [field, saveToDb],
  )
  // need to return null instead of undefined if no option is found
  // otherwise field does not update
  const option = useMemo(() => options.find(o => o.value === value) || null, [
    options,
    value,
  ])

  return (
    <StyledSelect
      id={field}
      name={field}
      defaultValue={option}
      options={options}
      onChange={onChange}
      hideSelectedOptions
      placeholder=""
      isClearable
      isSearchable
      noOptionsMessage={noOptionsMessage}
    />
  )
}

export default observer(SharedSelect)
