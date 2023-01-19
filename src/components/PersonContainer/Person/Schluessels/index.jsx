import React, { useContext, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button, ButtonGroup } from 'reactstrap'
import { MdEdit } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import Schluessel from './Schluessel'
import storeContext from '../../../../storeContext'
import addSchluessel from '../../../../src/addSchluessel'
import setSettingsKey from '../../../../src/setSettingsKey'

const Container = styled.div``
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const EFButtonGroup = styled(ButtonGroup)`
  margin-left: 5px;
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr 20px;
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Typ = styled.div`
  grid-column: 1 / span 1;
`
const Anlage = styled.div`
  grid-column: 2 / span 1;
`
const Bezeichnung = styled.div`
  grid-column: 3 / span 1;
`
const Nr = styled.div`
  grid-column: 4 / span 1;
`
const EditIcon = styled(MdEdit)`
  margin-top: -4px;
`
const PlusIcon = styled(FaPlus)`
  margin-top: -4px;
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${(props) => (props.row ? '16px' : '8px !important')};
`

const SchluesselsComponent = ({ row = true }) => {
  const { personId = 0 } = useParams()

  const store = useContext(storeContext)
  const { showFilter, filterSchluessel, settings } = store
  const uploader = useRef(null)

  let schluessels
  if (showFilter) {
    schluessels = [filterSchluessel]
  } else {
    schluessels = store.schluessel.filter((s) => s.idPerson === +personId)
  }
  const mayAddNew =
    !showFilter &&
    (schluessels.length === 0 ||
      !schluessels.map((s) => s.name).some((n) => n === null))

  const onClickChangePath = useCallback(() => uploader.current.click(), [])
  const onChangeFormPath = useCallback(
    (event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      if (file && file.path) {
        setSettingsKey({ key: 'schluesselFormPath', value: file.path, store })
      } else {
        console.log('Path not set')
      }
    },
    [store],
  )
  const onClickForm = useCallback(async () => {
    let success = false
    if (settings.schluesselFormPath) {
      // TODO: test
      success = await window.electronAPI.openUrl(settings.schluesselFormPath)
      if (!success) console.log('File could not be opened')
      return
    }
    console.log('no schluesselFormPath to open')
  }, [settings.schluesselFormPath])

  const Content = () => (
    <Container name="schluessel">
      {schluessels.length > 0 && (
        <Row>
          <Typ>Typ</Typ>
          <Anlage>Anlage</Anlage>
          <Bezeichnung>Bezeichnung</Bezeichnung>
          <Nr>Nr.</Nr>
          <div />
        </Row>
      )}
      {schluessels.map((schluessel) => (
        <Schluessel
          key={schluessel.id || 'filter'}
          id={schluessel.id || 'filter'}
        />
      ))}
      {mayAddNew && (
        <StyledButton
          title="neuer Schlüssel"
          onClick={() => addSchluessel({ personId: +personId, store })}
          outline
        >
          <PlusIcon id={`plusIconSchluessel${personId}`} />
        </StyledButton>
      )}
      {!showFilter && (
        <EFButtonGroup>
          <Button
            onClick={onClickForm}
            outline
            title={settings.schluesselFormPath || ''}
          >
            Empfangsformular
          </Button>
          <Button title="Pfad ändern" outline onClick={onClickChangePath}>
            <EditIcon size="22" id={`editIcon${personId}`} />
            <input
              type="file"
              id="file"
              ref={uploader}
              style={{ display: 'none' }}
              onChange={onChangeFormPath}
            />
          </Button>
        </EFButtonGroup>
      )}
    </Container>
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for="schluessel" sm={2}>
            Schlüssel
          </Label>
          <Col sm={10}>
            <Content />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for="schluessel">Schlüssel</NonRowLabel>
          <Content />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(SchluesselsComponent)
