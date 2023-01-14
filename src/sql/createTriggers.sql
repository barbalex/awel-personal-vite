create trigger addAnwesenheitstage
after insert on personen
begin
insert into anwesenheitstage (idPerson, tag, letzteMutationZeit, letzteMutationUser) values (new.id, 'Montag', new.letzteMutationZeit, new.letzteMutationUser);
insert into anwesenheitstage (idPerson, tag, letzteMutationZeit, letzteMutationUser) values (new.id, 'Dienstag', new.letzteMutationZeit, new.letzteMutationUser);
insert into anwesenheitstage (idPerson, tag, letzteMutationZeit, letzteMutationUser) values (new.id, 'Mittwoch', new.letzteMutationZeit, new.letzteMutationUser);
insert into anwesenheitstage (idPerson, tag, letzteMutationZeit, letzteMutationUser) values (new.id, 'Donnerstag', new.letzteMutationZeit, new.letzteMutationUser);
insert into anwesenheitstage (idPerson, tag, letzteMutationZeit, letzteMutationUser) values (new.id, 'Freitag', new.letzteMutationZeit, new.letzteMutationUser);
end;