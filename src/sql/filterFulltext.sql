drop view if exists personenFts;
create view personenFts as
select
  personen.id,
  coalesce(personen.personalNr, '') || ' ' ||
  coalesce(lower(personen.name), '') || ' ' ||
  coalesce(lower(personen.vorname), '') || ' ' ||
  coalesce(lower(personen.anrede), '') || ' ' ||
  coalesce(lower(personen.titel), '') || ' ' ||
  coalesce(lower(personen.kurzzeichen), '') || ' ' ||
  coalesce(lower(personen.adresse), '') || ' ' ||
  coalesce(personen.plz, '') || ' ' ||
  coalesce(lower(personen.ort), '') || ' ' ||
  coalesce(lower(personen.land), '') || ' ' ||
  coalesce(lower(personen.email), '') || ' ' ||
  coalesce(personen.geburtDatum, '') || ' ' ||
  coalesce(lower(personen.bueroNr), '') || ' ' ||
  coalesce(lower(personen.standort), '') || ' ' ||
  coalesce(personen.eintrittDatum, '') || ' ' ||
  coalesce(personen.austrittDatum, '') || ' ' ||
  coalesce(lower(personen.status), '') || ' ' ||
  coalesce(lower(personen.parkplatzNr), '') || ' ' ||
  coalesce(lower(personen.bemerkungen), '') || ' ' ||
  coalesce(personen.beschaeftigungsgrad, '') || ' ' ||
  coalesce(personen.mutationFrist, '') || ' ' ||
  coalesce(lower(personen.mutationArt), '') || ' ' ||
  coalesce(personen.rufnummer, '') || ' ' ||
  coalesce(personen.arbeitsplatzeroeffnungPer, '') || ' ' ||
  coalesce(lower(personen.benoetigteSoftware), '') || ' ' ||
  coalesce(lower(personen.standardabweichendeHardware), '') || ' ' ||
  coalesce(personen.abmeldungArbeitsplatzPer, '') || ' ' ||
  coalesce(personen.bueroWechselPer, '') || ' ' ||
  coalesce(personen.kostenstellenAenderungPer, '') || ' ' ||
  coalesce(lower(personen.itMutationBemerkungen), '') || ' ' ||
  coalesce(lower(aemter.name), '') || ' ' ||
  coalesce(lower(abteilungen.name), '') || ' ' ||
  coalesce(lower(sektionen.name), '') || ' ' ||
  coalesce(lower(bereiche.name), '') || ' ' ||
  group_concat(lower(coalesce(kaderFunktionen.funktion, ''))) || ' ' ||
  group_concat(lower(coalesce(funktionen.funktion, ''))) || ' ' ||
  group_concat(lower(coalesce(telefones.nr, '') || ' ' || coalesce(telefones.typ, '') || ' ' || coalesce(telefones.bemerkungen, ''))) || ' ' ||
  group_concat(lower(coalesce(mobileAbos.kostenstelle, '') || ' ' || coalesce(mobileAbos.typ, '') || ' ' || coalesce(mobileAbos.bemerkungen, ''))) || ' ' ||
  group_concat(lower(coalesce(schluessel.typ, '') || ' ' || coalesce(schluessel.anlage, '') || ' ' || coalesce(schluessel.nr, '') || ' ' || coalesce(schluessel.bezeichnung, ''))) || ' ' ||
  group_concat(lower(coalesce(etiketten.etikett, ''))) || ' ' ||
  group_concat(lower(coalesce(anwesenheitstage.tag, '')))
  as data
from personen
left join aemter
  on personen.amt = aemter.id
left join abteilungen
  on personen.abteilung = abteilungen.id
left join sektionen
  on personen.sektion = sektionen.id
left join bereiche
  on personen.bereich = bereiche.id
left join kaderFunktionen
  on kaderFunktionen.idPerson = personen.id
left join funktionen
  on funktionen.idPerson = personen.id
left join telefones
  on telefones.idPerson = personen.id
left join mobileAbos
  on mobileAbos.idPerson = personen.id
left join schluessel
  on schluessel.idPerson = personen.id
left join etiketten
  on etiketten.idPerson = personen.id
left join anwesenheitstage
  on anwesenheitstage.idPerson = personen.id
group by personen.id;

