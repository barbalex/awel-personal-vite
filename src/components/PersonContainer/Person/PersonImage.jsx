import React, { useContext, useCallback, useEffect, useState } from 'react'
import Dropzone, { useDropzone } from 'react-dropzone'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
import { UncontrolledTooltip } from 'reactstrap'
import { useParams } from 'react-router-dom'

import storeContext from '../../../storeContext.js'
import updateField from '../../../src/updateField.js'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: '1fr';
  grid-template-areas: 'dropzone';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  border: none;
  border-bottom: none;
  margin-bottom: 8px !important;
`
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
`
const StyledDropzone = styled.div`
  width: 100%;
  height: 100%;
  border-color: transparent;
`
const DropzoneInnerContainer = styled.div`
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #cccccc;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
  display: grid;
  justify-content: center;
  position: relative;
`
const Img = styled.img`
  max-width: 100%;
  max-height: 350px;
`
const Text = styled.div`
  justify-self: start;
`
const RemoveIcon = styled(FaTimes)`
  display: block;
  color: #ff8f00;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
  &:hover {
    color: red;
  }
`

const PersonImage = () => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, personen } = store
  const person = personen.find((p) => p.id === +personId) || {}

  // eslint-disable-next-line
  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [person.id])

  const onClickRemove = useCallback(
    (e) => {
      e.stopPropagation()
      updateField({
        table: 'personen',
        parentModel: 'personen',
        field: 'bildUrl',
        value: null,
        id: person.id,
        personId: +personId,
        setErrors,
        store,
      })
    },
    [person.id, personId, store],
  )
  const onDrop = useCallback(
    async (files) => {
      console.log('PersonImage.onDrop, files:', files)
      const file = files?.[0]
      console.log('PersonImage.onDrop, file:', file)

      // TODO: when clicking this
      // when dropping a file, files is an event WITHOUT files in the dataTransfer property
      let filePathOrig
      try {
        filePathOrig = await window.electronAPI.getPathForFile(file)
      } catch (error) {
        return console.log(
          'PersonImage.onDrop, error getting path for file:',
          error,
        )
      }
      const filePath = filePathOrig.replace(/\\/g, '/')
      console.log('PersonImage.onDrop, filePath from webUtils:', {
        filePath,
        filePathOrig,
      })
      updateField({
        table: 'personen',
        parentModel: 'personen',
        field: 'bildUrl',
        value: filePath,
        id: person.id,
        personId: +personId,
        setErrors,
        store,
      })
    },
    [person.id, personId, store],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      // useFsAccessApi: false
      noDragEventsBubbling: true,
    })

  const imageSrc =
    person.bildUrl ? `secure-protocol://${person.bildUrl}` : undefined

  console.log('PersonImage', { bildUrl: person.bildUrl, imageSrc })

  if (showFilter) return null

  return (
    <Container name="links">
      <DropzoneContainer title="Bild wählen">
        <StyledDropzone>
          <DropzoneInnerContainer
            {...getRootProps()}
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/gif': ['.gif'],
              'image/bmp': ['.bmp'],
              'image/webp': ['.webp'],
              'image/vnd.microsoft.icon': ['.ico'],
            }}
            getFilesFromEvent={(e) => Array.from(e.dataTransfer.files)}
            onDrop={onDrop}
          >
            {!!imageSrc ?
              <>
                <input {...getInputProps()} />
                <Img
                  src={imageSrc}
                  alt={`${person.vorname} ${person.name}`}
                  //width="185"
                />
                <RemoveIcon
                  id={`removeImage${person.Id}`}
                  onClick={onClickRemove}
                />
                <UncontrolledTooltip
                  placement="right"
                  target={`removeImage${person.Id}`}
                >
                  Bild entfernen
                </UncontrolledTooltip>
              </>
            : isDragActive ?
              <Text>jetzt fallen lassen...</Text>
            : isDragReject ?
              <Text>Hm. Da ging etwas schief :-(</Text>
            : <>
                <input {...getInputProps()} />
                <Text>Bild hierhin ziehen...</Text>
                <Text>...oder klicken, um es zu wählen.</Text>
              </>
            }
          </DropzoneInnerContainer>
        </StyledDropzone>
      </DropzoneContainer>
    </Container>
  )
}

export default observer(PersonImage)
