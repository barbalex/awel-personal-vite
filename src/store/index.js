import { types, splitJsonPath } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import findIndex from 'lodash/findIndex'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import last from 'lodash/last'

import Amt from './Amt'
import Abteilung from './Abteilung'
import Settings from './Settings'
import Bereich from './Bereich'
import Sektion from './Sektion'
import Etikett from './Etikett'
import Anwesenheitstag from './Anwesenheitstag'
import AnredeWert from './AnredeWert'
import FunktionWert from './FunktionWert'
import KaderFunktionWert from './KaderFunktionWert'
import KostenstelleWert from './KostenstelleWert'
import Link from './Link'
import Schluessel from './Schluessel'
import MobileAbo from './MobileAbo'
import Telefon from './Telefon'
import Funktion from './Funktion'
import KaderFunktion from './KaderFunktion'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert'
import MobileAboTypWert from './MobileAboTypWert'
import TelefonTypWert from './TelefonTypWert'
import SchluesselTypWert from './SchluesselTypWert'
import SchluesselAnlageWert from './SchluesselAnlageWert'
import EtikettWert from './EtikettWert'
import AnwesenheitstagWert from './AnwesenheitstagWert'
import LandWert from './LandWert'
import MutationartWert from './MutationartWert'
import StandortWert from './StandortWert'
import Person from './Person'
import Mutation from './Mutation'
import StatusWert from './StatusWert'
import TagWert from './TagWert'
import PersonPages from './PersonPages'
import PersonVerzeichnisPages from './PersonVerzeichnisPages'
import personenFiltered from './personenFiltered'
import personenSorted from './personenSorted'
import personenSortedByHandlungsbedarf from './personenSortedByHandlungsbedarf'
import aemterFiltered from './aemterFiltered'
import aemterFilteredSortedByHandlungsbedarf from './aemterFilteredSortedByHandlungsbedarf'
import abteilungenFiltered from './abteilungenFiltered'
import abteilungenFilteredSortedByHandlungsbedarf from './abteilungenFilteredSortedByHandlungsbedarf'
import bereicheFiltered from './bereicheFiltered'
import bereicheFilteredSortedByHandelsbedarf from './bereicheFilteredSortedByHandelsbedarf'
import sektionenFiltered from './sektionenFiltered'
import sektionenFilteredSortedByHandelsbedarf from './sektionenFilteredSortedByHandelsbedarf'
import revertMutation from './revertMutation'

const store = () =>
  types
    .model({
      dirty: types.optional(types.boolean, false),
      deletionMessage: types.maybeNull(types.string),
      deletionTitle: types.maybeNull(types.string),
      etiketten: types.array(Etikett),
      anwesenheitstage: types.array(Anwesenheitstag),
      anredeWerte: types.array(AnredeWert),
      funktionWerte: types.array(FunktionWert),
      kaderFunktionWerte: types.array(KaderFunktionWert),
      kostenstelleWerte: types.array(KostenstelleWert),
      links: types.array(Link),
      schluessel: types.array(Schluessel),
      mobileAbos: types.array(MobileAbo),
      telefones: types.array(Telefon),
      funktionen: types.array(Funktion),
      kaderFunktionen: types.array(KaderFunktion),
      mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
      mobileAboTypWerte: types.array(MobileAboTypWert),
      telefonTypWerte: types.array(TelefonTypWert),
      schluesselTypWerte: types.array(SchluesselTypWert),
      schluesselAnlageWerte: types.array(SchluesselAnlageWert),
      etikettWerte: types.array(EtikettWert),
      anwesenheitstagWerte: types.array(AnwesenheitstagWert),
      landWerte: types.array(LandWert),
      mutationArtWerte: types.array(MutationartWert),
      standortWerte: types.array(StandortWert),
      personen: types.array(Person),
      aemter: types.array(Amt),
      abteilungen: types.array(Abteilung),
      settings: types.optional(Settings, {
        id: 1,
        schluesselFormPath: null,
        personMutationWeiterleiten: null,
      }),
      bereiche: types.array(Bereich),
      sektionen: types.array(Sektion),
      mutations: types.array(Mutation),
      showDeleted: types.optional(types.boolean, false),
      showMutationNoetig: types.optional(types.boolean, false),
      statusWerte: types.array(StatusWert),
      tagWerte: types.array(TagWert),
      username: types.maybe(types.string),
      watchMutations: types.optional(types.boolean, false),
      revertingMutationId: types.maybe(types.union(types.integer, types.null)),
      history: types.optional(UndoManager, {}),
      filterPerson: types.optional(Person, {}),
      filterPersonKader: types.optional(types.boolean, false),
      filterPersonAktivJetzt: types.optional(types.boolean, true),
      filterPersonAktivJetztMitTel: types.optional(types.boolean, false),
      filterPersonAktivJetztMitMobiltel: types.optional(types.boolean, false),
      filterPersonAktivJetztMitKurzzeichen: types.optional(
        types.boolean,
        false,
      ),
      filterAmt: types.optional(Amt, {}),
      filterAbteilung: types.optional(Abteilung, {}),
      filterBereich: types.optional(Bereich, {}),
      filterSektion: types.optional(Sektion, {}),
      filterEtikett: types.optional(Etikett, {}),
      filterAnwesenheitstage: types.optional(Anwesenheitstag, {}),
      filterLink: types.optional(Link, {}),
      filterSchluessel: types.optional(Schluessel, {}),
      filterMobileAbo: types.optional(MobileAbo, {}),
      filterTelefon: types.optional(Telefon, {}),
      filterFunktion: types.optional(Funktion, {}),
      filterKaderFunktion: types.optional(KaderFunktion, {}),
      showFilter: types.optional(types.boolean, false),
      filterFulltext: types.maybe(
        types.union(types.string, types.integer, types.null),
      ),
      filterFulltextIds: types.optional(types.array(types.integer), []),
      personPages: types.optional(PersonPages, {
        pages: [],
        activePageIndex: 0,
        remainingRows: [],
        building: false,
        title: '',
      }),
      personVerzeichnis: types.optional(PersonVerzeichnisPages, {
        pages: [],
        activePageIndex: 0,
        remainingRows: [],
        building: false,
      }),
      pathname: types.optional(types.string, ''),
    })
    .volatile(() => ({
      deletionCallback: null,
      errors: [],
      navigate: undefined,
    }))
    .views((self) => ({
      get existsFilter() {
        const {
          filterPerson,
          filterPersonKader,
          filterPersonAktivJetzt,
          filterPersonAktivJetztMitTel,
          filterPersonAktivJetztMitMobiltel,
          filterPersonAktivJetztMitKurzzeichen,
          filterAmt,
          filterAbteilung,
          filterBereich,
          filterSektion,
          filterEtikett,
          filterAnwesenheitstage,
          filterLink,
          filterSchluessel,
          filterMobileAbo,
          filterTelefon,
          filterFunktion,
          filterKaderFunktion,
        } = self
        return (
          [
            ...Object.values(filterPerson),
            ...Object.values(filterAmt),
            ...Object.values(filterAbteilung),
            ...Object.values(filterBereich),
            ...Object.values(filterSektion),
            ...Object.values(filterEtikett),
            ...Object.values(filterAnwesenheitstage),
            ...Object.values(filterLink),
            ...Object.values(filterSchluessel),
            ...Object.values(filterMobileAbo),
            ...Object.values(filterTelefon),
            ...Object.values(filterFunktion),
            ...Object.values(filterKaderFunktion),
          ].filter((v) => v).length > 0 ||
          filterPersonKader ||
          filterPersonAktivJetzt ||
          filterPersonAktivJetztMitTel ||
          filterPersonAktivJetztMitMobiltel ||
          filterPersonAktivJetztMitKurzzeichen
        )
      },
      get personenSorted() {
        return personenSorted(self.personen)
      },
      get personenFiltered() {
        return personenFiltered({ self })
      },
      get personenFilteredSorted() {
        return personenSorted(self.personenFiltered)
      },
      get personenFilteredSortedByHandlungsbedarf() {
        return personenSortedByHandlungsbedarf(self)
      },
      get aemterFiltered() {
        return aemterFiltered(self)
      },
      get aemterFilteredSorted() {
        return self.aemterFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get aemterFilteredSortedByHandlungsbedarf() {
        return aemterFilteredSortedByHandlungsbedarf(self)
      },
      get abteilungenFiltered() {
        return abteilungenFiltered(self)
      },
      get abteilungenFilteredSorted() {
        return self.abteilungenFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get abteilungenFilteredSortedByHandlungsbedarf() {
        return abteilungenFilteredSortedByHandlungsbedarf(self)
      },
      get bereicheFiltered() {
        return bereicheFiltered(self)
      },
      get bereicheFilteredSorted() {
        return self.bereicheFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get bereicheFilteredSortedByHandelsbedarf() {
        return bereicheFilteredSortedByHandelsbedarf(self)
      },
      get sektionenFiltered() {
        return sektionenFiltered(self)
      },
      get sektionenFilteredSorted() {
        return self.sektionenFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get sektionenFilteredSortedByHandelsbedarf() {
        return sektionenFilteredSortedByHandelsbedarf(self)
      },
      get revertedMutationIds() {
        return self.mutations.filter((m) => !!m.reverts).map((m) => m.reverts)
      },
      get userRevertions() {
        return sortBy(
          self.mutations
            .filter((m) => m.user === self.username)
            .filter((m) => self.revertedMutationIds.includes(m.id)),
          'time',
        )
      },
      get userMutations() {
        // lists active user's mutations
        // that have not been reverted
        // and are themselves not revertions
        return sortBy(
          self.mutations
            .filter((m) => m.user === self.username)
            .filter((m) => !m.reverts)
            .filter((m) => !self.revertedMutationIds.includes(m.id)),
          'time',
        )
      },
      get lastUserMutation() {
        // revert this one to undo last action
        return last(self.userMutations)
      },
      get lastUserMutationRevertion() {
        // revert this one to revert last undo
        return last(self.userRevertions)
      },
    }))
    .actions((self) => {
      setUndoManager(self)

      return {
        setNavigate(val) {
          self.navigate = val
        },
        setPathname(val) {
          self.pathname = val
        },
        setDirty(val) {
          self.dirty = val
        },
        setFilter({ model, value }) {
          self[model] = value
          if (self.filterFulltext) {
            self.filterFulltext = null
            this.setFilterFulltextIds([])
          }
        },
        setFilterFulltext(value) {
          self.filterFulltext = value
          // remove other filters
          if (value && self.existsFilter) self.emptyFilterButFulltext()
          if (self.showFilter) self.showFilter = false
        },
        setFilterFulltextIds(ids) {
          self.filterFulltextIds = ids
        },
        emptyFilter() {
          self.filterPerson = {}
          self.filterPersonKader = false
          self.filterPersonAktivJetzt = false
          self.filterPersonAktivJetztMitTel = false
          self.filterPersonAktivJetztMitMobiltel = false
          self.filterPersonAktivJetztMitKurzzeichen = false
          self.filterAbteilung = {}
          self.filterBereich = {}
          self.filterSektion = {}
          self.filterAmt = {}
          self.filterEtikett = {}
          self.filterAnwesenheitstage = {}
          self.filterLink = {}
          self.filterSchluessel = {}
          self.filterKostenstelle = {}
          self.filterMobileAbo = {}
          self.filterTelefon = {}
          self.filterFunktion = {}
          self.filterKaderFunktion = {}
          self.filterFulltext = null
          self.filterFulltextIds = []
        },
        emptyFilterButFulltext() {
          self.filterPerson = {}
          self.filterPersonKader = false
          self.filterPersonAktivJetzt = false
          self.filterPersonAktivJetztMitTel = false
          self.filterPersonAktivJetztMitMobiltel = false
          self.filterPersonAktivJetztMitKurzzeichen = false
          self.filterAbteilung = {}
          self.filterBereich = {}
          self.filterSektion = {}
          self.filterAmt = {}
          self.filterEtikett = {}
          self.filterAnwesenheitstage = {}
          self.filterLink = {}
          self.filterSchluessel = {}
          self.filterKostenstelle = {}
          self.filterMobileAbo = {}
          self.filterTelefon = {}
          self.filterFunktion = {}
          self.filterKaderFunktion = {}
        },
        setShowFilter(value) {
          self.showFilter = value
          if (value && self.filterFulltext) {
            self.filterFulltext = null
            self.filterFulltextIds = []
          }
        },
        setUsername(name) {
          self.username = name
        },
        setDeletionCallback(callback) {
          self.deletionCallback = callback
        },
        setDeletionTitle(title) {
          self.deletionTitle = title
        },
        setDeletionMessage(message) {
          self.deletionMessage = message
        },
        setWatchMutations(val) {
          self.watchMutations = val
        },
        setPerson(person) {
          if (!person?.id) return

          const ownPerson = self.sektionen.find((a) => a.id === person.id)
          if (!ownPerson) return

          Object.keys(person).forEach((key) => (ownPerson[key] = person[key]))
        },
        setPersonen(personen) {
          self.watchMutations = false
          self.personen = personen
          self.watchMutations = true
        },
        setAmt(amt) {
          const ownAmt = self.aemter.find((a) => a.id === amt.id)
          Object.keys(amt).forEach((key) => (ownAmt[key] = amt[key]))
        },
        setAemter(aemter) {
          self.watchMutations = false
          self.aemter = aemter
          self.watchMutations = true
        },
        setAbteilung(abteilung) {
          const ownAbteilung = self.abteilungen.find(
            (a) => a.id === abteilung.id,
          )
          Object.keys(abteilung).forEach(
            (key) => (ownAbteilung[key] = abteilung[key]),
          )
        },
        setAbteilungen(abteilungen) {
          self.watchMutations = false
          self.abteilungen = abteilungen
          self.watchMutations = true
        },
        setBereich(bereich) {
          const ownBereich = self.bereiche.find((a) => a.id === bereich.id)
          Object.keys(bereich).forEach(
            (key) => (ownBereich[key] = bereich[key]),
          )
        },
        setBereiche(bereiche) {
          self.watchMutations = false
          self.bereiche = bereiche
          self.watchMutations = true
        },
        setSektion(sektion) {
          const ownSektion = self.sektionen.find((a) => a.id === sektion.id)
          Object.keys(sektion).forEach(
            (key) => (ownSektion[key] = sektion[key]),
          )
        },
        setSektionen(sektionen) {
          self.watchMutations = false
          self.sektionen = sektionen
          self.watchMutations = true
        },
        setMutations(mutations) {
          self.mutations = mutations
        },
        setEtiketten(etiketten) {
          self.watchMutations = false
          self.etiketten = etiketten
          self.watchMutations = true
        },
        setAnwesenheitstage(anwesenheitstage) {
          self.watchMutations = false
          self.anwesenheitstage = anwesenheitstage
          self.watchMutations = true
        },
        setLinks(links) {
          self.watchMutations = false
          self.links = links
          self.watchMutations = true
        },
        setSchluessel(schluessel) {
          self.watchMutations = false
          self.schluessel = schluessel
          self.watchMutations = true
        },
        setKostenstelle(kostenstelle) {
          self.watchMutations = false
          self.kostenstelle = kostenstelle
          self.watchMutations = true
        },
        setMobileAbos(mobileAbos) {
          self.watchMutations = false
          self.mobileAbos = mobileAbos
          self.watchMutations = true
        },
        setTelefones(telefones) {
          self.watchMutations = false
          self.telefones = telefones
          self.watchMutations = true
        },
        setFunktionen(funktionen) {
          self.watchMutations = false
          self.funktionen = funktionen
          self.watchMutations = true
        },
        setKaderFunktionen(kaderFunktionen) {
          self.watchMutations = false
          self.kaderFunktionen = kaderFunktionen
          self.watchMutations = true
        },
        setWerte({ table, values }) {
          self.watchMutations = false
          self[table] = values
          self.watchMutations = true
        },
        setShowDeleted(show) {
          self.showDeleted = show
        },
        setShowMutationNoetig(show) {
          self.showMutationNoetig = show
        },
        revertMutation(mutationId) {
          revertMutation({ self, mutationId })
        },
        addToTable({ table, value }) {
          self[table].push(value)
        },
        addPerson(val) {
          self.personen.push(val)
        },
        addAmt(val) {
          self.aemter.push(val)
        },
        addAbteilung(val) {
          self.abteilungen.push(val)
        },
        addBereich(val) {
          self.bereiche.push(val)
        },
        addSektion(val) {
          self.sektionen.push(val)
        },
        setRevertingMutationId(val) {
          self.revertingMutationId = val
        },
        removePerson(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.personen. Consequence:
           * all other personen are re-added and listet as mutations of op 'add'
           */
          self.personen.splice(
            findIndex(self.personen, (p) => p.id === id),
            1,
          )
        },
        removeWert({ table, id }) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.personen. Consequence:
           * all other personen are re-added and listet as mutations of op 'add'
           */
          store[table].splice(
            findIndex(store[table], (p) => p.id === id),
            1,
          )
        },
        removeFromTable({ table, id }) {
          self[table].splice(
            findIndex(self[table], (p) => p.id === id),
            1,
          )
        },
        setAmtDeleted(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              `update aemter set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              { id, user: self.username, time: Date.now() },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const amt = self.aemter.find((p) => p.id === id)
          amt.deleted = 1
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Aemter`)
        },
        setAbteilungDeleted(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              `update abteilungen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              { id, user: self.username, time: Date.now() },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const abteilung = self.abteilungen.find((p) => p.id === id)
          abteilung.deleted = 1
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Abteilungen`)
        },
        deleteAmt(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from aemter where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.aemter. Consequence:
           * all other aemter are re-added and listet as mutations of op 'add'
           */
          self.aemter.splice(
            findIndex(self.aemter, (p) => p.id === id),
            1,
          )
          self.navigate(`/Aemter`)
        },
        deleteAbteilung(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from abteilungen where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.abteilungen. Consequence:
           * all other abteilungen are re-added and listet as mutations of op 'add'
           */
          self.abteilungen.splice(
            findIndex(self.abteilungen, (p) => p.id === id),
            1,
          )
          self.navigate(`/Abteilungen`)
        },
        setBereichDeleted(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              `update bereiche set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              { id, user: self.username, time: Date.now() },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const bereich = self.bereiche.find((p) => p.id === id)
          bereich.deleted = 1
          bereich.letzteMutationUser = self.username
          bereich.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Bereiche`)
        },
        deleteBereich(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from bereiche where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.bereiche. Consequence:
           * all other bereiche are re-added and listet as mutations of op 'add'
           */
          self.bereiche.splice(
            findIndex(self.bereiche, (p) => p.id === id),
            1,
          )
          self.navigate(`/Bereiche`)
        },
        setSektionDeleted(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              `update sektionen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              { id, user: self.username, time: Date.now() },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const sektion = self.sektionen.find((p) => p.id === id)
          sektion.deleted = 1
          sektion.letzteMutationUser = self.username
          sektion.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Sektionen`)
        },
        deleteSektion(id) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from sektionen where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.sektionen. Consequence:
           * all other sektionen are re-added and listet as mutations of op 'add'
           */
          self.sektionen.splice(
            findIndex(self.sektionen, (p) => p.id === id),
            1,
          )
          self.navigate(`/Sektionen`)
        },
        addEtikett({ etikett, personId }) {
          // 1. create new etikett in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (@idPerson, @etikett, @letzteMutationUser, @letzteMutationZeit)',
              {
                idPerson: personId,
                etikett,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.etiketten.push({
            id: info.lastInsertRowid,
            etikett,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteEtikett({ etikett, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from etiketten where idPerson = @idPerson and etikett = @etikett',
              { idPerson: personId, etikett },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.etiketten.splice(
            findIndex(
              self.etiketten,
              (e) => e.idPerson === personId && e.etikett === etikett,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addAnwesenheitstag({ tag, personId }) {
          // 1. create new anwesenheitstag in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into anwesenheitstage (idPerson, tag, letzteMutationUser, letzteMutationZeit) values (@idPerson, @tag, @letzteMutationUser, @letzteMutationZeit)',
              {
                idPerson: personId,
                tag,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.anwesenheitstage.push({
            id: info.lastInsertRowid,
            tag,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteAnwesenheitstag({ tag, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from anwesenheitstage where idPerson = @idPerson and tag = @tag',
              { idPerson: personId, tag },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.anwesenheitstage.splice(
            findIndex(
              self.anwesenheitstage,
              (e) => e.idPerson === personId && e.tag === tag,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addLink({ url, personId }) {
          // 1. create new link in db, returning id
          let info
          try {
            window.electronAPI.editWithParam(
              'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (@idPerson, @url, @letzteMutationUser, @letzteMutationZeit)',
              {
                idPerson: personId,
                url,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.links.push({
            id: info.lastInsertRowid,
            url,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteLink({ id, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from links where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.links.splice(
            findIndex(self.links, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        addSchluessel(val) {
          self.schluessel.push(val)
        },
        deleteSchluessel(id) {
          self.schluessel.splice(
            findIndex(self.schluessel, (p) => p.id === id),
            1,
          )
        },
        addMobileAbo(personId) {
          // 1. create new link in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (@idPerson,@letzteMutationUser,@letzteMutationZeit)',
              {
                idPerson: personId,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.mobileAbos.push({
            id: info.lastInsertRowid,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        addTelefon(personId) {
          // 1. create new link in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into telefones (idPerson,letzteMutationUser, letzteMutationZeit) values (@idPerson,@letzteMutationUser,@letzteMutationZeit)',
              {
                idPerson: personId,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.telefones.push({
            id: info.lastInsertRowid,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteMobileAbo({ id, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from mobileAbos where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.mobileAbos.splice(
            findIndex(self.mobileAbos, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        deleteTelefon({ id, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from telefones where id = ?',
              id,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.telefones.splice(
            findIndex(self.telefones, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        addFunktion({ funktion, personId }) {
          // 1. create new funktion in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into funktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (@idPerson, @funktion, @letzteMutationUser, @letzteMutationZeit)',
              {
                idPerson: personId,
                funktion,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.funktionen.push({
            id: info.lastInsertRowid,
            funktion,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteFunktion({ funktion, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from funktionen where idPerson = @idPerson and funktion = @funktion',
              { idPerson: personId, funktion },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.funktionen.splice(
            findIndex(
              self.funktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addKaderFunktion({ funktion, personId }) {
          // 1. create new kaderFunktion in db, returning id
          let info
          try {
            info = window.electronAPI.editWithParam(
              'insert into kaderFunktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (@idPerson, @funktion, @letzteMutationUser, @letzteMutationZeit)',
              {
                idPerson: personId,
                funktion,
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.kaderFunktionen.push({
            id: info.lastInsertRowid,
            funktion,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteKaderFunktion({ funktion, personId }) {
          // write to db
          try {
            window.electronAPI.editWithParam(
              'delete from kaderFunktionen where idPerson = @idPerson and funktion = @funktion',
              { idPerson: personId, funktion },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.kaderFunktionen.splice(
            findIndex(
              self.kaderFunktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        updateField({
          table,
          parentModel,
          field,
          value,
          id,
          setErrors,
          personId,
        }) {
          // 1. update in db
          try {
            window.electronAPI.editWithParam(
              `update ${table} set ${field} = @value, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                value,
                id,
                user: self.username,
                time: Date.now(),
              },
            )
          } catch (error) {
            if (setErrors) {
              return setErrors({
                [field]: error.message,
              })
            }
            self.addError(error)
            return
          }
          // 2. update in store
          const storeObject = self[parentModel].find((o) => o.id === id)
          if (!storeObject) {
            if (setErrors) {
              return setErrors({
                [field]: `Error: no ${table} with id "${id}" found in store`,
              })
            } else {
              self.addError(`Error: no ${table} with id "${id}" found in store`)
            }
          }
          storeObject[field] = value
          storeObject.letzteMutationUser = self.username
          storeObject.letzteMutationZeit = Date.now()
          if (
            [
              'links',
              'schluessel',
              'mobileAbos',
              'telefones',
              'funktionen',
              'kaderFunktionen',
              'etiketten',
              'anwesenheitstage',
            ].includes(parentModel) &&
            personId
          ) {
            // set persons letzteMutation
            self.updatePersonsMutation(personId)
          }
          if (setErrors) setErrors({})
        },
        updatePersonsMutation(idPerson) {
          // in db
          try {
            window.electronAPI.editWithParam(
              `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                user: self.username,
                time: Date.now(),
                id: idPerson,
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.personen.find((p) => p.id === idPerson)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateAmtMutation(idAmt) {
          // in db
          try {
            window.electronAPI.editWithParam(
              `update aemter set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                user: self.username,
                time: Date.now(),
                id: idAmt,
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const amt = self.aemter.find((p) => p.id === idAmt)
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
        },
        updateAbteilungsMutation(idAbteilung) {
          // in db
          try {
            window.electronAPI.editWithParam(
              `update abteilungen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                user: self.username,
                time: Date.now(),
                id: idAbteilung,
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const abteilung = self.abteilungen.find((p) => p.id === idAbteilung)
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
        },
        updateBereichsMutation(idBereich) {
          // in db
          try {
            window.electronAPI.editWithParam(
              `update bereiche set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                user: self.username,
                time: Date.now(),
                id: idBereich,
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.bereiche.find((p) => p.id === idBereich)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateSektionsMutation(idSektion) {
          // in db
          try {
            window.electronAPI.editWithParam(
              `update sektionen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              {
                user: self.username,
                time: Date.now(),
                id: idSektion,
              },
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.sektionen.find((p) => p.id === idSektion)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        setSettings(value) {
          self.settings = value
        },
        setSettingsKey({ key, value }) {
          try {
            window.electronAPI.editWithParam(
              `update settings set ${key} = ? where id = 1`,
              value,
            )
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          self.settings = {
            ...self.settings,
            [key]: value,
          }
        },
        addError(error) {
          // cannnot pop, need to set new value
          // or the change will not be observed
          // use uniq in case multiple same messages arrive
          self.errors = uniqBy([...self.errors, error], 'message')
          setTimeout(() => {
            // need to use an action inside timeout
            self.popError()
          }, 1000 * 10)
        },
        popError() {
          // eslint-disable-next-line no-unused-vars
          const [first, ...last] = self.errors
          self.errors = [...last]
        },
        setFilterPersonKader(val) {
          self.emptyFilter()
          self.filterPersonKader = val
        },
        setFilterPersonAktivJetzt(val) {
          self.emptyFilter()
          self.filterPersonAktivJetzt = val
        },
        setFilterPersonAktivJetztMitTel(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitTel = val
        },
        setFilterPersonAktivJetztMitMobiltel(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitMobiltel = val
        },
        setFilterPersonAktivJetztMitKurzzeichen(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitKurzzeichen = val
        },
      }
    })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = targetStore.history
}

export default store
