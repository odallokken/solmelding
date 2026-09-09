# ☀️ Arntes solservice

En enkel webapp som viser solstatistikk for valgfritt sted og dato i Norge.

**👉 Prøv den her: [odallokken.github.io/solmelding](https://odallokken.github.io/solmelding/)**

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

## ⛱️ Solhjørnet-modus

Den store **⛱️ Solhjørnet**-knappen øverst på forsiden åpner en egen fullskjermvisning
med italiensk sommerstemning:

- **Fast posisjon** – viser alltid soldata for **59.93414° N, 10.76769° Ø**,
  uavhengig av kartpinnen og lagret sted. Kartet og ditt valgte sted endres ikke.
  Nedtellingen bruker horisonten for dette eksakte punktet og den valgte høyden
  over bakken, ikke en tidligere profil fra et annet punkt.
- **Nedtelling** – står sola på hjørnet nå, telles det ned til den forsvinner. Ellers
  telles det ned til neste gang sola treffer, og appen søker framover dag for dag
  (inntil 200 dager) slik at den også finner svaret midt på vinteren.
- **Horisonten** hentes fra hurtiglageret hvis den er beregnet før, ellers lastes den
  ned fra Kartverket med en framdriftsvisning.
- **Musikk** – «Tarantella Napoletana», altså Luigi Riccis *Tarantella di Piedigrotta*
  fra 1852 – melodien folk flest kjenner som selve Italia-låta. Ricci døde i 1859,
  så den falt i det fri i 1930. Melodien er transkribert direkte fra notekilden:
  åtte takter i 6/8, a-moll, punktert firedel = 140.

  Den spilles på et syntetisk trekkspill. Fritungene er egne bølgeformer med
  formanttopper, og hver tone klinger på flere tungerekker som er stemt noen cent
  fra hverandre – det er musette-svevingen som gjør at et trekkspill høres ut som
  et trekkspill. Melodien har i tillegg en oktavtunge, bassen en 16-fots under.
  Venstre hånd spiller stradella: bass på slaget og korte akkordstøt imellom,
  «oom-pah-pah». Alt er kort og avkortet, slik en tarantella faktisk spilles, med
  tamburin på åttendedelene. Ingen lydfiler lastes ned – alt lages i nettleseren
  med Web Audio. Kan slås av og på.
- **To dansende nonnaer** krysser skjermen i takt med musikken. De er tegnet som
  ren SVG: sølvgrått hår samlet i nakkeknute, briller, svart enkekjole med forkle,
  gullringer og kors – den ene med kjevle, den andre med tresleiv. Hoppet følger
  den punkterte firedelen (0,857 s), og armer, bein, skjørt og hode har hver sin
  animasjon på takten. Underveis kjefter de på hverandre og maser om mat og drikke
  i snakkebobler. Kulissene er italienske: tricolore-vimpler langs toppen og et
  stilleben med chianti-flaske, vinglass, tomater, hvitløk og basilikum.
  Hele laget er `pointer-events: none` og skjules ved `prefers-reduced-motion`.
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

**Publisert versjon:** [odallokken.github.io/solmelding](https://odallokken.github.io/solmelding/) –
serveres av GitHub Pages fra `main`, så hver push til `main` oppdaterer siden automatisk.

Alternativt kan du åpne `index.html` rett i en nettleser – ingen installasjon eller server
nødvendig. Kan lagres på hjemskjerm på iPhone e.l.

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
