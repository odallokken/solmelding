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
  Beregningen er låst til **bakkeplan (1,7 m øyehøyde)**, uavhengig av høydeskyveren
  i kartet. Nedtellingen bruker bare horisonten for dette eksakte punktet og
  denne høyden, aldri en lagret profil fra en høyere etasje.
- **Nedtelling** – står sola på hjørnet nå, telles det ned til den forsvinner. Ellers
  telles det ned til neste gang sola treffer, og appen søker framover dag for dag
  (inntil 200 dager) slik at den også finner svaret midt på vinteren.
- **Horisonten** hentes fra hurtiglageret hvis den er beregnet før, ellers lastes den
  ned fra Kartverket med en framdriftsvisning.
- **På denne dag** – en kort Italia-relatert historie med årstall og kildelenke.
  Kalenderen følger norsk dato (`Europe/Oslo`), også gjennom sommertid og skuddår.
  Historiene følger med appen i `italy-days.js`, uten et eksternt API ved hvert besøk.
  Alle 366 kalenderdatoer er dekket med fødselsdager og historiske hendelser.
  Oppføringene gjentas årlig. Fødselsdatoer og yrker bygger på Wikidata (CC0);
  utvalgte oppføringer er kontrollert mot Britannica og historiske oversikter.
  Tekstene er egenformulert på norsk, og hver oppføring lenker til sin kilde.
- **Dagens Italia-quiz** – ett spørsmål fra en bank på 60 spørsmål. Samme dato gir
  samme spørsmål for alle; oppdatering av siden gir ikke et nytt. Trykk på kortet
  for å snu det og se svaret, og trykk igjen for spørsmålet. Det fungerer også med
  Enter og mellomrom. Dagens innhold skifter ved norsk midnatt, og svaret skjules
  når et nytt spørsmål kommer. Redusert bevegelse slår av snuanimasjonen.
- **Musikk** – «Nonnaenes kjøkkendans», en egen italienskinspirert melodi med
  mandolinaktige plukk, myk gitar og spretten bass. Instrumentene genereres med
  Web Audio; dette er ikke en innspilling av levende musikere. Ingen eksterne
  opptak, lydpakker eller lånte melodier brukes.

  Dansen har 40 takter i 6/8 ved 108 punkterte firedeler per minutt, omtrent
  44 sekunder før den gjentas. Intro, musikalske spørsmål og svar, små pauser og
  variasjoner erstatter den korte trekkspillsløyfen. Volumet er dempet, med myk
  inn- og utfading og uten vedvarende tamburin. Hele stykket rendres én gang og
  sløyfes av lydmotoren, uten tidtakere som kan forstyrre rytmen i bakgrunnen.
  Musikken starter ved knappetrykket, uavhengig av hvor lang tid horisontdataene tar,
  og kan slås av og på.
- **To dansende nonnaer** krysser skjermen i takt med musikken. De er tegnet som
  ren SVG: sølvgrått hår samlet i nakkeknute, briller, svart enkekjole med forkle,
  gullringer og kors – den ene med kjevle, den andre med tresleiv. Hoppet følger
  musikkens tempo (0,556 s per hovedslag), og armer, bein, skjørt og hode har hver sin
  animasjon. Underveis kjefter de på hverandre og maser om mat og drikke
  i snakkebobler. De har sitt eget område under kortene, slik at tekst og knapper
  ikke dekkes til. Figurene er `pointer-events: none` og skjules ved `prefers-reduced-motion`.
- **Italiensk landskap** – en egen SVG-illustrasjon med dempede olivengrønne åser,
  sypresser og en villa med terrakottatak erstatter vinflasken og grønnsakene.
  Ingen eksterne bilder lastes ned.
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
nødvendig. Behold `italy-days.js` i samme mappe for dagsfaktaene.
Kan lagres på hjemskjerm på iPhone e.l.

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
- Italia-kalender: [Wikidata](https://www.wikidata.org/) (CC0), Britannica og
  Wikipedia, med kildelenke ved hver oppføring. Faktagrunnlag hentet 9. september 2026.
- Instagram: [@arntessolservice](https://www.instagram.com/arntessolservice/)
