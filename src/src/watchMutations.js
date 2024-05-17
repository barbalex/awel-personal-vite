import { onPatch } from 'mobx-state-tree'

import addMutation from './addMutation.js'

const watchMutations = ({ store }) => {
  const {
    personen,
    links,
    schluessel,
    mobileAbos,
    telefones,
    funktionen,
    kaderFunktionen,
    etiketten,
    anwesenheitstage,
    statusWerte,
    anredeWerte,
    kostenstelleWerte,
    mobileAboTypWerte,
    telefonTypWerte,
    schluesselTypWerte,
    schluesselAnlageWerte,
    funktionWerte,
    kaderFunktionWerte,
    mobileAboKostenstelleWerte,
    etikettWerte,
    anwesenheitstagWerte,
    landWerte,
    mutationArtWerte,
    standortWerte,
  } = store
  onPatch(personen, (patch, inversePatch) =>
    addMutation({ tableName: 'personen', patch, inversePatch, store }),
  )
  onPatch(links, (patch, inversePatch) =>
    addMutation({ tableName: 'links', patch, inversePatch, store }),
  )
  onPatch(schluessel, (patch, inversePatch) =>
    addMutation({ tableName: 'schluessel', patch, inversePatch, store }),
  )
  onPatch(mobileAbos, (patch, inversePatch) =>
    addMutation({ tableName: 'mobileAbos', patch, inversePatch, store }),
  )
  onPatch(telefones, (patch, inversePatch) =>
    addMutation({ tableName: 'telefones', patch, inversePatch, store }),
  )
  onPatch(funktionen, (patch, inversePatch) =>
    addMutation({ tableName: 'funktionen', patch, inversePatch, store }),
  )
  onPatch(kaderFunktionen, (patch, inversePatch) =>
    addMutation({ tableName: 'kaderFunktionen', patch, inversePatch, store }),
  )
  onPatch(etiketten, (patch, inversePatch) =>
    addMutation({ tableName: 'etiketten', patch, inversePatch, store }),
  )
  onPatch(anwesenheitstage, (patch, inversePatch) =>
    addMutation({ tableName: 'anwesenheitstage', patch, inversePatch, store }),
  )
  onPatch(statusWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'statusWerte', patch, inversePatch, store }),
  )
  onPatch(anredeWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'anredeWerte', patch, inversePatch, store }),
  )
  onPatch(kostenstelleWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'kostenstelleWerte', patch, inversePatch, store }),
  )
  onPatch(mobileAboTypWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'mobileAboTypWerte', patch, inversePatch, store }),
  )
  onPatch(telefonTypWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'telefonTypWerte', patch, inversePatch, store }),
  )
  onPatch(schluesselTypWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'schluesselTypWerte',
      patch,
      inversePatch,
      store,
    }),
  )
  onPatch(schluesselAnlageWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'schluesselAnlageWerte',
      patch,
      inversePatch,
      store,
    }),
  )
  onPatch(funktionWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'funktionWerte', patch, inversePatch, store }),
  )
  onPatch(kaderFunktionWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'kaderFunktionWerte',
      patch,
      inversePatch,
      store,
    }),
  )
  onPatch(mobileAboKostenstelleWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'mobileAboKostenstelleWerte',
      patch,
      inversePatch,
    }),
  )
  onPatch(etikettWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'etikettWerte', patch, inversePatch, store }),
  )
  onPatch(anwesenheitstagWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'anwesenheitstagWerte',
      patch,
      inversePatch,
      store,
    }),
  )
  onPatch(landWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'landWerte', patch, inversePatch, store }),
  )
  onPatch(mutationArtWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'mutationArtWerte', patch, inversePatch, store }),
  )
  onPatch(standortWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'standortWerte', patch, inversePatch, store }),
  )
}

export default watchMutations
