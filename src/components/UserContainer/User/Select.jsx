import React, { useCallback } from 'react'
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

const SharedSelect = ({ value, field, options, saveToDb }) => {
  const onChange = useCallback(
    option => saveToDb({ value: option ? option.value : null, field }),
    [field, saveToDb],
  )

  return (
    <StyledSelect
      id={field}
      name={field}
      defaultValue={options.find(o => o.value === value)}
      options={options}
      onChange={onChange}
      hideSelectedOptions
      placeholder=""
      isClearable
      isSearchable
      noOptionsMessage={() => '(keine)'}
    />
  )
}

export default observer(SharedSelect)
