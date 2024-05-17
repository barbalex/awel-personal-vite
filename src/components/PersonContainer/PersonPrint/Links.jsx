import React, { useContext } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import storeContext from '../../../storeContext.js'

const Label = styled.label`
  font-size: smaller;
  margin-bottom: 0;
  color: grey;
`
const Value = styled.p`
  margin-bottom: 0;
`
const Row = styled.div`
  border-bottom: thin solid #dedede;
  border-top: ${(props) => (props.index === 0 ? 'thin solid #dedede' : 'none')};
`

const Links = () => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { links } = store
  const myLinks = links.filter((l) => l.idPerson === +personId)

  if (myLinks.length === 0) return null

  return (
    <>
      <Label>Datei-Links</Label>
      {myLinks.map((link, index) => (
        <Row key={link.id} index={index}>
          <Value>{link.url}</Value>
        </Row>
      ))}
    </>
  )
}

export default Links
