import React from 'react'
import styled from 'styled-components'

const Content = styled.div``
const Label = styled.label`
  font-size: smaller;
  margin-bottom: 0;
  color: grey;
`
const Value = styled.p`
  margin-bottom: 2px;
`

const InputValue = ({ label, value }) => {
  if (!value && value !== 0) return null
  return (
    <Content>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Content>
  )
}

export default InputValue
