-- disable foreign keys
-- to prevent reference errors while building schema
PRAGMA foreign_keys = OFF;

-------------------------------------------

drop table if exists kostenstelleWerte;
create table kostenstelleWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iKostenstelleWerteKostenstelle;
create index iKostenstelleWerteKostenstelle on kostenstelleWerte (value);
drop index if exists iKostenstelleWerteHistorisch;
create index iKostenstelleWerteHistorisch on kostenstelleWerte (historic);
drop index if exists iKostenstelleWerteSort;
create index iKostenstelleWerteSort on kostenstelleWerte (sort);

-------------------------------------------

drop table if exists standortWerte;
create table standortWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iStandortWerteStandort;
create index iStandortWerteStandort on standortWerte (value);
drop index if exists iStandortWerteHistorisch;
create index iStandortWerteHistorisch on standortWerte (historic);
drop index if exists iStandortWerteSort;
create index iStandortWerteSort on standortWerte (sort);

-------------------------------------------

-- first werte tables
-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists statusWerte;
create table statusWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iStatusWerteStatus;
create index iStatusWerteStatus on statusWerte (value);
drop index if exists iStatusWerteHistorisch;
create index iStatusWerteHistorisch on statusWerte (historic);
drop index if exists iStatusWerteSort;
create index iStatusWerteSort on statusWerte (sort);

-------------------------------------------

drop table if exists personen;
create table personen (
  -- use autoincrement to prevent unused id's from being reused
  -- because: may be recreated when undoing deletion
  id integer primary key autoincrement,
  deleted integer default 0,
  personalNr integer,
  name text,
  vorname text,
  -- anrede nötig oder vom Geschlecht abhängig?
  --anrede text,
  anrede text references anredeWerte(value) on update cascade on delete no action,
  titel text,
  kurzzeichen text unique,
  adresse text,
  plz integer,
  ort text,
-- land aus Liste auswählen?
  land text references landWerte(value) on update cascade on delete no action,
  bildUrl text,
  email text check (email like '%_@__%.__%'),
  geburtDatum text,
  amt integer default 1 references aemter(id) on update cascade on delete restrict,
  abteilung integer references abteilungen(id) on update cascade on delete restrict,
  sektion integer references sektionen(id) on update cascade on delete restrict,
  bereich integer references bereiche(id) on update cascade on delete restrict,
  bueroNr text,
  standort text references standortWerte(value) on update cascade on delete no action,
  vorgesetztId integer references personen(id) on update cascade on delete restrict,
  eintrittDatum text,
  austrittDatum text,
  status text references statusWerte(value) on update cascade on delete no action,
  parkplatzNr text,
  bemerkungen text,
  beschaeftigungsgrad integer,
  -- TODO:
  -- rename to handlungsbedarf
  mutationNoetig integer default 0,
  mutationFrist text,
  mutationBemerkung text,
  -- ab jetzt: Mutation
  mutationArt text references mutationArtWerte(value) on update cascade on delete no action,
  telefonUebernommenVon integer references personen(id) on update cascade on delete no action,
  rufnummer text,
  schluesselNoetig text,
  arbeitsplatzeroeffnungPer text,
  benoetigteSoftware text,
  standardabweichendeHardware text,
  abmeldungArbeitsplatzPer text,
  bueroWechselPer text,
  kostenstellenAenderungPer text,
  itMutationBemerkungen text,
  -- Ende Mutation
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iPersonDeleted;
create index iPersonDeleted on personen (deleted);
drop index if exists iPersonName;
create index iPersonName on personen (name);
drop index if exists iPersonVorname;
create index iPersonVorname on personen (vorname);
drop index if exists iPersonMutationFrist;
create index iPersonMutationFrist on personen (mutationFrist);

--alter table personen add column mutationBemerkung text;

-------------------------------------------

drop table if exists aemter;
create table aemter (
  id integer primary key autoincrement,
  deleted integer default 0,
  name text unique,
  kurzzeichen text unique,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text references standortWerte(value) on update cascade on delete no action,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  mutationNoetig integer default 0,
  mutationFrist text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iAmtDeleted;
create index iAmtDeleted on aemter (deleted);
drop index if exists iAmtName;
create index iAmtName on aemter (name);

-------------------------------------------

drop table if exists abteilungen;
create table abteilungen (
  id integer primary key autoincrement,
  deleted integer default 0,
  amt integer REFERENCES aemter(id) on update cascade on delete restrict,
  name text,
  kurzzeichen text unique,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text references standortWerte(value) on update cascade on delete no action,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  mutationNoetig integer default 0,
  mutationFrist text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(amt, name)
);

drop index if exists iAbteilungDeleted;
create index iAbteilungDeleted on abteilungen (deleted);
drop index if exists iAbteilungName;
create index iAbteilungName on abteilungen (name);

-------------------------------------------

drop table if exists sektionen;
create table sektionen (
  id integer primary key autoincrement,
  deleted integer default 0,
  abteilung integer REFERENCES abteilungen (id) on update cascade on delete restrict,
  name text,
  kurzzeichen text unique,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text references standortWerte(value) on update cascade on delete no action,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  mutationNoetig integer default 0,
  mutationFrist text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(abteilung, name)
);

drop index if exists iSektionDeleted;
create index iSektionDeleted on sektionen (deleted);
drop index if exists iSektionName;
create index iSektionName on sektionen (name);

-------------------------------------------

drop table if exists bereiche;
create table bereiche (
  id integer primary key autoincrement,
  deleted integer default 0,
  sektion integer REFERENCES sektionen (id) on update cascade on delete restrict,
  abteilung integer REFERENCES abteilungen (id) on update cascade on delete restrict,
  amt integer REFERENCES aemter (id) on update cascade on delete restrict,
  name text,
  kurzzeichen text unique,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text references standortWerte(value) on update cascade on delete no action,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  mutationNoetig integer default 0,
  mutationFrist text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iBereichDeleted;
create index iBereichDeleted on bereiche (deleted);
drop index if exists iBereichName;
create index iBereichName on bereiche (name);

-------------------------------------------

drop table if exists settings;
create table settings (
  id integer primary key,
  schluesselFormPath text,
  personMutationWeiterleiten text,
  verzeichnisZeilenhoeheMm real,
  mutationFormPath text
);

--alter table settings add column mutationFormPath text;
--update settings set mutationFormPath = 'G:\Sekretariate_AWEL\Personalmutationen_nicht_umbenennen_PersonalDB' where id = 1;

-------------------------------------------

drop table if exists links;
create table links (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  url text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, url)
);

drop index if exists iLinkDeleted;
create index iLinkDeleted on links (deleted);
drop index if exists iLinkIdPerson;
create index iLinkIdPerson on links (idPerson);
drop index if exists iLinkUrl;
create index iLinkUrl on links (url);

-------------------------------------------

-- wird auch für badges benutzt
drop table if exists schluessel;
create table schluessel (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  typ text references schluesselTypWerte(value) on update cascade on delete no action,
  anlage text references schluesselAnlageWerte(value) on update cascade on delete no action,
  nr text,
  bezeichnung text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iSchluesselDeleted;
create index iSchluesselDeleted on schluessel (deleted);
drop index if exists iSchluesselIdPerson;
create index iSchluesselIdPerson on schluessel (idPerson);

-------------------------------------------

drop table if exists mobileAbos;
create table mobileAbos (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  typ text references mobileAboTypWerte(value) on update cascade on delete no action,
  kostenstelle text references mobileAboKostenstelleWerte(value) on update cascade on delete no action,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iMobileAboDeleted;
create index iMobileAboDeleted on mobileAbos (deleted);
drop index if exists iMobileAboIdPerson;
create index iMobileAboIdPerson on mobileAbos (idPerson);
drop index if exists iMobileAboTyp;
create index iMobileAboTyp on mobileAbos (typ);

-------------------------------------------

drop table if exists telefones;
create table telefones (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  nr text,
  typ text references telefonTypWerte(value) on update cascade on delete no action,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, nr)
);

drop index if exists iTelefonDeleted;
create index iTelefonDeleted on telefones (deleted);
drop index if exists iTelefonIdPerson;
create index iTelefonIdPerson on telefones (idPerson);
drop index if exists iTelefonTyp;
create index iTelefonTyp on telefones (typ);

-------------------------------------------

drop table if exists funktionen;
create table funktionen (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  funktion text references funktionWerte(value) on update cascade on delete no action,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, funktion)
);

drop index if exists iFunktionDeleted;
create index iFunktionDeleted on funktionen (deleted);
drop index if exists iFunktionIdPerson;
create index iFunktionIdPerson on funktionen (idPerson);
drop index if exists iFunktionFunktion;
create index iFunktionFunktion on funktionen (funktion);

-------------------------------------------

drop table if exists kaderFunktionen;
create table kaderFunktionen (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  funktion text references kaderFunktionWerte(value) on update cascade on delete no action,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, funktion)
);

drop index if exists iKaderFunktionDeleted;
create index iKaderFunktionDeleted on kaderFunktionen (deleted);
drop index if exists iKaderFunktionIdPerson;
create index iKaderFunktionIdPerson on kaderFunktionen (idPerson);
drop index if exists iKaderFunktionFunktion;
create index iKaderFunktionFunktion on kaderFunktionen (funktion);

-------------------------------------------

drop table if exists etiketten;
create table etiketten (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  etikett text references etikettWerte(value) on update cascade on delete cascade,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, etikett)
);

drop index if exists iEtikettDeleted;
create index iEtikettDeleted on etiketten (deleted);
drop index if exists iEtikettIdPerson;
create index iEtikettIdPerson on etiketten (idPerson);
drop index if exists iEtikettEtikett;
create index iEtikettEtikett on etiketten (etikett);

-------------------------------------------

drop table if exists anwesenheitstage;
create table anwesenheitstage (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  tag text references anwesenheitstagWerte(value) on update cascade on delete cascade,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT,
  unique(idPerson, tag)
);

drop index if exists iAnwesenheitstagDeleted;
create index iAnwesenheitstagDeleted on anwesenheitstage (deleted);
drop index if exists iAnwesenheitstagIdPerson;
create index iAnwesenheitstagIdPerson on anwesenheitstage (idPerson);
drop index if exists iAnwesenheitstagTag;
create index iAnwesenheitstagTag on anwesenheitstage (tag);

-------------------------------------------

drop table if exists mutations;
create table mutations (
  id integer primary key autoincrement,
  time TEXT,
  user TEXT,
  op TEXT,
  tableName TEXT,
  rowId integer,
  field TEXT,
  value TEXT,
  previousValue TEXT,
  -- mark revertions by noting what mutation id
  -- is reverted
  reverts integer
);

drop index if exists iMutationsTime;
create index iMutationsTime on mutations (time);
drop index if exists iMutationsUser;
create index iMutationsUser on mutations (user);
drop index if exists iMutationsOp;
create index iMutationsOp on mutations (op);
drop index if exists iMutationsTableName;
create index iMutationsTableName on mutations (tableName);
drop index if exists iMutationsRowId;
create index iMutationsRowId on mutations (rowId);
drop index if exists iMutationsField;
create index iMutationsField on mutations (field);
drop index if exists iMutationsValue;
create index iMutationsValue on mutations (value);
drop index if exists iMutationsPreviousValue;
create index iMutationsPreviousValue on mutations (previousValue);
drop index if exists iMutationsReverts;
create index iMutationsReverts on mutations (reverts);

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists anredeWerte;
create table anredeWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iGeschlechtWerteGeschlecht;
create index iGeschlechtWerteGeschlecht on anredeWerte (value);
drop index if exists iGeschlechtWerteHistorisch;
create index iGeschlechtWerteHistorisch on anredeWerte (historic);
drop index if exists iGeschlechtWerteSort;
create index iGeschlechtWerteSort on anredeWerte (sort);

-------------------------------------------

drop table if exists mobileAboTypWerte;
create table mobileAboTypWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iMobileAboTypWerteMobileAboTyp;
create index iMobileAboTypWerteMobileAboTyp on mobileAboTypWerte (value);
drop index if exists iMobileAboTypWerteHistorisch;
create index iMobileAboTypWerteHistorisch on mobileAboTypWerte (historic);
drop index if exists iMobileAboTypWerteSort;
create index iMobileAboTypWerteSort on mobileAboTypWerte (sort);

-------------------------------------------

drop table if exists telefonTypWerte;
create table telefonTypWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iTelefonTypWerteTelefonTyp;
create index iTelefonTypWerteTelefonTyp on telefonTypWerte (value);
drop index if exists iTelefonTypWerteHistorisch;
create index iTelefonTypWerteHistorisch on telefonTypWerte (historic);
drop index if exists iTelefonTypWerteSort;
create index iTelefonTypWerteSort on telefonTypWerte (sort);

-------------------------------------------

drop table if exists schluesselTypWerte;
create table schluesselTypWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iSchluesselTypWerteSchluesselTyp;
create index iSchluesselTypWerteSchluesselTyp on schluesselTypWerte (value);
drop index if exists iSchluesselTypWerteHistorisch;
create index iSchluesselTypWerteHistorisch on schluesselTypWerte (historic);
drop index if exists iSchluesselTypWerteSort;
create index iSchluesselTypWerteSort on schluesselTypWerte (sort);

-------------------------------------------

drop table if exists schluesselAnlageWerte;
create table schluesselAnlageWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iSchluesselAnlageWerteSchluesselAnlage;
create index iSchluesselAnlageWerteSchluesselAnlage on schluesselAnlageWerte (value);
drop index if exists iSchluesselAnlageWerteHistorisch;
create index iSchluesselAnlageWerteHistorisch on schluesselAnlageWerte (historic);
drop index if exists iSchluesselAnlageWerteSort;
create index iSchluesselAnlageWerteSort on schluesselAnlageWerte (sort);

-------------------------------------------

drop table if exists funktionWerte;
create table funktionWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iFunktionWerteFunktion;
create index iFunktionWerteFunktion on funktionWerte (value);
drop index if exists iFunktionWerteHistorisch;
create index iFunktionWerteHistorisch on funktionWerte (historic);
drop index if exists iFunktionWerteSort;
create index iFunktionWerteSort on funktionWerte (sort);

-------------------------------------------

drop table if exists kaderFunktionWerte;
create table kaderFunktionWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iFunktionWerteFunktion;
create index iFunktionWerteFunktion on kaderFunktionWerte (value);
drop index if exists iFunktionWerteHistorisch;
create index iFunktionWerteHistorisch on kaderFunktionWerte (historic);
drop index if exists iFunktionWerteSort;
create index iFunktionWerteSort on kaderFunktionWerte (sort);

-------------------------------------------

drop table if exists mobileAboKostenstelleWerte;
create table mobileAboKostenstelleWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iMobileAboKostenstelleWerteMobileAboKostenstelle;
create index iMobileAboKostenstelleWerteMobileAboKostenstelle on mobileAboKostenstelleWerte (value);
drop index if exists iMobileAboKostenstelleWerteHistorisch;
create index iMobileAboKostenstelleWerteHistorisch on mobileAboKostenstelleWerte (historic);
drop index if exists iMobileAboKostenstelleWerteSort;
create index iMobileAboKostenstelleWerteSort on mobileAboKostenstelleWerte (sort);

-------------------------------------------

drop table if exists etikettWerte;
create table etikettWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iEtikettWerteEtikett;
create index iEtikettWerteEtikett on etikettWerte (value);
drop index if exists iEtikettWerteHistorisch;
create index iEtikettWerteHistorisch on etikettWerte (historic);
drop index if exists iEtikettWerteSort;
create index iEtikettWerteSort on etikettWerte (sort);

-------------------------------------------

drop table if exists anwesenheitstagWerte;
create table anwesenheitstagWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iAnwesenheitstagWerteAnwesenheitstag;
create index iAnwesenheitstagWerteAnwesenheitstag on anwesenheitstagWerte (value);
drop index if exists iAnwesenheitstagWerteHistorisch;
create index iAnwesenheitstagWerteHistorisch on anwesenheitstagWerte (historic);
drop index if exists iAnwesenheitstagWerteSort;
create index iAnwesenheitstagWerteSort on anwesenheitstagWerte (sort);

-------------------------------------------

drop table if exists landWerte;
create table landWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iLandWerteLand;
create index iLandWerteLand on landWerte (value);
drop index if exists iLandWerteHistorisch;
create index iLandWerteHistorisch on landWerte (historic);
drop index if exists iLandWerteSort;
create index iLandWerteSort on landWerte (sort);

-------------------------------------------

drop table if exists mutationArtWerte;
create table mutationArtWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iMutationartWerteMutationart;
create index iMutationartWerteMutationart on mutationArtWerte (value);
drop index if exists iMutationartWerteHistorisch;
create index iMutationartWerteHistorisch on mutationArtWerte (historic);
drop index if exists iMutationartWerteSort;
create index iMutationartWerteSort on mutationArtWerte (sort);

-------------------------------------------


PRAGMA foreign_keys = ON;