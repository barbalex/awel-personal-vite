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

