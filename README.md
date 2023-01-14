# AWEL Personal

<br/>
Mit dieser Anwendung möchte das [AWEL des Kantons Zürich](https://awel.zh.ch) Personal-Daten verwalten.

Die Anwendung ist noch in Entwicklung.

## Technische Umsetzung

Die Anwendung ist in JavaScript geschrieben und benutzt unter anderem:

- [sqlite](http://sqlite.org): simpler lagern Daten nimmer :-)
- [electron](http://electron.atom.io): JavaScript-Anwendung lokal installieren
- [nodejs](https://nodejs.org): JavaScript auf dem PC
- [React](https://facebook.github.io/react): die Benutzeroberfläche ist eine Funktion der Anwendungs-Daten. Und erst noch modular
- [MobX State Tree](https://github.com/mobxjs/mobx-state-tree): Anwendungs-Daten managen wie ein Profi
- [styled components](https://github.com/styled-components/styled-components): Styling für Module
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid): anspruchsvolle Layouts gestalten

## Electron- versus Access- oder FileMaker-Anwendung

[Siehe im readme von Kapla](https://github.com/barbalex/kapla3#electron--versus-access-anwendung).

## Datenstruktur

![Datenstruktur](./app/etc/awel-personal-structure.png)

## Lizenz

[MIT © AWEL Kt. Zürich](./LICENSE)
