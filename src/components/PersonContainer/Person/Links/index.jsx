import React, { useContext, useCallback } from 'react'
import Dropzone from 'react-dropzone'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label } from 'reactstrap'
import { useParams } from 'react-router-dom'

import storeContext from '../../../../storeContext.js'
import Link from './Link.jsx'
import addLink from '../../../../src/addLink.js'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: rgba(0, 0, 0, 0);
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'links links dropzone';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  border: none;
  border-bottom: none;
`
const Links = styled.div``
const DropzoneContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`
const StyledDropzone = styled(Dropzone)`
  width: 100%;
  height: 100%;
  border-color: transparent;
`
const DropzoneInnerDiv = styled.div`
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #cccccc;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
`

const LinksComponent = ({ row = true }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { links } = store
  const myLinks = links.filter((l) => l.idPerson === +personId)

  const onDrop = useCallback(
    (files) => {
      console.log('files:', files)
      addLink({ url: files[0].path, personId: +personId, store })
    },
    [personId, store],
  )

  // Need useFsAccessApi false when using react-dropzone v12 in electron
  // https://github.com/react-dropzone/file-selector/issues/52#issuecomment-1030834961
  const Drop = () => (
    <Container name="links">
      <DropzoneContainer>
        <StyledDropzone onDrop={onDrop} useFsAccessApi={false}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
            if (isDragActive) {
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <div>jetzt fallen lassen...</div>
                </DropzoneInnerDiv>
              )
            }
            if (isDragReject) {
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <div>Hm. Da ging etwas schief :-(</div>
                </DropzoneInnerDiv>
              )
            }
            return (
              <DropzoneInnerDiv {...getRootProps()}>
                <input {...getInputProps()} />
                <div>Datei hierhin ziehen...</div>
                <div>...oder klicken, um sie zu wählen.</div>
              </DropzoneInnerDiv>
            )
          }}
        </StyledDropzone>
      </DropzoneContainer>
      <Links>
        {myLinks.map((link) => (
          <Link key={`${link.idPerson}${link.url}`} link={link} />
        ))}
      </Links>
    </Container>
  )

  return (
    <FormGroup row={row}>
      {row ? (
        <>
          <Label for="links" sm={2}>
            Datei-Links
          </Label>
          <Col sm={10}>
            <Drop />
          </Col>
        </>
      ) : (
        <>
          <Label for="links">Datei-Links</Label>
          <Drop />
        </>
      )}
    </FormGroup>
  )
}

export default observer(LinksComponent)
