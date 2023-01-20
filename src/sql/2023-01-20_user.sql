DROP TABLE IF EXISTS users;

CREATE TABLE users (
  name text PRIMARY KEY,
  password text,
  letzteMutationZeit text,
  letzteMutationUser text
);

DROP INDEX IF EXISTS iUserName;

CREATE INDEX iUserName ON users (name);

-- TODO: need oliver's windows user name
-- https://www.sqlite.org/lang_datefunc.html
INSERT INTO users (name, PASSWORD, letzteMutationZeit, letzteMutationUser)
  VALUES ('admin', 'very-secret', 1674212203000.0, 'ag');

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

