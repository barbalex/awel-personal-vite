PRAGMA foreign_keys = OFF;

insert into
  landWerte(id, value)
values
  (1, 'Schweiz'),
  (2, 'Deutschland'),
  (3, 'Italien'),
  (4, 'Frankreich'),
  (5, 'Österreich');

insert into
  kostenstelleWerte(value)
values
  ('850000'),
  ('850020'),
  ('850090'),
  ('850100'),
  ('851200'),
  ('851210'),
  ('851220'),
  ('851230'),
  ('851240'),
  ('851250'),
  ('851400'),
  ('851410'),
  ('851420'),
  ('851430'),
  ('851440'),
  ('852700'),
  ('852710'),
  ('852730'),
  ('852740'),
  ('852760'),
  ('852770'),
  ('852800'),
  ('852810'),
  ('852820'),
  ('852830'),
  ('852840'),
  ('852850'),
  ('853800'),
  ('853810'),
  ('853820'),
  ('853830');

insert into
  standortWerte(value)
values
  ('Walcheplatz 2'),
  ('Stampfenbachstrasse 12/14'),
  ('Weinbergstrasse 34'),
  ('Carbahaus'),
  ('Werkhof Adliswil'),
  ('Werkhof Obfelden'),
  ('Werkhof Glattbrugg'),
  ('Werkhof Hettlingen'),
  ('Werkhof Andelfingen'),
  ('Werkhof Hinwil');

insert into
  statusWerte(value, sort)
values
  ('aktiv', 1),
  ('pensioniert', 2),
  ('ehemalig', 3),
  ('extern', 4);

insert into
  aemter(name, id, kostenstelle)
values
  ('AWEL', 1, '850000');

insert into
  abteilungen(id, name, kurzzeichen, amt, kostenstelle)
values
  (1, 'Abfallwirtschaft', 'aw', 1, '851200'),
  (2, 'Dienste FRW', null, 1, '850090'),
  (8, 'Dienste QMS', null, 1, '850100'),
  (3, 'Energie', 'en', 1, '853800'),
  (4, 'Gewässerschutz', 'gs', 1, '852800'),
  (5, 'Luft', 'lu', 1, '851400'),
  (6, 'Recht', 're', 1, '850020'),
  (7, 'Wasserbau', 'wb', 1, '852700');

insert into
  sektionen(id, name, kurzzeichen, abteilung, kostenstelle)
values
  (1, 'Abfallwirtschaft', 'aw', 1, '851210'),
  (2, 'Altlasten', 'al', 1, '851220'),
  (3, 'Betrieblicher Umweltschutz und Störfallvorsorge', 'bus', 1, '851230'),
  (4, 'Biosicherheit', 'bs', 1, '851240'),
  (5, 'Energieberatung', null, 3, '853830'),
  (6, 'Energietechnik', null, 3, '853810'),
  (7, 'Energiewirtschaft', null, 3, '853820'),
  (8, 'Oberflächengewässerschutz', null, 4, '852810'),
  (9, 'Abwasserreinigungsanlagen', null, 4, '852820'),
  (10, 'Grundwasser und Wasserversorgung', null, 4, '852840'),
  (11, 'Bevölkerungsschutz', null, 4, '852850'),
  (12, 'Siedlungsentwässerung', null, 4, '852830'),
  (13, 'Monitoring', null, 5, '851410'),
  (14, 'Emissionskontrolle', null, 5, '851440'),
  (15, 'Klima und Mobilität', null, 5, '851420'),
  (16, 'Strahlung', null, 5, '851430'),
  (17, 'Beratung und Bewilligungen', null, 7, '852770'),
  (18, 'Planung', null, 7, '852730'),
  (19, 'Gewässernutzung', null, 7, '852740'),
  (20, 'Bau', null, 7, '852710'),
  (21, 'Gewässerunterhalt', 'gu', 7, '852760'),
  (22, 'Tankanlagen und Transportgewerbe', 'ta', 1, null);

insert into
  bereiche(id, abteilung, amt, sektion, name, standort, leiter, kurzzeichen)
values
  (1, 7, 1,	20,	'Betrieb Sihl',	'Werkhof Adliswil',	1, null),
  (2, 7, 1,	20,	'Betrieb Reuss / Limmat', 'Werkhof Obfelden',	2, null),
  (3, 7, 1,	20,	'Betrieb Töss',	'Werkhof Hettlingen',	3, null),
  (4, 7, 1,	20,	'Betrieb Thur / Rhein',	'Werkhof Andelfingen',	4, null),
  (5, 7, 1,	20,	'Betrieb Glatt',	'Werkhof Glattbrugg',	5, null),
  (6, 7, 1,	20,	'Betrieb Oberland / Seen',	'Werkhof Hinwil',	6, null),
  (7, 4, 1,	10,	'Wasserversorung',	'Stampfenbachstrasse 12/14',	7, null),
  (8, 1,	8,null,	'Fachgruppe Analytik',	'Carbahaus',	8, null),
  (9, 4, 1,	12,	'Liegenschaftenentwässerung',	'Stampfenbachstrasse 12/14',	9, null),
  (10, 3, 1,	null,	'Kerntechnik',	'Stampfenbachstrasse 12/14',	10, null);

insert into personen (id,amt,abteilung,sektion,bereich,anrede,name,vorname,adresse,plz,land,ort,eintrittDatum,austrittDatum,bemerkungen,status,bueroNr,kurzzeichen,letzteMutationZeit,letzteMutationUser) select id,amt,abteilung,sektion,bereich,anrede,name,vorname,adresse,plz,land,ort,eintrittDatum,austrittDatum,bemerkungen,status,bueroNr,kurzzeichen,letzteMutationZeit,letzteMutationUser from personen_import;
drop table personen_import;

insert into telefones (idPerson,nr,typ,letzteMutationZeit,letzteMutationUser) select idPerson,nr,typ,letzteMutationZeit,letzteMutationUser from telefones_import;
drop table telefones_import;

insert into
  settings(id,personMutationWeiterleiten,verzeichnisZeilenhoeheMm,mutationFormPath)
values
  (1,'ausgefülltes Formular bitte an awel@bd.zh.ch, silvio.cerutti@bd.zh.ch sowie IKO der Abteilung weiterleiten',4,'G:\Sekretariate_AWEL\Personalmutationen_nicht_umbenennen_PersonalDB');

insert into
  anredeWerte(value, sort)
values
  ('Herr', 1),
  ('Frau', 2);

insert into
  mobileAboTypWerte(value, sort)
values
  ('TODO mobileAboTypWert', 1);

insert into
  telefonTypWerte(value, sort)
values
  ('mobile', 1),
  ('Festnetz', 2);

insert into
  schluesselTypWerte(value)
values
  ('Kaba Nova'),
  ('Kaba Legic'),
  ('Kaba Star');

insert into
  schluesselAnlageWerte(value)
values
  ('RZ0146'),
  ('RZ0147');

insert into
  funktionWerte(value, sort)
values
  ('XY-Verantwortlich', 1),
  ('ZX-Organisator', 2);

insert into
  kaderFunktionWerte(value, sort)
values
  ('Amts-Leiter', 1),
  ('Abteilungs-Leiter', 2),
  ('Sektions-Leiter', 3),
  ('Bereichs-Leiter', 4);

insert into
  mobileAboKostenstelleWerte(value, sort)
values
  ('TODO mobileAboKostenstelleWert', 1);

insert into
  etikettWerte(value, sort)
values
  ('Kader-Treffen', 1),
  ('Sektionsleiter-Treffen', 2);

insert into
  anwesenheitstagWerte(value, sort)
values
  ('Montag', 1),
  ('Dienstag', 2),
  ('Mittwoch', 3),
  ('Donnerstag', 4),
  ('Freitag', 5);

insert into
  mutationArtWerte(value)
values
  ('test 1'),
  ('test 2');

PRAGMA foreign_keys = ON;