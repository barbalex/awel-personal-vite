import React from 'react'
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'

const FilterInputGroup = styled(InputGroup)`
  margin-top: 3px;
  width: 100%;
`
const EmptyAddon = styled(InputGroupAddon)`
  > span {
    background-color: white !important;
  }
`

const Filter = ({ value, onChange, empty }) => (
  <div>
    <FilterInputGroup size="sm">
      <Input value={value || ''} placeholder="filtern" onChange={onChange} />
      <EmptyAddon addonType="append" id="filterRemoveAddon" onClick={empty}>
        <span className="input-group-text">
          <FaTimes />
        </span>
      </EmptyAddon>
    </FilterInputGroup>
  </div>
)

export default Filter
