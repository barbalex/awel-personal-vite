-- import
-- create new db with up to date version and encryption (TODO: how?)
-- import data from old db
-- run the following scripts

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id integer PRIMARY KEY autoincrement,
  name text UNIQUE,
  pwd BLOB,
  isAdmin integer DEFAULT 0,
  letzteMutationZeit text,
  letzteMutationUser text
);

DROP INDEX IF EXISTS iUserId;

CREATE INDEX iUserId ON users (id);

DROP INDEX IF EXISTS iUserName;

CREATE INDEX iUserName ON users (name);

DROP INDEX IF EXISTS iUserIsAdmin;

CREATE INDEX iUserIsAdmin ON users (isAdmin);

-- TODO: need oliver's windows user name
-- https://www.sqlite.org/lang_datefunc.html
INSERT INTO users (name, isAdmin, letzteMutationZeit, letzteMutationUser)
  VALUES ('admin', 1, 1674212203000.0, 'ag');

INSERT INTO users (name, isAdmin, letzteMutationZeit, letzteMutationUser)
  VALUES ('alexa', 1, 1674212203000.0, 'ag');

-- TODO: in pesonen letzeMutationZeit is 02.09.2019 for original import. Need to transform to unixepoch
UPDATE
  personen
SET
  letzteMutationZeit = 1567413502000.0
WHERE
  letzteMutationUser = 'ag, Erstimport';

-- same for anwesenheitstage
UPDATE
  anwesenheitstage
SET
  letzteMutationZeit = 1567413502000.0
WHERE
  letzteMutationUser = 'ag, Erstimport';

-- same for telefones
UPDATE
  telefones
SET
  letzteMutationZeit = 1567413502000.0
WHERE
  letzteMutationUser = 'ag, Erstimport';

-- add extra indexes
DROP INDEX IF EXISTS iKostenstelleWerteId;

CREATE INDEX iKostenstelleWerteId ON kostenstelleWerte (id);

DROP INDEX IF EXISTS iStandortWerteId;

CREATE INDEX iStandortWerteId ON standortWerte (id);

DROP INDEX IF EXISTS iStatusWerteId;

CREATE INDEX iStatusWerteId ON statusWerte (id);

DROP INDEX IF EXISTS iPersonId;

CREATE INDEX iPersonId ON personen (id);

DROP INDEX IF EXISTS iAmtId;

CREATE INDEX iAmtId ON aemter (id);

DROP INDEX IF EXISTS iAbteilungId;

CREATE INDEX iAbteilungId ON abteilungen (id);

DROP INDEX IF EXISTS iSektionId;

CREATE INDEX iSektionId ON sektionen (id);

DROP INDEX IF EXISTS iBereichId;

CREATE INDEX iBereichId ON bereiche (id);

DROP INDEX IF EXISTS iLinkId;

CREATE INDEX iLinkId ON links (id);

DROP INDEX IF EXISTS iSchluesselId;

CREATE INDEX iSchluesselId ON schluessel (id);

DROP INDEX IF EXISTS iMobileAboId;

CREATE INDEX iMobileAboId ON mobileAbos (id);

DROP INDEX IF EXISTS iTelefonId;

CREATE INDEX iTelefonId ON telefones (id);

DROP INDEX IF EXISTS iFunktionId;

CREATE INDEX iFunktionId ON funktionen (id);

DROP INDEX IF EXISTS iKaderFunktionId;

CREATE INDEX iKaderFunktionId ON kaderFunktionen (id);

DROP INDEX IF EXISTS iEtikettId;

CREATE INDEX iEtikettId ON etiketten (id);

DROP INDEX IF EXISTS iAnwesenheitstagId;

CREATE INDEX iAnwesenheitstagId ON anwesenheitstage (id);

DROP INDEX IF EXISTS iMutationsId;

CREATE INDEX iMutationsId ON mutations (id);

DROP INDEX IF EXISTS iAnredeWerteId;

CREATE INDEX iAnredeWerteId ON anredeWerte (id);

DROP INDEX IF EXISTS iGeschlechtWerteGeschlecht;

DROP INDEX IF EXISTS iAnredeWerteValue;

CREATE INDEX iAnredeWerteValue ON anredeWerte (value);

DROP INDEX IF EXISTS iGeschlechtWerteHistorisch;

DROP INDEX IF EXISTS iAnredeWerteHistorisch;

CREATE INDEX iAnredeWerteHistorisch ON anredeWerte (historic);

DROP INDEX IF EXISTS iGeschlechtWerteSort;

DROP INDEX IF EXISTS iAnredeWerteSort;

CREATE INDEX iAnredeWerteSort ON anredeWerte (sort);

DROP INDEX IF EXISTS iMobileAboTypWerteId;

CREATE INDEX iMobileAboTypWerteId ON mobileAboTypWerte (id);

DROP INDEX IF EXISTS iTelefonTypWerteId;

CREATE INDEX iTelefonTypWerteId ON telefonTypWerte (id);

DROP INDEX IF EXISTS iSchluesselTypWerteId;

CREATE INDEX iSchluesselTypWerteId ON schluesselTypWerte (id);

DROP INDEX IF EXISTS iSchluesselAnlageWerteId;

CREATE INDEX iSchluesselAnlageWerteId ON schluesselAnlageWerte (id);

DROP INDEX IF EXISTS iFunktionWerteId;

CREATE INDEX iFunktionWerteId ON funktionWerte (id);

DROP INDEX IF EXISTS iKaderFunktionWerteId;

CREATE INDEX iKaderFunktionWerteId ON kaderFunktionWerte (id);

DROP INDEX IF EXISTS iMobileAboKostenstelleWerteId;

CREATE INDEX iMobileAboKostenstelleWerteId ON mobileAboKostenstelleWerte (id);

DROP INDEX IF EXISTS iEtikettWerteId;

CREATE INDEX iEtikettWerteId ON etikettWerte (id);

DROP INDEX IF EXISTS iAnwesenheitstagWerteId;

CREATE INDEX iAnwesenheitstagWerteId ON anwesenheitstagWerte (id);

DROP INDEX IF EXISTS iLandWerteId;

CREATE INDEX iLandWerteId ON landWerte (id);

DROP INDEX IF EXISTS iMutationartWerteId;

CREATE INDEX iMutationartWerteId ON mutationArtWerte (id);

