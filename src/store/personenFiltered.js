/**
 * TODO:
 * add filtering by 1:n connected tables
 */
import moment from 'moment'

const personenFiltered = ({ self }) => {
  const {
    filterSchluessel,
    filterMobileAbo,
    filterTelefon,
    filterFunktion,
    filterKaderFunktion,
    filterEtikett,
    filterAnwesenheitstage,
    filterPerson,
    filterPersonKader,
    filterPersonAktivJetzt,
    filterPersonAktivJetztMitTel,
    filterPersonAktivJetztMitMobiltel,
    filterPersonAktivJetztMitKurzzeichen,
  } = self
  let { personen } = self
  if (filterPersonKader) {
    personen = personen
      .filter((p) => {
        const kaderfunktionen = self.kaderFunktionen
          .filter((f) => f.idPerson === p.id)
          .filter((f) => f.deleted === 0)
        const etiketten = self.etiketten
          .filter((f) => f.idPerson === p.id)
          .filter((f) => f.deleted === 0)
          .filter((f) =>
            ['Kadertreffen', 'Sektionsleitertreffen'].includes(f.etikett),
          )

        return [...kaderfunktionen, ...etiketten].length > 0
      })
      .filter((f) => f.status === 'aktiv')
  }
  if (filterPersonAktivJetzt) {
    personen = personen
      .filter((p) => p.status === 'aktiv')
      .filter(
        (p) =>
          !p.eintrittDatum ||
          moment(p.eintrittDatum, 'DD.MM.YYYY').isBefore(new Date()),
      )
  }
  if (filterPersonAktivJetztMitTel) {
    personen = personen
      .filter((p) => p.status === 'aktiv')
      .filter(
        (p) =>
          self.telefones
            .filter((t) => t.idPerson === p.id)
            .filter((t) => t.typ === 'Festnetz').length > 0,
      )
      .filter(
        (p) =>
          !p.eintrittDatum ||
          moment(p.eintrittDatum, 'DD.MM.YYYY').isBefore(new Date()),
      )
  }
  if (filterPersonAktivJetztMitMobiltel) {
    personen = personen
      .filter((p) => p.status === 'aktiv')
      .filter(
        (p) =>
          self.telefones
            .filter((t) => t.idPerson === p.id)
            .filter((t) => t.typ === 'mobile').length > 0,
      )
      .filter(
        (p) =>
          !p.eintrittDatum ||
          moment(p.eintrittDatum, 'DD.MM.YYYY').isBefore(new Date()),
      )
  }
  if (filterPersonAktivJetztMitKurzzeichen) {
    personen = personen
      .filter((p) => p.status === 'aktiv')
      .filter((p) => !!p.kurzzeichen)
      .filter(
        (p) =>
          !p.eintrittDatum ||
          moment(p.eintrittDatum, 'DD.MM.YYYY').isBefore(new Date()),
      )
  }
  Object.keys(filterPerson).forEach((key) => {
    if (filterPerson[key] || filterPerson[key] === 0) {
      personen = personen.filter((p) => {
        if (!filterPerson[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterPerson[key].toString().toLowerCase())
      })
    }
  })
  let schluessel = self.schluessel.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let schluesselIsFiltered = false
  Object.keys(filterSchluessel).forEach((key) => {
    if (filterSchluessel[key]) {
      schluesselIsFiltered = true
      schluessel = schluessel.filter((p) => {
        if (!filterSchluessel[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterSchluessel[key].toString().toLowerCase())
      })
    }
  })
  let mobileAbos = self.mobileAbos.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let mobileAbosIsFiltered = false
  Object.keys(filterMobileAbo).forEach((key) => {
    if (filterMobileAbo[key]) {
      mobileAbosIsFiltered = true
      mobileAbos = mobileAbos.filter((p) => {
        if (!filterMobileAbo[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterMobileAbo[key].toString().toLowerCase())
      })
    }
  })
  let telefones = self.telefones.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let telefonesIsFiltered = false
  Object.keys(filterTelefon).forEach((key) => {
    if (filterTelefon[key]) {
      telefonesIsFiltered = true
      telefones = telefones.filter((p) => {
        if (!filterTelefon[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterTelefon[key].toString().toLowerCase())
      })
    }
  })
  let funktionen = self.funktionen.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let funktionenIsFiltered = false
  Object.keys(filterFunktion).forEach((key) => {
    if (filterFunktion[key]) {
      funktionenIsFiltered = true
      funktionen = funktionen.filter((p) => {
        if (!filterFunktion[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterFunktion[key].toString().toLowerCase())
      })
    }
  })
  let kaderFunktionen = self.kaderFunktionen.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let kaderFunktionenIsFiltered = false
  Object.keys(filterKaderFunktion).forEach((key) => {
    if (filterKaderFunktion[key]) {
      kaderFunktionenIsFiltered = true
      kaderFunktionen = kaderFunktionen.filter((p) => {
        if (!filterKaderFunktion[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterKaderFunktion[key].toString().toLowerCase())
      })
    }
  })
  let etiketten = self.etiketten.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let etikettenIsFiltered = false
  Object.keys(filterEtikett).forEach((key) => {
    if (filterEtikett[key]) {
      etikettenIsFiltered = true
      etiketten = etiketten.filter((p) => {
        if (!filterEtikett[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterEtikett[key].toString().toLowerCase())
      })
    }
  })

  let anwesenheitstage = self.anwesenheitstage.filter((p) => {
    if (!self.showDeleted) return p.deleted === 0
    return true
  })
  let anwesenheitstageIsFiltered = false
  Object.keys(filterAnwesenheitstage).forEach((key) => {
    if (filterAnwesenheitstage[key]) {
      anwesenheitstageIsFiltered = true
      anwesenheitstage = anwesenheitstage.filter((p) => {
        if (!filterAnwesenheitstage[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterAnwesenheitstage[key].toString().toLowerCase())
      })
    }
  })

  personen = personen
    .filter((p) => {
      if (!self.showDeleted) return p.deleted === 0
      return true
    })
    .filter((p) => {
      if (!schluesselIsFiltered) return true
      return schluessel.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!mobileAbosIsFiltered) return true
      return mobileAbos.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!telefonesIsFiltered) return true
      return telefones.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!funktionenIsFiltered) return true
      return funktionen.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!kaderFunktionenIsFiltered) return true
      return kaderFunktionen.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!etikettenIsFiltered) return true
      return etiketten.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      if (!anwesenheitstageIsFiltered) return true
      return anwesenheitstage.filter((s) => s.idPerson === p.id).length > 0
    })
    .filter((p) => {
      const { filterFulltextIds } = self
      if (!filterFulltextIds.length) return true
      return filterFulltextIds.includes(p.id)
    })
  return personen
}

export default personenFiltered
