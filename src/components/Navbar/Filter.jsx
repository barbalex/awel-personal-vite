import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { FaTimes, FaEdit, FaFilter } from 'react-icons/fa'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'

const StyledDropdownItem = styled(DropdownItem)`
  background-color: ${(props) =>
    props['data-active'] ? '#f7f791 !important' : 'unset'};
  color: ${(props) => (props['data-active'] ? '#212529 !important' : 'unset')};
`
const VolltextInput = styled(Input)`
  background-color: ${(props) =>
    props.existsfilter === 'true' ? '#f7f791 !important' : '#e9ecef'};
`
const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: #f7f791 !important;
  cursor: pointer;
`
const StyledInputGroupText = styled(InputGroupText)`
  background-color: ${(props) =>
    props.existsfilter === 'true' ? '#f7f791 !important' : '#e9ecef'};
  cursor: pointer;
`
const FilterIconContainer = styled.div`
  padding-right: 10px;
`
const StyledDropdown = styled(Dropdown)`
  margin-right: -12px;
  margin-top: -8px;
  margin-bottom: -8px;
  min-width: 23px;
  min-height: 38px;
  .dropdown-toggle {
    min-height: 38px;
    padding-top: 5px;
    padding-right: 4px;
    min-width: 23px;
    border-left: 1px solid #ced4da;
  }
`

const Filter = () => {
  const { pathname } = useLocation()
  const { report } = useParams()

  const store = useContext(storeContext)
  const {
    filterPerson,
    filterAbteilung,
    filterSektion,
    filterBereich,
    filterAmt,
    showFilter,
    setShowFilter,
    filterFulltext,
    filterFulltextIds,
    setFilterFulltext,
    setFilter,
    setShowMutationNoetig,
    existsFilter,
    personPages,
    setFilterPersonKader,
    setFilterPersonAktivJetzt,
    setFilterPersonAktivJetztMitTel,
    setFilterPersonAktivJetztMitMobiltel,
    setFilterPersonAktivJetztMitKurzzeichen,
    addError,
    setFilterFulltextIds,
  } = store

  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false)

  const toggleShowFilter = useCallback(
    () => setShowFilter(!showFilter),
    [setShowFilter, showFilter],
  )

  const onChangeFilterFulltext = useCallback(
    async (e) => {
      // TODO: test
      setFilterFulltext(e.target.value)
      let result
      try {
        result = await window.electronAPI.query(
          `SELECT id from personenFts where data like '%${e.target.value}%'`,
        )
      } catch (error) {
        addError(error)
        return []
      }
      const ids = (result ?? []).map((p) => p.id)
      setFilterFulltextIds(ids)
      const activeNodeArray = pathname.split('/').filter((e) => e)
      if (
        e.target.value &&
        !filterFulltextIds.length &&
        activeNodeArray.length === 2
      ) {
        Navigate(`/${activeNodeArray[0]}`)
      }
    },
    [
      addError,
      filterFulltextIds,
      pathname,
      setFilterFulltext,
      setFilterFulltextIds,
    ],
  )
  const onBlurFilterFulltext = useCallback(() => {
    if (
      [
        'personFunktionen',
        'personPensionierte',
        'personKader',
        'personVerzTel',
        'personVerzMobiltel',
        'personVerzKurzzeichen',
      ].includes(report)
    ) {
      personPages.initiate()
    }
  }, [report, personPages])
  const onKeyPressFilterFulltext = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onBlurFilterFulltext(e)
      }
    },
    [onBlurFilterFulltext],
  )
  const onEmptyFilterFulltext = useCallback(() => {
    setFilterFulltext(null)
    setFilterFulltextIds([])
    if (
      [
        'personFunktionen',
        'personPensionierte',
        'personKader',
        'personVerzTel',
        'personVerzMobiltel',
        'personVerzKurzzeichen',
      ].includes(report)
    ) {
      personPages.initiate()
    }
  }, [setFilterFulltext, setFilterFulltextIds, report, personPages])

  const toggleFilterDropdown = useCallback(
    (e) => {
      setFilterDropdownIsOpen(!filterDropdownIsOpen)
      e.stopPropagation()
    },
    [filterDropdownIsOpen],
  )
  const onClickAnstehendeMutationen = useCallback(() => {
    const model = pathname.startsWith('/Personen')
      ? 'filterPerson'
      : pathname.startsWith('/Abteilungen')
        ? 'filterAbteilung'
        : pathname.startsWith('/Bereiche')
          ? 'filterBereich'
          : pathname.startsWith('/Sektionen')
            ? 'filterSektion'
            : pathname.startsWith('/Aemter')
              ? 'filterAmt'
              : 'filterPerson'
    setFilter({ model, value: { mutationNoetig: 1 } })
    setShowMutationNoetig(true)
  }, [pathname, setFilter, setShowMutationNoetig])
  const onClickKader = useCallback(() => {
    setFilterPersonKader(true)
  }, [setFilterPersonKader])
  const onClickAktivJetzt = useCallback(() => {
    setFilterPersonAktivJetzt(true)
  }, [setFilterPersonAktivJetzt])
  const onClickAktivJetztMitTel = useCallback(() => {
    setFilterPersonAktivJetztMitTel(true)
  }, [setFilterPersonAktivJetztMitTel])
  const onClickAktivJetztMitMobiltel = useCallback(() => {
    setFilterPersonAktivJetztMitMobiltel(true)
  }, [setFilterPersonAktivJetztMitMobiltel])
  const onClickAktivJetztMitKurzzeichen = useCallback(() => {
    setFilterPersonAktivJetztMitKurzzeichen(true)
  }, [setFilterPersonAktivJetztMitKurzzeichen])

  return (
    <ErrorBoundary>
      <div>
        <InputGroup>
          <VolltextInput
            placeholder="Volltext filtern"
            onChange={onChangeFilterFulltext}
            onBlur={onBlurFilterFulltext}
            value={filterFulltext || ''}
            onKeyPress={onKeyPressFilterFulltext}
            existsfilter={filterFulltextIds.length ? 'true' : 'false'}
          />
          <>
            {filterFulltext && (
              <VolltextFilterRemoveAddon
                id="volltextFilterRemoveAddon"
                onClick={onEmptyFilterFulltext}
              >
                <FaTimes />
              </VolltextFilterRemoveAddon>
            )}
            <StyledInputGroupText
              id="filterAddon"
              onClick={toggleShowFilter}
              existsfilter={existsFilter.toString()}
            >
              <FilterIconContainer>
                {showFilter ? <FaEdit /> : <FaFilter />}
              </FilterIconContainer>
              {filterFulltext && (
                <UncontrolledTooltip
                  placement="left"
                  target="volltextFilterRemoveAddon"
                >
                  Volltext-Filter leeren
                </UncontrolledTooltip>
              )}
              <UncontrolledTooltip placement="left" target="filterAddon">
                {showFilter ? 'Daten bearbeiten' : 'Nach Feldern filtern'}
              </UncontrolledTooltip>
              {existsFilter && (
                <UncontrolledTooltip placement="left" target="emptyFilterAddon">
                  Filter leeren
                </UncontrolledTooltip>
              )}
              <StyledDropdown
                isOpen={filterDropdownIsOpen}
                toggle={toggleFilterDropdown}
              >
                <DropdownToggle caret tag="div">
                  {' '}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>vorbereitete Filter</DropdownItem>
                  <StyledDropdownItem
                    data-active={
                      pathname.startsWith('/Personen')
                        ? filterPerson?.mutationNoetig === 1
                        : pathname.startsWith('/Abteilungen')
                          ? filterAbteilung?.mutationNoetig === 1
                          : pathname.startsWith('/Bereiche')
                            ? filterBereich?.mutationNoetig === 1
                            : pathname.startsWith('/Sektionen')
                              ? filterSektion?.mutationNoetig === 1
                              : pathname.startsWith('/Aemter')
                                ? filterAmt?.mutationNoetig === 1
                                : false
                    }
                    onClick={onClickAnstehendeMutationen}
                  >
                    Anstehende Mutationen
                  </StyledDropdownItem>
                  {pathname.startsWith('/Personen') && (
                    <>
                      <StyledDropdownItem
                        data-active={store.filterPersonAktivJetzt}
                        onClick={onClickAktivJetzt}
                      >
                        aktuell aktiv (bereits eingetreten)
                      </StyledDropdownItem>
                      <StyledDropdownItem
                        data-active={store.filterPersonAktivJetztMitTel}
                        onClick={onClickAktivJetztMitTel}
                      >
                        aktuell aktiv, mit Telefon
                      </StyledDropdownItem>
                      <StyledDropdownItem
                        data-active={store.filterPersonAktivJetztMitMobiltel}
                        onClick={onClickAktivJetztMitMobiltel}
                      >
                        aktuell aktiv, mit Mobil-Telefon
                      </StyledDropdownItem>
                      <StyledDropdownItem
                        data-active={store.filterPersonAktivJetztMitKurzzeichen}
                        onClick={onClickAktivJetztMitKurzzeichen}
                      >
                        aktuell aktiv, mit Kurzzeichen
                      </StyledDropdownItem>
                      <StyledDropdownItem
                        data-active={store.filterPersonKader}
                        onClick={onClickKader}
                      >
                        Kader
                      </StyledDropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </StyledDropdown>
            </StyledInputGroupText>
            {existsFilter && (
              <StyledInputGroupText
                id="emptyFilterAddon"
                onClick={store.emptyFilter}
                existsfilter={existsFilter.toString()}
              >
                <FaTimes />
              </StyledInputGroupText>
            )}
          </>
        </InputGroup>
      </div>
    </ErrorBoundary>
  )
}

export default observer(Filter)
