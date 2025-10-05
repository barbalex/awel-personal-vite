import { types } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import findIndex from 'lodash/findIndex'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import last from 'lodash/last'

import Amt from './Amt.js'
import Abteilung from './Abteilung.js'
import Settings from './Settings.js'
import Bereich from './Bereich.js'
import Sektion from './Sektion.js'
import Etikett from './Etikett.js'
import Anwesenheitstag from './Anwesenheitstag.js'
import AnredeWert from './AnredeWert.js'
import FunktionWert from './FunktionWert.js'
import KaderFunktionWert from './KaderFunktionWert.js'
import KostenstelleWert from './KostenstelleWert.js'
import Link from './Link.js'
import Schluessel from './Schluessel.js'
import MobileAbo from './MobileAbo.js'
import Telefon from './Telefon.js'
import Funktion from './Funktion.js'
import KaderFunktion from './KaderFunktion.js'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert.js'
import MobileAboTypWert from './MobileAboTypWert.js'
import TelefonTypWert from './TelefonTypWert.js'
import SchluesselTypWert from './SchluesselTypWert.js'
import SchluesselAnlageWert from './SchluesselAnlageWert.js'
import EtikettWert from './EtikettWert.js'
import AnwesenheitstagWert from './AnwesenheitstagWert.js'
import LandWert from './LandWert.js'
import MutationartWert from './MutationartWert.js'
import StandortWert from './StandortWert.js'
import Person from './Person.js'
import Mutation from './Mutation.js'
import StatusWert from './StatusWert.js'
import TagWert from './TagWert.js'
import PersonPages from './PersonPages.js'
import PersonVerzeichnisPages from './PersonVerzeichnisPages.js'
import personenFiltered from './personenFiltered.js'
import personenSorted from './personenSorted.js'
import personenSortedByHandlungsbedarf from './personenSortedByHandlungsbedarf.js'
import aemterFiltered from './aemterFiltered.js'
import usersFiltered from './usersFiltered.js'
import aemterFilteredSortedByHandlungsbedarf from './aemterFilteredSortedByHandlungsbedarf.js'
import abteilungenFiltered from './abteilungenFiltered.js'
import abteilungenFilteredSortedByHandlungsbedarf from './abteilungenFilteredSortedByHandlungsbedarf.js'
import bereicheFiltered from './bereicheFiltered.js'
import bereicheFilteredSortedByHandelsbedarf from './bereicheFilteredSortedByHandelsbedarf.js'
import sektionenFiltered from './sektionenFiltered.js'
import sektionenFilteredSortedByHandelsbedarf from './sektionenFilteredSortedByHandelsbedarf.js'
import User from './User.js'

export const createStore = () =>
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
      users: types.array(User),
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
      userName: types.maybe(types.string),
      userIsAdmin: types.optional(types.boolean, false),
      userIsLoggedIn: types.optional(types.boolean, false),
      userPwd: types.maybe(types.string),
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
      filterUser: types.optional(User, {}),
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
          filterUser,
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
            ...Object.values(filterUser),
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
      get usersFiltered() {
        return usersFiltered(self)
      },
      get usersFilteredSorted() {
        return self.usersFiltered.sort((a, b) =>
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
            .filter((m) => m.user === self.userName)
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
            .filter((m) => m.user === self.userName)
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
        setUserPwd(val) {
          self.userPwd = val
        },
        setUserIsLoggedIn(val) {
          self.userIsLoggedIn = val
        },
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
          self.filterUser = {}
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
          self.filterUser = {}
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
        setUserName(name) {
          self.userName = name
        },
        setUserIsAdmin(val) {
          self.userIsAdmin = val
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
        setUsers(users) {
          self.watchMutations = false
          self.users = users
          self.watchMutations = true
        },
        setAmt(amt) {
          const ownAmt = self.aemter.find((a) => a.id === amt.id)
          Object.keys(amt).forEach((key) => (ownAmt[key] = amt[key]))
        },
        setUser(user) {
          const own = self.users.find((a) => a.id === user.id)
          Object.keys(user).forEach((key) => (own[key] = user[key]))
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
        addMutation(mutation) {
          self.mutations.push(mutation)
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
        addToTable({ table, value }) {
          self[table].push(value)
        },
        addPerson(val) {
          self.personen.push(val)
        },
        addAmt(val) {
          self.aemter.push(val)
        },
        addUser(val) {
          self.users.push(val)
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
          createStore[table].splice(
            findIndex(createStore[table], (p) => p.id === id),
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
          const amt = self.aemter.find((p) => p.id === id)
          amt.deleted = 1
          amt.letzteMutationUser = self.userName
          amt.letzteMutationZeit = Date.now()
        },
        setAbteilungDeleted(id) {
          const abteilung = self.abteilungen.find((p) => p.id === id)
          abteilung.deleted = 1
          abteilung.letzteMutationUser = self.userName
          abteilung.letzteMutationZeit = Date.now()
        },
        deleteAmt(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.aemter. Consequence:
           * all other aemter are re-added and listet as mutations of op 'add'
           */
          self.aemter.splice(
            findIndex(self.aemter, (p) => p.id === id),
            1,
          )
        },
        deleteUser(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.users. Consequence:
           * all other users are re-added and listet as mutations of op 'add'
           */
          self.users.splice(
            findIndex(self.users, (p) => p.id === id),
            1,
          )
        },
        deleteAbteilung(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.abteilungen. Consequence:
           * all other abteilungen are re-added and listet as mutations of op 'add'
           */
          self.abteilungen.splice(
            findIndex(self.abteilungen, (p) => p.id === id),
            1,
          )
        },
        setBereichDeleted(id) {
          const bereich = self.bereiche.find((p) => p.id === id)
          bereich.deleted = 1
          bereich.letzteMutationUser = self.userName
          bereich.letzteMutationZeit = Date.now()
        },
        deleteBereich(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.bereiche. Consequence:
           * all other bereiche are re-added and listet as mutations of op 'add'
           */
          self.bereiche.splice(
            findIndex(self.bereiche, (p) => p.id === id),
            1,
          )
        },
        setSektionDeleted(id) {
          const sektion = self.sektionen.find((p) => p.id === id)
          sektion.deleted = 1
          sektion.letzteMutationUser = self.userName
          sektion.letzteMutationZeit = Date.now()
        },
        deleteSektion(id) {
          /**
           * Do not use filter! Reason:
           * rebuilds self.sektionen. Consequence:
           * all other sektionen are re-added and listet as mutations of op 'add'
           */
          self.sektionen.splice(
            findIndex(self.sektionen, (p) => p.id === id),
            1,
          )
        },
        addEtikett(val) {
          self.etiketten.push(val)
        },
        deleteEtikett({ etikett, personId }) {
          self.etiketten.splice(
            findIndex(
              self.etiketten,
              (e) => e.idPerson === personId && e.etikett === etikett,
            ),
            1,
          )
        },
        addAnwesenheitstag(val) {
          self.anwesenheitstage.push(val)
        },
        deleteAnwesenheitstag({ tag, personId }) {
          self.anwesenheitstage.splice(
            findIndex(
              self.anwesenheitstage,
              (e) => e.idPerson === personId && e.tag === tag,
            ),
            1,
          )
        },
        addLink(val) {
          self.links.push(val)
        },
        deleteLink(id) {
          self.links.splice(
            findIndex(self.links, (p) => p.id === id),
            1,
          )
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
        addMobileAbo(val) {
          self.mobileAbos.push(val)
        },
        addTelefon(val) {
          self.telefones.push(val)
        },
        deleteMobileAbo(id) {
          self.mobileAbos.splice(
            findIndex(self.mobileAbos, (p) => p.id === id),
            1,
          )
        },
        deleteTelefon(id) {
          self.telefones.splice(
            findIndex(self.telefones, (p) => p.id === id),
            1,
          )
        },
        addFunktion(val) {
          self.funktionen.push(val)
        },
        deleteFunktion({ funktion, personId }) {
          self.funktionen.splice(
            findIndex(
              self.funktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
        },
        addKaderFunktion(val) {
          self.kaderFunktionen.push(val)
        },
        deleteKaderFunktion({ funktion, personId }) {
          self.kaderFunktionen.splice(
            findIndex(
              self.kaderFunktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
        },
        updateField({ table, parentModel, field, value, id, setErrors }) {
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
          storeObject.letzteMutationUser = self.userName
          storeObject.letzteMutationZeit = Date.now()
          if (setErrors) setErrors({})
        },
        updatePersonsMutation(idPerson) {
          const person = self.personen.find((p) => p.id === idPerson)
          if (!person) {
            console.error(
              `Error: no person with id "${idPerson}" found in store`,
            )
            return
          }
          person.letzteMutationUser = self.userName
          person.letzteMutationZeit = Date.now()
        },
        setSettings(value) {
          self.settings = value
        },
        setSettingsKey({ key, value }) {
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
          // eslint-disable-next-line
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
