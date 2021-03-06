
# Kick off, erster Sprint

## Projektablauf

Am Anfang analysierten wir welches Verhalten gewünscht war und überprüften unser Verständnis mit folgenden Mitteln:

* Prototypskizzen (Bilder 1,2,3)
* Architekturskizzen (Bild 4)
* Tests (Bild 4 unten)
* API-Abrufen (Bild 5 oben)
* konkreten Datenstrukturen (Bild 5 unten)


Nachdem die wichtigsten Punkte abgesteckt waren, widmeten wir unsere Aufmerksamkeit dem ersten Feature. 
Jetzt wurde der Entwurf konkreter, indem wir Datenflüsse skizzierten und uns Gedanken über Abhängigeiten von
Benutzerschnittstellen wie z.B. der HTTP Verarbeitung und der eigenlichen Verhaltensproduktion machten.

Benutzerschnittstellen sollten schön weit weg von dem Software-Kern sein und wurden an der äußeren Membran angesiedelt (Bild 7, rote Kästchen in der Mitte - Trennung zwischen REST-Portal und Interactions).

Außerdem skizzierten wir einen Datenfluss des Features mittels Funktionsbäumen (Bild 9 unten). 
Nur an den Wurzel-Knoten befinden sich Berechnungen und fremd-API-Aufrufe (Operationen) (Bild 9, die Knoten 11, 12, 2, 3, 41, 42, 43).
Alle anderen Knoten rufen nur andere Unterknoten auf (Integration) (Bild 9, die Knoten 1 und 4).
Durch diese Trennung sind die Integrations-Knoten so einfach, dass man bei Funktionen dieser Art nicht wirklich das Bedürfnis hat, diese mit Tests abzudecken.
Lediglich bei den Operations-Knoten steigt die Unsicherheit und somit auch die Anzahl der Tests.

Die einzelnen Phasen, Analyse, Entwurf, Implementation wurden immer wieder durchlaufen.
Wenn das Verständnis groß war, konnten wir die Zeit nutzen, um zu implementieren und Ergebnisse zu Präsentieren.
Gab es jedoch Überaschungen oder Unklarheiten, dann befanden wir uns wieder in den Analyse- und Entwurfs-Phasen.


Übersicht der Phansen:

* Analyse: Verständnis über die Verhaltensanforderungen erlangen
* Entwurf: Lösungsansatz grob skizzieren
* Implementation: implementieren und Abnahme durch den Product Owner im wechsel


## Brainstorming, Sprint Planning

Worum geht es in diesem Projekt? Worauf wollen wir uns konzentrieren?
Was sind die wichtigsten Features? Was ist unsere Mission?


**Bild 01: Neue Groupbox anlegen**
![01 Neue Groupbox anlegen](images-kickoff/01.jpeg)

**Bild 02: Groupbox Hauptseite**
![02 Groupbox Hauptseite](images-kickoff/02.jpeg)


**Bild 03: Neue Nachricht anlegen**
![03 Neue Nachricht anlegen](images-kickoff/03.jpeg)

**Bild 04: Mission Statement**
![04 Mission Statement](images-kickoff/04.jpeg)

## Architektur

In welchem Umfeld bewegen wir uns? Was können wir zur groben Architektur sagen?
Was sind die Kontrakte/Datenstrukturen zwischen Frontend und Backend?

**Bild 05: Subarchitekturen (Frontend, Backend)**
![05 Subarchitekturen (Frontend, Backend)](images-kickoff/05.jpeg)

**Bild 06: Kontrakte**
![06 Kontrakte](images-kickoff/06.jpeg)

## Entwürfe

**Bild 07: GetVersion**
![07 GetVersion](images-kickoff/07.jpeg)

**Bild 08: GetBox**
![08 GetBox](images-kickoff/08.jpeg)

**Bild 09: CreateBox**
![09 CreateBox](images-kickoff/09.jpeg)

**Bild 10: HTTP Portal**
![10 Kontrakte](images-kickoff/10.jpeg)

