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

## Forsiden på mobil

Velg **sted og dato**, og trykk **Vis solmelding** eller **Min posisjon**.
Datopilene bytter én dag om gangen; **I dag** går tilbake til dagens dato.
Hovedkortet samler dagslys, soloppgang og solnedgang for valgt sted og dato.
Disse tidene gjelder uten lokale hindringer, i nettleserens tidssone.

- **Mer om dagen** åpner detaljstatistikk, demring, skumring og merkedager.
- **Nøyaktig sol der du bor** åpner kartet og høydeinnstillingene. Når beregningen
  er klar, vises direkte sol i et eget kort. **Se de beregnede soltidene** går
  direkte til resultatet; horisontgrafen og 3D kan åpnes ved behov.
- **Del solmeldingen** åpner nedlasting av mobilbildet.

Feltene starter lukket, også når terrengberegning er aktiv fra forrige besøk.
Å lukke kartfeltet slår ikke av beregningen eller endrer kartpinnen. Tastaturet
kan åpne og lukke feltene med Enter eller mellomrom, og fokus er tydelig markert.

## 🏙️ Nøyaktig sol der du bor

Vanlige soloppgangstider later som om du står på ei endeløs slette. Bor du i en bygate
stemmer det dårlig: sola kommer først når den klatrer over nabogården, og forsvinner
lenge før den «egentlig» går ned.

Denne funksjonen regner ut når sola faktisk treffer *ett bestemt punkt*:

1. Åpne **Nøyaktig sol der du bor**, slå på **Terreng + bygninger** og tillat posisjon i nettleseren. Kartet flytter
   pinnen til enhetens posisjon, også når et tidligere åpent kart gjenåpnes ved
   lasting av siden. Oppgitt posisjonsnøyaktighet vises under kartet; finjuster
   pinnen med et trykk og still inn høyden over bakken (gateplan, 2. etasje,
   takterrasse …). **Min posisjon i kartet** henter posisjonen på nytt.
   Uten posisjonstilgang beholdes kartpinnen, og du kan velge punktet manuelt.
   Panorering, zooming eller et manuelt trykk avbryter en ventende automatisk
   plassering, slik at et sent posisjonssvar ikke overstyrer valget ditt.
   Kartet kan zoomes ut til landsoversikt med **−**, og inn igjen med **+** eller
   musehjulet (zoomnivå 3–18).
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

### Interaktive omgivelser i 3D

Etter beregningen kan du åpne **Se omgivelsene og sola i 3D**. Synspunktet følger
den valgte kartpinnen og høyden over bakken, ikke et fast demonstrasjonspunkt.
Dra med mus eller finger for å se rundt hele kompasset. Piltastene virker når
bildet har fokus; **Se mot nord** og **Se mot sola** gir rask orientering.
Tidslinjen viser solas beregnede plassering gjennom den valgte datoen, i samme
lokale tidssone som resten av appen.

Bygningsformer, inkludert gårdsrom, hentes fra OpenStreetMap i et avgrenset
nærområde. Kartverkets DOM1 og DTM1 gir overflate- og terrenghøyder. Tak gjengis
forenklet som flate flater. Hvis målte bygningshøyder mangler, brukes tilgjengelig
OSM-høyde eller etasjeantall; dette opplyses i visningen. Uten høydedata vises ikke
bygningen som om høyden var kjent.

Trær illustreres ved kartlagte enkelttrær og innen kartlagte skogarealer.
Trekroner og plasseringen av trær innen skogarealer er omtrentlige. **Manglende
kartlegging betyr at bygninger eller trær kan mangle i bildet.** Visningen er ikke
et foto, en detaljert fasademodell eller en registrering av dagens bladverk.
Terrengflaten er også grovere enn høydegrunnlaget som brukes til soltidsberegningen.

Den turkise horisontlinjen og solstatusen bruker den eksisterende horisontprofilen,
også for hindringer utenfor 3D-nærområdet. En dempet solmarkør viser den projiserte
posisjonen når sola er skjult. Solstatusen avgjøres **ikke** av de forenklede
3D-formene eller eventuelle illustrative skygger. Skydekke inngår ikke.

3D-data lastes bare når du åpner visningen. Siste nærområde beholdes i minnet i
inntil 15 minutter, slik at endring av klokkeslett ikke gir nye nettverkskall.
Rått OSM-kartgrunnlag for inntil tre punkter lagres lokalt i sju dager. Kartets
databasedato vises, med varsel hvis den er eldre enn 90 dager. Den offentlige
Overpass-tjenesten hos Private.coffee kan ligge etter dagens OSM-data og har
ingen tilgjengelighetsgaranti. Appen bytter ikke automatisk til andre tjenere
ved feil eller begrensninger; HTTP-feil gir minst ett minutts ventetid før nytt kall.
Kart- og høydekall avbrytes ved lukking eller bytte av punkt. Ved manglende data,
nettverksfeil eller en nettleser uten WebGL2 vises en feilmelding med ny prøveknapp;
soltidene og den vanlige horisontgrafen er fortsatt tilgjengelige.

Profilen mellomlagres, så samme punkt og høyde beregnes bare én gang.
Beregningen tar 5–10 sekunder første gang og dekker bare Norge.

**Merk at plasseringen betyr mye.** Står pinnen tett inntil en vegg får du naturlig nok
mindre sol – det er et helt riktig svar for akkurat det punktet, og et solhjørne er
nettopp et sted der veggen står nær. Vil du se hva som skjer lenger ut i gata eller
høyere opp i gården, flytt pinnen eller endre høyden.

## ⛱️ Solhjørnet-modus

Den store **⛱️ Solhjørnet**-knappen øverst på forsiden åpner en egen fullskjermvisning
med italiensk sommerstemning. Visningen bruker forsidens mørkeblå bakgrunn,
blå kort og gullfargede detaljer:

- **Solstatus på knappen** – viser om sola er på hjørnet nå, hvor lenge den blir,
  eller hvor lenge det er til neste sol. En grønn linje tømmes gjennom soltiden;
  i skyggen fylles en blå linje de siste 24 timene før sola kommer. Lengre ventetid
  vises med tom linje og dato, ikke som om sola er rett rundt hjørnet.
  Teksten gir samme informasjon uten å være avhengig av farger.
  Bygningskart og horisont hentes automatisk i bakgrunnen og deles med
  fullskjermvisningen, uten å starte musikk eller endre kartpinnen.
  Under lasting eller nettverksfeil vises ingen oppdiktet solstatus; trykk på
  knappen for å prøve igjen ved feil. Dette er **beregnet sol, ikke værmelding**:
  skydekke inngår ikke.
- **Fast posisjon** – viser alltid soldata for **59.93413° N, 10.76767° Ø**,
  uavhengig av kartpinnen og lagret sted. Kartet og ditt valgte sted endres ikke.
  Beregningen er låst til **bakkeplan (1,7 m øyehøyde)**, uavhengig av høydeskyveren
  i kartet. Nedtellingen bruker bare horisonten for dette eksakte punktet og
  denne høyden, aldri en lagret profil fra en høyere etasje.
- **Uten nærliggende trær** – bare i Solhjørnet brukes DTM1 (bakken) utenfor
  kartlagte bygningsomriss, også i åpne bakgårder. Innenfor omrissene brukes
  DOM1 for å beholde bygningenes målte høyder; fjernt terreng beholdes.
  Det vanlige kartet og 3D-visningen inkluderer fortsatt trær.
  Punkt, bakkeplan og dato for bygningskartet vises i modusen.
- **Nedtelling** – står sola på hjørnet nå, telles det ned til den forsvinner. Ellers
  telles det ned til neste gang sola treffer, og appen søker framover dag for dag
  (inntil 200 dager) slik at den også finner svaret midt på vinteren.
- **Horisonten** hentes fra hurtiglageret hvis den er beregnet før, ellers lastes den
  ned fra Kartverket med en framdriftsvisning på knappen og i åpen fullskjermvisning. Solhjørnets profil har en egen,
  versjonert lagernøkkel og kan ikke blandes med profiler som inkluderer trær.
- **På denne dag** – en kort Italia-relatert historie med årstall og kildelenke.
  Kalenderen følger norsk dato (`Europe/Oslo`), også gjennom sommertid og skuddår.
  Historiene følger med appen i `italy-days.js`, uten et eksternt API ved hvert besøk.
  Alle 366 kalenderdatoer er dekket med fødselsdager og historiske hendelser.
  Oppføringene gjentas årlig. Fødselsdatoer og yrker bygger på Wikidata (CC0);
  utvalgte oppføringer er kontrollert mot Britannica og historiske oversikter.
  Tekstene er egenformulert på norsk, og hver oppføring lenker til sin kilde.
- **Italia-quiz** – én knapp som veksler mellom spørsmål og svar. Trykk for å snu
  kortet og se svaret; neste trykk snur til et nytt spørsmål. Du kan fortsette
  gjennom alle 60 spørsmål uten gjentakelser før en ny, tilfeldig stokket runde.
  Rekkefølgen stokkes også når du åpner modusen eller laster siden på nytt, og
  samme spørsmål vises ikke rett etter gjenåpning eller mellom to runder.
  Ved norsk midnatt starter en ny stokket runde uten å røpe svaret.
  Det fungerer også med Enter og mellomrom. Redusert bevegelse slår av
  snuanimasjonen.
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
  På iPhone aktiveres lydmotoren i selve trykket. Nettlesere med Audio Session API
  bruker `playback` for musikken i stedet for Web Audios vanlige omgivelseslyd;
  forrige lydtype gjenopprettes når musikken stoppes. Blokkert eller avbrutt
  avspilling gir en synlig beskjed og mulighet til å starte igjen, ikke en
  misvisende «Musikk på». Ved stille lyd: sjekk medievolum, lydløsmodus
  (særlig på eldre iOS) og om lyden sendes til Bluetooth.
- **To dansende nonnaer** krysser skjermen i takt med musikken. De er tegnet som
  ren SVG: sølvgrått hår samlet i nakkeknute, briller, svart enkekjole med forkle,
  gullringer og kors – den ene med kjevle, den andre med tresleiv. Hoppet følger
  musikkens tempo (0,556 s per hovedslag), og armer, bein, skjørt og hode har hver sin
  animasjon. Underveis kjefter de på hverandre og maser om mat og drikke
  i snakkebobler. De har sitt eget område under kortene, slik at tekst og knapper
  ikke dekkes til. **Trykk på en nonna** for å høre et italiensk utrop; boblen viser
  det hun sier. Nonnaen med kjevlen roper **«Mamma mia! Mangia, mangia!»**;
  nonnaen med tresleiven roper **«Ehi! Basta, basta!»**.
  De to godkjente, KI-genererte lydklippene følger med appen i `audio/`, slik at
  stemme og uttrykk er de samme på tvers av enheter. Ingen talesyntese, API-nøkkel
  eller ekstern taletjeneste trengs ved avspilling. Et nytt trykk starter nonnaens
  klipp fra begynnelsen og stopper et eventuelt pågående utrop, uten kø.
  Tale virker også når musikken er slått av, og stoppes når modusen lukkes.
  Figurene er knapper som kan brukes med tastatur. Ved redusert bevegelse vises
  de i ro, slik at det fortsatt er mulig å trykke på dem.
- **Italiensk landskap** – en egen SVG-illustrasjon med dempede blågrønne åser,
  sypresser og en villa med terrakottatak erstatter vinflasken og grønnsakene.
  Ingen eksterne bilder lastes ned.
- Lukkes med **← Tilbake** eller **Esc**.

### Bygningsgrunnlag for Solhjørnet

`solhjornet-buildings.json` inneholder 1 101 bygningsomriss med eventuelle
bakgårdshull innenfor et søkeområde på 650 m, rundt det faste punktet.
OSM-grunnlaget er datert **10. september 2026**. Filen lastes i bakgrunnen for
solstatusen på knappen og gjenbrukes når Solhjørnet åpnes.
Det gjøres ikke Overpass-kall fra Solhjørnet i nettleseren.

Omrissene er fra [OpenStreetMap-bidragsyterne](https://www.openstreetmap.org/copyright),
under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
Filen bevarer kilde-ID-er, dato, spørring, tjenesteadresse og lisens.
Kartleggingen er ikke en garanti for at alle bygninger finnes eller er riktig
plassert. DOM1 skiller heller ikke perfekt mellom tak og trær som overlapper
taket. Takoverheng, slike trær, kartfeil og alderen på høydedataene kan derfor
fortsatt påvirke resultatet. Tidene er modellberegninger, ikke observasjoner.
Kartgrunnlag eldre enn 90 dager merkes i visningen.

Oppdater omrissene med Node 18 eller nyere:

```powershell
node scripts\update-solhjornet-buildings.mjs 59.93413 10.76767
```

Skriptet gjør én avgrenset forespørsel til Overpass og bruker samme
polygonparser som 3D-visningen, men uten dens avstands-, størrelses- og
antallsbegrensninger. Ufullstendige polygoner eller tjenestefeil stopper
oppdateringen. Endrede omriss gir en ny versjon og dermed en ny horisontprofil.
Et manglende eller inkompatibelt bygningskart gir en synlig feil, aldri
automatisk tilbakefall til beregninger med trær.
Manglende høyder i nær- og mellomsonen avbryter beregningen, i stedet for å
utelate en mulig hindring og lagre en misvisende profil.

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
nødvendig. Behold `italy-days.js` i samme mappe for dagsfaktaene og `audio/` for nonnaenes utrop.
Kan lagres på hjemskjerm på iPhone e.l.
Solhjørnets bygningskart og den valgfrie 3D-visningen må åpnes via en webserver
(for eksempel den publiserte siden), ikke `file://`. 3D-visningen bruker
JavaScript-moduler og krever WebGL2. Kart- og høydedata krever nett.

## Teknisk

- Ren HTML/CSS/JavaScript uten build-steg. Den valgfrie 3D-visningen bruker lokalt
  medfølgende Three.js 0.186.0; resten av appen trenger ikke 3D-biblioteket.
- `surroundings-data.mjs` bygger geometrien fra kartlegging og høydedata;
  `surroundings-view.mjs` tegner og styrer første-personsvisningen.
- Three.js-filene i `vendor/three/` er hentet fra npm-pakken `three@0.186.0`.
  Den minifiserte kjernen er lagret som `three.core.js` for å samsvare med
  bibliotekets relative import. Lisensen følger med; ingen CDN brukes ved visning.
- Geokoding via [OSM Nominatim](https://nominatim.openstreetmap.org/)
- Høydedata via [Kartverkets høydedata-API](https://ws.geonorge.no/hoydedata/v1/) (DOM1 og DTM1)
- Avgrensede OSM-uttrekk via [Private.coffee Overpass](https://overpass.private.coffee/api/interpreter),
  bare ved åpning av 3D og uten API-nøkkel. Større bruk må avklares med tjenesteleverandøren.
- Kartbakgrunn via [Kartverkets WMTS-cache](https://kartverket.no/api-og-data/kartgrunnlag), tegnet i et eget lite kart uten kartbibliotek
- All solberegning skjer lokalt i nettleseren

## Kreditering

- Solberegning: [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/)
- Høydedata og kart: [Kartverket](https://hoydedata.no/) (CC BY 4.0)
- Geokoding: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
- Bygningsformer og kartlagt vegetasjon:
  [OpenStreetMap-bidragsytere](https://www.openstreetmap.org/copyright) (ODbL).
- 3D-rendering: [Three.js](https://threejs.org/), versjon 0.186.0 (MIT).
- Italia-kalender: [Wikidata](https://www.wikidata.org/) (CC0), Britannica og
  Wikipedia, med kildelenke ved hver oppføring. Faktagrunnlag hentet 9. september 2026.
- Nonnaenes stemmer: KI-genererte klipp laget med Resemble AIs
  [Chatterbox Multilingual-demo](https://huggingface.co/spaces/ResembleAI/Chatterbox-Multilingual-TTS)
  9. september 2026 og godkjent ved lytting. [Modellen](https://github.com/resemble-ai/chatterbox)
  er MIT-lisensiert. Klippene bruker demoens franske og spanske stemmepresett
  med italiensk tekst, uttrykksstyrke 1,5 og frø 42/123; de er ikke opptak av ekte nonnaer.
- Instagram: [@arntessolservice](https://www.instagram.com/arntessolservice/)
