# Mouse Cheese Idle

Textbasiertes Browser-Idle-Game mit ASCII-Art. Das Ziel ist, als Maus immer mehr Kaese zu produzieren, Systeme zu automatisieren und durch Prestige (Instinkt) langfristig staerker zu werden.

Text-based browser idle game with ASCII art. The goal is to produce more and more cheese as a mouse, automate systems, and grow stronger long-term through prestige (instinct).

## Start

1. `index.html` im Browser oeffnen.
2. Mit **Nagen** Kaese sammeln.
3. Im Shop Upgrades kaufen, um Produktion und Ideen zu steigern.

## Kernsysteme

- **Ressourcen**
  - `Kaese`: Hauptressource fuer Upgrades.
  - `Ideen`: Sekundaerressource aus fortgeschrittener Produktion.
  - `Instinkt`: permanenter Prestige-Bonus.
- **Upgrades**
  - Auto-Nager, Klickkraft, Ideenproduktion, Effizienzpfade.
  - Kosten skalieren mit jeder Stufe.
  - Forschung mit Ideen: `Schwarmdenken` und `Inspirierte Nager` werden mit Ideen gekauft.
- **Events**
  - Ab Midgame treten zufaellige Kurzzeit-Events auf.
  - Positiv (Kaeseregen) oder negativ (Katzennahe).
- **Prestige-light**
  - Ab genug Lebenszeit-Kaese verfuegbar.
  - Neustart mit permanentem Instinkt-Bonus.
- **Persistenz**
  - Auto-Save alle 15s.
  - Manueller Save-Button und Reset.

## Balancing-Hinweise

- Fruehes Spiel bevorzugt aktives Klicken.
- Midgame verschiebt den Fokus auf Automatisierung.
- Prestige beschleunigt wiederholte Durchlaeufe.

## Dateien

- `index.html` – Struktur und UI-Bereiche.
- `styles.css` – Terminal-Look und Layout.
- `game.js` – kompletter Spielzustand, Tick-Loop, Shop, Events, Save/Load.

## Sprache / Language

- Das Spiel enthaelt eine deutsche und eine englische Lokalisierung.
- Die Sprache wird automatisch per Browsersprache erkannt (`de*` -> Deutsch, sonst Englisch).
- Ueber den UI-Schalter `DE | EN` kann die Sprache manuell gewechselt werden.
- Die manuelle Auswahl wird im Browser gespeichert und beim naechsten Start wiederverwendet.
