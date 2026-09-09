# ☀️ Arntes solservice

En enkel webapp som viser solstatistikk for valgfritt sted og dato i Norge.

## Funksjoner

- **Dagslys i dag** (tt:mm:ss) for valgfritt sted og dato
- **Mer lys enn i går** (mm:ss)
- **Mer dagslys siden vintersolverv** (tt:mm:ss)
- **Sist like lyst** – hvilken dato hadde tilsvarende dagslys før solverv
- **Dager siden like lyst**
- **Klokkeslett** for demring, soloppgang, solnedgang og skumring
- **Merkedager** – banner vises når dagslyset passerer en halvtime-grense
- **Visuell solbane** over horisonten
- **🏙️ Nøyaktig sol der du bor** – ekte soltider for ett bestemt punkt, med bygninger, trær og terreng regnet inn (se under)
- **Sol-grafikk** av Arnte tegnet av Oda 10 år <3
- **Instagram-eksport** – last ned 1080×1920 px PNG med gjennomsiktig bakgrunn slik at det ev. kan legges oppå annet bilde
- Husker **siste posisjon** (localStorage)
- Grunnberegningene kjører **offline** (NOAA-algoritme). Bare kartet og horisontberegningen trenger nett.

## 🏙️ Nøyaktig sol der du bor

Vanlige soloppgangstider later som om du står på ei endeløs slette. Bor du i en bygate
stemmer det dårlig: sola kommer først når den klatrer over nabogården, og forsvinner
lenge før den «egentlig» går ned.

Denne funksjonen regner ut når sola faktisk treffer *ett bestemt punkt*:

1. Sett pinnen der du bor i kartet, og still inn hvor høyt over bakken du er
   (gateplan, 2. etasje, takterrasse …).
2. Appen henter ca. 8 500 høydepunkter fra Kartverket og bygger en horisontprofil –
   én synsvinkel for hver av de 360 kompassretningene.
   - **Nærsonen (2–600 m)** hentes fra **DOM1**, Kartverkets digitale *overflatemodell*
     med 1 meters oppløsning. Den inneholder bygninger og trær, ikke bare bakken.
   - **Fjernsonen (0,6–30 km)** hentes fra **DTM1** (terrengmodell), og korrigeres for
     jordkrumning og refraksjon – på 15 km utgjør krumningen alene ca. 15 meter.
   - Rundt hver stråles høyeste treff gjøres en ekstra finsøking, slik at vi finner den
     *nære takkanten* og ikke bare et tilfeldig punkt midt på taket.
3. Sola sin bane skannes gjennom hele døgnet, og vi finner hvert tidsrom der den står
   over horisontprofilen i sin egen retning.

Resultatet er en liste over soltidsrom, hvor mye direkte sol du får til sammen, og et
panoramabilde av horisonten sett fra punktet ditt.

Profilen mellomlagres, så samme punkt og høyde beregnes bare én gang.
Beregningen tar 5–10 sekunder første gang og dekker bare Norge.

**Merk at plasseringen betyr mye.** Står pinnen tett inntil en vegg får du naturlig nok
mindre sol – det er et helt riktig svar for akkurat det punktet, og et solhjørne er
nettopp et sted der veggen står nær. Vil du se hva som skjer lenger ut i gata eller
høyere opp i gården, flytt pinnen eller endre høyden.

Knappen **⛱️ Solhjørnet** setter pinnen tilbake på det faste utepunktet og regner ut
på nytt.

## ⛱️ Solhjørnet-modus

Den store **⛱️ Solhjørnet**-knappen øverst på forsiden åpner en egen fullskjermvisning
med italiensk sommerstemning:

- **Nedtelling** – står sola på hjørnet nå, telles det ned til den forsvinner. Ellers
  telles det ned til neste gang sola treffer, og appen søker framover dag for dag
  (inntil 200 dager) slik at den også finner svaret midt på vinteren.
- **Horisonten** hentes fra hurtiglageret hvis den er beregnet før, ellers lastes den
  ned fra Kartverket med en framdriftsvisning.
- **Musikk** – «Tarantella Napoletana», den tradisjonelle napolitanske folketonen,
  spilt som 8-bits chiptune: to pulskanaler (melodi og arpeggio), trekantbass og
  støykanal med tamburin, alt syntetisert direkte i nettleseren med Web Audio.
  Melodien er anonym og falt i det fri, og ingen lydfiler lastes ned. Kan slås av og på.
- Lukkes med **← Tilbake** eller **Esc**.

## Nøyaktighet

Beregningene bruker [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/)-algoritmen.
Sola sin posisjon itereres fram til selve soloppgangs- og solnedgangstidspunktet, ikke
bare kl. 12 UT – uten den itereringen bommer man med opptil halvannet minutt vår og høst
på våre breddegrader. Tidene ligger innenfor det minuttet
[MET Norway (yr.no)](https://api.met.no/weatherapi/sunrise/3.0/documentation) oppgir,
testet for Oslo, Bergen, Kristiansand og Trondheim gjennom hele året.

Til refraksjon brukes Sæmundssons formel, som er kontinuerlig og gyldig helt ned til
horisonten – nettopp der hustak og åsrygger ligger.

De oppgitte soloppgangstidene følger den vanlige konvensjonen (sola sin øvre rand ved
0,833° under horisonten). Horisontmotoren regner i stedet ekte refraksjon ved den
faktiske høyden, så «første sol» kan avvike med et halvt minutt ved helt fri horisont.

## Bruk

Åpne `index.html` i en nettleser – ingen installasjon eller server nødvendig. Kan lagres på hjemskjem på iPhone e.l.

Eller besøk den publiserte versjonen via GitHub Pages.

## Teknisk

- Ren HTML/CSS/JavaScript – ingen avhengigheter, ingen build-steg
- Geokoding via [OSM Nominatim](https://nominatim.openstreetmap.org/)
- Høydedata via [Kartverkets høydedata-API](https://ws.geonorge.no/hoydedata/v1/) (DOM1 og DTM1)
- Kartbakgrunn via [Kartverkets WMTS-cache](https://kartverket.no/api-og-data/kartgrunnlag), tegnet i et eget lite kart uten kartbibliotek
- All solberegning skjer lokalt i nettleseren

## Kreditering

- Solberegning: [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/)
- Høydedata og kart: [Kartverket](https://hoydedata.no/) (CC BY 4.0)
- Geokoding: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
- Instagram: [@arntessolservice](https://www.instagram.com/arntessolservice/)
