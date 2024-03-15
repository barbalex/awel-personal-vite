import React from 'react'
import { InputGroup, Input } from 'reactstrap'
// import { InputGroup, InputGroupAddon, Input } from 'reactstrap'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'

const FilterInputGroup = styled(InputGroup)`
  margin-top: 3px;
  width: 100%;
`
const EmptyAddon = styled.span`
  background-color: white !important;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0 !important;
  }
`

const Filter = ({ value, onChange, empty }) => (
  <div>
    <FilterInputGroup size="sm">
      <Input value={value || ''} placeholder="filtern" onChange={onChange} />
      <EmptyAddon className="input-group-text" onClick={empty}>
        <FaTimes />
      </EmptyAddon>
    </FilterInputGroup>
  </div>
)

export default Filter
