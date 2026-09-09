// Italia-kalender: 366 datoer, inkludert skuddagen.
// Faktagrunnlag: Wikidata (CC0) og kildene ved hver oppføring, hentet 9. september 2026.
// Korte, egenformulerte norske tekster; datoene gjentas hvert år.
const ITALY_DAYS = {
  "01-01": {
    "year": 1948,
    "text": "Italias republikanske grunnlov trådte i kraft.",
    "source": "https://en.wikipedia.org/wiki/Constitution_of_Italy"
  },
  "01-02": {
    "year": 1991,
    "text": "Fotballspilleren Davide Santon ble født.",
    "source": "https://www.wikidata.org/wiki/Q296033"
  },
  "01-03": {
    "year": 1929,
    "text": "Komponisten Sergio Leone ble født.",
    "source": "https://www.wikidata.org/wiki/Q164562"
  },
  "01-04": {
    "year": 1936,
    "text": "Filosofen Gianni Vattimo ble født.",
    "source": "https://www.wikidata.org/wiki/Q159648"
  },
  "01-05": {
    "year": 1932,
    "text": "Filosofen Umberto Eco ble født.",
    "source": "https://www.wikidata.org/wiki/Q12807"
  },
  "01-06": {
    "year": 1938,
    "text": "Komponisten Adriano Celentano ble født.",
    "source": "https://www.wikidata.org/wiki/Q199943"
  },
  "01-07": {
    "year": 1987,
    "text": "Fotballspilleren Davide Astori ble født.",
    "source": "https://www.wikidata.org/wiki/Q456164"
  },
  "01-08": {
    "year": 1998,
    "text": "Fotballspilleren Manuel Locatelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q23899393"
  },
  "01-09": {
    "year": 2006,
    "text": "Sangeren og låtskriveren Sarah Toscano ble født.",
    "source": "https://www.wikidata.org/wiki/Q125933527"
  },
  "01-10": {
    "year": 1959,
    "text": "Fotballtreneren Maurizio Sarri ble født.",
    "source": "https://www.wikidata.org/wiki/Q3852721"
  },
  "01-11": {
    "year": 1975,
    "text": "Historikeren Matteo Renzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q47563"
  },
  "01-12": {
    "year": 1987,
    "text": "Fotballspilleren Salvatore Sirigu ble født.",
    "source": "https://www.wikidata.org/wiki/Q299779"
  },
  "01-13": {
    "year": 1970,
    "text": "Syklisten Marco Pantani ble født.",
    "source": "https://www.wikidata.org/wiki/Q273860"
  },
  "01-14": {
    "year": 1919,
    "text": "Forfatteren Giulio Andreotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q50005"
  },
  "01-15": {
    "year": 1977,
    "text": "Politikeren Giorgia Meloni ble født.",
    "source": "https://www.wikidata.org/wiki/Q451791"
  },
  "01-16": {
    "year": 1948,
    "text": "Biskopen Giorgio Demetrio Gallaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q19723463"
  },
  "01-17": {
    "year": 1955,
    "text": "Biskopen Pietro Parolin ble født.",
    "source": "https://www.wikidata.org/wiki/Q574058"
  },
  "01-18": {
    "year": 1985,
    "text": "Fotballspilleren Riccardo Montolivo ble født.",
    "source": "https://www.wikidata.org/wiki/Q153002"
  },
  "01-19": {
    "year": 1986,
    "text": "Fotballspilleren Claudio Marchisio ble født.",
    "source": "https://www.wikidata.org/wiki/Q179995"
  },
  "01-20": {
    "year": 1920,
    "text": "Filmregissøren Federico Fellini ble født.",
    "source": "https://www.wikidata.org/wiki/Q7371"
  },
  "01-21": {
    "year": 1988,
    "text": "Skuespilleren Vanessa Hessler ble født.",
    "source": "https://www.wikidata.org/wiki/Q242896"
  },
  "01-22": {
    "year": 1920,
    "text": "Forfatteren Chiara Lubich ble født.",
    "source": "https://www.wikidata.org/wiki/Q168479"
  },
  "01-23": {
    "year": 1970,
    "text": "Fotballtreneren Moreno Torricelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q371904"
  },
  "01-24": {
    "year": 1981,
    "text": "Politikeren Maria Elena Boschi ble født.",
    "source": "https://www.wikidata.org/wiki/Q15143059"
  },
  "01-25": {
    "year": 1982,
    "text": "Sangeren og låtskriveren Noemi ble født.",
    "source": "https://www.wikidata.org/wiki/Q35109"
  },
  "01-26": {
    "year": 1987,
    "text": "Fotballspilleren Sebastian Giovinco ble født.",
    "source": "https://www.wikidata.org/wiki/Q213111"
  },
  "01-27": {
    "year": 2001,
    "text": "Svømmeren Thomas Ceccon ble født.",
    "source": "https://www.wikidata.org/wiki/Q56255577"
  },
  "01-28": {
    "year": 1978,
    "text": "Fotballspilleren Gianluigi Buffon ble født.",
    "source": "https://www.wikidata.org/wiki/Q68060"
  },
  "01-29": {
    "year": 1924,
    "text": "Komponisten Luigi Nono ble født.",
    "source": "https://www.wikidata.org/wiki/Q160451"
  },
  "01-30": {
    "year": 1934,
    "text": "Biskopen Giovanni Battista Re ble født.",
    "source": "https://www.wikidata.org/wiki/Q44842"
  },
  "01-31": {
    "year": 1983,
    "text": "Fotballspilleren Fabio Quagliarella ble født.",
    "source": "https://www.wikidata.org/wiki/Q45900"
  },
  "02-01": {
    "year": 1922,
    "text": "Operasangeren Renata Tebaldi ble født.",
    "source": "https://www.wikidata.org/wiki/Q229179"
  },
  "02-02": {
    "year": 1928,
    "text": "Politikeren Ciriaco De Mita ble født.",
    "source": "https://www.wikidata.org/wiki/Q316226"
  },
  "02-03": {
    "year": 1947,
    "text": "Skuespilleren Maurizio Micheli ble født.",
    "source": "https://www.wikidata.org/wiki/Q3301697"
  },
  "02-04": {
    "year": 1995,
    "text": "Lisa Vittozzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q15962014"
  },
  "02-05": {
    "year": 1932,
    "text": "Fotballtreneren Cesare Maldini ble født.",
    "source": "https://www.wikidata.org/wiki/Q296350"
  },
  "02-06": {
    "year": 1778,
    "text": "Den italienske dikteren og forfatteren Ugo Foscolo ble født.",
    "source": "https://www.britannica.com/biography/Ugo-Foscolo"
  },
  "02-07": {
    "year": 1997,
    "text": "Fotballspilleren Nicolò Barella ble født.",
    "source": "https://www.wikidata.org/wiki/Q20090225"
  },
  "02-08": {
    "year": 1987,
    "text": "Carolina Kostner ble født.",
    "source": "https://www.wikidata.org/wiki/Q233527"
  },
  "02-09": {
    "year": 1987,
    "text": "Fotballtreneren Davide Lanzafame ble født.",
    "source": "https://www.wikidata.org/wiki/Q367433"
  },
  "02-10": {
    "year": 1981,
    "text": "Fotballtreneren Enzo Maresca ble født.",
    "source": "https://www.wikidata.org/wiki/Q317282"
  },
  "02-11": {
    "year": 1982,
    "text": "Fotballspilleren Christian Maggio ble født.",
    "source": "https://www.wikidata.org/wiki/Q213102"
  },
  "02-12": {
    "year": 1923,
    "text": "Filmregissøren Franco Zeffirelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q53040"
  },
  "02-13": {
    "year": 1960,
    "text": "Økonomen Pierluigi Collina ble født.",
    "source": "https://www.wikidata.org/wiki/Q485885"
  },
  "02-14": {
    "year": 1974,
    "text": "Politikeren Valentina Vezzali ble født.",
    "source": "https://www.wikidata.org/wiki/Q229967"
  },
  "02-15": {
    "year": 1927,
    "text": "Forfatteren Carlo Maria Martini ble født.",
    "source": "https://www.wikidata.org/wiki/Q318497"
  },
  "02-16": {
    "year": 1979,
    "text": "Racerføreren Valentino Rossi ble født.",
    "source": "https://www.wikidata.org/wiki/Q169814"
  },
  "02-17": {
    "year": 1968,
    "text": "Fotballspilleren Giuseppe Signori ble født.",
    "source": "https://www.wikidata.org/wiki/Q334684"
  },
  "02-18": {
    "year": 1967,
    "text": "Fotballspilleren Roberto Baggio ble født.",
    "source": "https://www.wikidata.org/wiki/Q67964"
  },
  "02-19": {
    "year": 1977,
    "text": "Fotballtreneren Gianluca Zambrotta ble født.",
    "source": "https://www.wikidata.org/wiki/Q182907"
  },
  "02-20": {
    "year": 1990,
    "text": "Fotballspilleren Ciro Immobile ble født.",
    "source": "https://www.wikidata.org/wiki/Q458101"
  },
  "02-21": {
    "year": 1980,
    "text": "Komponisten Tiziano Ferro ble født.",
    "source": "https://www.wikidata.org/wiki/Q492029"
  },
  "02-22": {
    "year": 1921,
    "text": "Filmskuespilleren Giulietta Masina ble født.",
    "source": "https://www.wikidata.org/wiki/Q106907"
  },
  "02-23": {
    "year": 1946,
    "text": "Racerføreren Alberto Colombo ble født.",
    "source": "https://www.wikidata.org/wiki/Q516070"
  },
  "02-24": {
    "year": 1934,
    "text": "Politikeren Bettino Craxi ble født.",
    "source": "https://www.wikidata.org/wiki/Q192818"
  },
  "02-25": {
    "year": 1999,
    "text": "Fotballspilleren Gianluigi Donnarumma ble født.",
    "source": "https://www.wikidata.org/wiki/Q20830808"
  },
  "02-26": {
    "year": 1903,
    "text": "Kjemikeren Giulio Natta ble født.",
    "source": "https://www.wikidata.org/wiki/Q234145"
  },
  "02-27": {
    "year": 1935,
    "text": "Operasangeren Mirella Freni ble født.",
    "source": "https://www.wikidata.org/wiki/Q231600"
  },
  "02-28": {
    "year": 1942,
    "text": "Fotballtreneren Dino Zoff ble født.",
    "source": "https://www.wikidata.org/wiki/Q180661"
  },
  "02-29": {
    "year": 1792,
    "text": "Gioachino Rossini ble født. Han komponerte blant annet operaen Barberen i Sevilla.",
    "source": "https://www.britannica.com/biography/Gioachino-Rossini"
  },
  "03-01": {
    "year": 1931,
    "text": "Økonomen Lamberto Dini ble født.",
    "source": "https://www.wikidata.org/wiki/Q208100"
  },
  "03-02": {
    "year": 1988,
    "text": "Fotballspilleren Vito Mannone ble født.",
    "source": "https://www.wikidata.org/wiki/Q275977"
  },
  "03-03": {
    "year": 1995,
    "text": "Fotballspilleren Bryan Cristante ble født.",
    "source": "https://www.wikidata.org/wiki/Q4241246"
  },
  "03-04": {
    "year": 1943,
    "text": "Komponisten Lucio Dalla ble født.",
    "source": "https://www.wikidata.org/wiki/Q167546"
  },
  "03-05": {
    "year": 1922,
    "text": "Filmregissøren Pier Paolo Pasolini ble født.",
    "source": "https://www.wikidata.org/wiki/Q25120"
  },
  "03-06": {
    "year": 1938,
    "text": "Biskopen Francesco Coccopalmerio ble født.",
    "source": "https://www.wikidata.org/wiki/Q720642"
  },
  "03-07": {
    "year": 1908,
    "text": "Skuespilleren Anna Magnani ble født.",
    "source": "https://www.wikidata.org/wiki/Q56011"
  },
  "03-08": {
    "year": 1943,
    "text": "Historikeren Valerio Massimo Manfredi ble født.",
    "source": "https://www.wikidata.org/wiki/Q467817"
  },
  "03-09": {
    "year": 1955,
    "text": "Skuespilleren Ornella Muti ble født.",
    "source": "https://www.wikidata.org/wiki/Q166562"
  },
  "03-10": {
    "year": 2008,
    "text": "Fotballspilleren Francesco Camarda ble født.",
    "source": "https://www.wikidata.org/wiki/Q117263625"
  },
  "03-11": {
    "year": 1991,
    "text": "Fotballspilleren Alessandro Florenzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q1378371"
  },
  "03-12": {
    "year": 1921,
    "text": "Politikeren Gianni Agnelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q356351"
  },
  "03-13": {
    "year": 1955,
    "text": "Fotballtreneren Bruno Conti ble født.",
    "source": "https://www.wikidata.org/wiki/Q355923"
  },
  "03-14": {
    "year": 1957,
    "text": "Politikeren Franco Frattini ble født.",
    "source": "https://www.wikidata.org/wiki/Q333833"
  },
  "03-15": {
    "year": 1968,
    "text": "Komponisten Sabrina Salerno ble født.",
    "source": "https://www.wikidata.org/wiki/Q232479"
  },
  "03-16": {
    "year": 1941,
    "text": "Filmregissøren Bernardo Bertolucci ble født.",
    "source": "https://www.wikidata.org/wiki/Q53009"
  },
  "03-17": {
    "year": 1861,
    "text": "Kongeriket Italia ble proklamert, med Viktor Emanuel II som konge.",
    "source": "https://en.wikipedia.org/wiki/Proclamation_of_the_Kingdom_of_Italy"
  },
  "03-18": {
    "year": 1984,
    "text": "Fotballtreneren Simone Padoin ble født.",
    "source": "https://www.wikidata.org/wiki/Q350988"
  },
  "03-19": {
    "year": 1943,
    "text": "Økonomen Mario Monti ble født.",
    "source": "https://www.wikidata.org/wiki/Q47904"
  },
  "03-20": {
    "year": 1991,
    "text": "Fotballspilleren Mattia Destro ble født.",
    "source": "https://www.wikidata.org/wiki/Q380830"
  },
  "03-21": {
    "year": 1941,
    "text": "Forfatteren Fausto Cercignani ble født.",
    "source": "https://www.wikidata.org/wiki/Q465664"
  },
  "03-22": {
    "year": 1921,
    "text": "Filmregissøren Nino Manfredi ble født.",
    "source": "https://www.wikidata.org/wiki/Q55456"
  },
  "03-23": {
    "year": 1922,
    "text": "Filmregissøren Ugo Tognazzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q55468"
  },
  "03-24": {
    "year": 1926,
    "text": "Komponisten Dario Fo ble født.",
    "source": "https://www.wikidata.org/wiki/Q765"
  },
  "03-25": {
    "year": 1993,
    "text": "Fotballspilleren Leonardo Spinazzola ble født.",
    "source": "https://www.wikidata.org/wiki/Q6526099"
  },
  "03-26": {
    "year": 1977,
    "text": "Fotballspilleren Morgan De Sanctis ble født.",
    "source": "https://www.wikidata.org/wiki/Q219618"
  },
  "03-27": {
    "year": 1970,
    "text": "Forfatteren Gaia Zucchi ble født.",
    "source": "https://www.wikidata.org/wiki/Q52159059"
  },
  "03-28": {
    "year": 1990,
    "text": "Fotballspilleren Luca Marrone ble født.",
    "source": "https://www.wikidata.org/wiki/Q704951"
  },
  "03-29": {
    "year": 1991,
    "text": "Fotballspilleren Fabio Borini ble født.",
    "source": "https://www.wikidata.org/wiki/Q245054"
  },
  "03-30": {
    "year": 1977,
    "text": "Francesca Albanese ble født.",
    "source": "https://www.wikidata.org/wiki/Q115860841"
  },
  "03-31": {
    "year": 1934,
    "text": "Fysikeren Carlo Rubbia ble født.",
    "source": "https://www.wikidata.org/wiki/Q187199"
  },
  "04-01": {
    "year": 1953,
    "text": "Fotballtreneren Alberto Zaccheroni ble født.",
    "source": "https://www.wikidata.org/wiki/Q316633"
  },
  "04-02": {
    "year": 1982,
    "text": "Fotballtreneren Marco Amelia ble født.",
    "source": "https://www.wikidata.org/wiki/Q234866"
  },
  "04-03": {
    "year": 1972,
    "text": "Skuespilleren Lola Pagnani ble født.",
    "source": "https://www.wikidata.org/wiki/Q131665"
  },
  "04-04": {
    "year": 1915,
    "text": "Fotballtreneren Amedeo Biavati ble født.",
    "source": "https://www.wikidata.org/wiki/Q460580"
  },
  "04-05": {
    "year": 1943,
    "text": "Romanforfatteren Elena Ferrante ble født.",
    "source": "https://www.wikidata.org/wiki/Q368127"
  },
  "04-06": {
    "year": 1959,
    "text": "Fotballtreneren Pietro Vierchowod ble født.",
    "source": "https://www.wikidata.org/wiki/Q351990"
  },
  "04-07": {
    "year": 1948,
    "text": "Fotballspilleren Pietro Anastasi ble født.",
    "source": "https://www.wikidata.org/wiki/Q62252"
  },
  "04-08": {
    "year": 1921,
    "text": "Operasangeren Franco Corelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q313831"
  },
  "04-09": {
    "year": 1985,
    "text": "Fotballtreneren Antonio Nocerino ble født.",
    "source": "https://www.wikidata.org/wiki/Q213546"
  },
  "04-10": {
    "year": 1939,
    "text": "Romanforfatteren Claudio Magris ble født.",
    "source": "https://www.wikidata.org/wiki/Q274404"
  },
  "04-11": {
    "year": 1920,
    "text": "Politikeren Emilio Colombo ble født.",
    "source": "https://www.wikidata.org/wiki/Q312058"
  },
  "04-12": {
    "year": 1948,
    "text": "Fotballtreneren Marcello Lippi ble født.",
    "source": "https://www.wikidata.org/wiki/Q43304"
  },
  "04-13": {
    "year": 1999,
    "text": "Fotballspilleren Alessandro Bastoni ble født.",
    "source": "https://www.wikidata.org/wiki/Q28561068"
  },
  "04-14": {
    "year": 1967,
    "text": "Fotballspilleren Nicola Berti ble født.",
    "source": "https://www.wikidata.org/wiki/Q461305"
  },
  "04-15": {
    "year": 1939,
    "text": "Historikeren Carlo Ginzburg ble født.",
    "source": "https://www.wikidata.org/wiki/Q355251"
  },
  "04-16": {
    "year": 1972,
    "text": "Fotballtreneren Paolo Negro ble født.",
    "source": "https://www.wikidata.org/wiki/Q561227"
  },
  "04-17": {
    "year": 1996,
    "text": "Fotballspilleren Gianluca Mancini ble født.",
    "source": "https://www.wikidata.org/wiki/Q28973528"
  },
  "04-18": {
    "year": 1902,
    "text": "Økonomen Giuseppe Pella ble født.",
    "source": "https://www.wikidata.org/wiki/Q320963"
  },
  "04-19": {
    "year": 1953,
    "text": "Sara Simeoni ble født.",
    "source": "https://www.wikidata.org/wiki/Q5442"
  },
  "04-20": {
    "year": 1949,
    "text": "Politikeren Massimo D'Alema ble født.",
    "source": "https://www.wikidata.org/wiki/Q47602"
  },
  "04-21": {
    "year": 1997,
    "text": "Fotballspilleren Matteo Pessina ble født.",
    "source": "https://www.wikidata.org/wiki/Q21622362"
  },
  "04-22": {
    "year": 1942,
    "text": "Filosofen Giorgio Agamben ble født.",
    "source": "https://www.wikidata.org/wiki/Q311687"
  },
  "04-23": {
    "year": 1990,
    "text": "Fotballspilleren Cristiana Girelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q10528954"
  },
  "04-24": {
    "year": 1966,
    "text": "Fotballtreneren Alessandro Costacurta ble født.",
    "source": "https://www.wikidata.org/wiki/Q213828"
  },
  "04-25": {
    "year": 1939,
    "text": "Fotballtreneren Tarcisio Burgnich ble født.",
    "source": "https://www.wikidata.org/wiki/Q503297"
  },
  "04-26": {
    "year": 1940,
    "text": "Komponisten Giorgio Moroder ble født.",
    "source": "https://www.wikidata.org/wiki/Q312674"
  },
  "04-27": {
    "year": 1920,
    "text": "Dirigenten Guido Cantelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q712014"
  },
  "04-28": {
    "year": 1916,
    "text": "Racerføreren Ferruccio Lamborghini ble født.",
    "source": "https://www.wikidata.org/wiki/Q311999"
  },
  "04-29": {
    "year": 1987,
    "text": "Tennisspilleren Sara Errani ble født.",
    "source": "https://www.wikidata.org/wiki/Q229005"
  },
  "04-30": {
    "year": 1978,
    "text": "Fotballtreneren Simone Barone ble født.",
    "source": "https://www.wikidata.org/wiki/Q299105"
  },
  "05-01": {
    "year": 1987,
    "text": "Fotballtreneren Leonardo Bonucci ble født.",
    "source": "https://www.wikidata.org/wiki/Q208050"
  },
  "05-02": {
    "year": 1955,
    "text": "Motedesigneren Donatella Versace ble født.",
    "source": "https://www.wikidata.org/wiki/Q229437"
  },
  "05-03": {
    "year": 1991,
    "text": "Carlo Acutis ble født.",
    "source": "https://www.wikidata.org/wiki/Q2939142"
  },
  "05-04": {
    "year": 1973,
    "text": "Fotballtreneren Giuseppe Zappella ble født.",
    "source": "https://www.wikidata.org/wiki/Q1092098"
  },
  "05-05": {
    "year": 1985,
    "text": "Fotballspilleren Emanuele Giaccherini ble født.",
    "source": "https://www.wikidata.org/wiki/Q195878"
  },
  "05-06": {
    "year": 1981,
    "text": "Fotballspilleren Guglielmo Stendardo ble født.",
    "source": "https://www.wikidata.org/wiki/Q366837"
  },
  "05-07": {
    "year": 1987,
    "text": "Motedesigneren Chiara Ferragni ble født.",
    "source": "https://www.wikidata.org/wiki/Q8933801"
  },
  "05-08": {
    "year": 1906,
    "text": "Filmregissøren Roberto Rossellini ble født.",
    "source": "https://www.wikidata.org/wiki/Q53003"
  },
  "05-09": {
    "year": 1957,
    "text": "Fotballspilleren Fulvio Collovati ble født.",
    "source": "https://www.wikidata.org/wiki/Q366073"
  },
  "05-10": {
    "year": 1931,
    "text": "Filmregissøren Ettore Scola ble født.",
    "source": "https://www.wikidata.org/wiki/Q53037"
  },
  "05-11": {
    "year": 1932,
    "text": "Motedesigneren Valentino ble født.",
    "source": "https://www.wikidata.org/wiki/Q379664"
  },
  "05-12": {
    "year": 1910,
    "text": "Operasangeren Giulietta Simionato ble født.",
    "source": "https://www.wikidata.org/wiki/Q233322"
  },
  "05-13": {
    "year": 1938,
    "text": "Politikeren Giuliano Amato ble født.",
    "source": "https://www.wikidata.org/wiki/Q202209"
  },
  "05-14": {
    "year": 1986,
    "text": "Fotballspilleren Marco Motta ble født.",
    "source": "https://www.wikidata.org/wiki/Q337646"
  },
  "05-15": {
    "year": 1953,
    "text": "Fotballtreneren Franco Selvaggi ble født.",
    "source": "https://www.wikidata.org/wiki/Q533052"
  },
  "05-16": {
    "year": 1974,
    "text": "Sangeren Laura Pausini ble født.",
    "source": "https://www.wikidata.org/wiki/Q170697"
  },
  "05-17": {
    "year": 1974,
    "text": "Politikeren Damiano Tommasi ble født.",
    "source": "https://www.wikidata.org/wiki/Q350271"
  },
  "05-18": {
    "year": 1939,
    "text": "Giovanni Falcone ble født.",
    "source": "https://www.wikidata.org/wiki/Q207073"
  },
  "05-19": {
    "year": 1979,
    "text": "Fotballtreneren Andrea Pirlo ble født.",
    "source": "https://www.wikidata.org/wiki/Q43926"
  },
  "05-20": {
    "year": 1912,
    "text": "Fotballtreneren Nereo Rocco ble født.",
    "source": "https://www.wikidata.org/wiki/Q354475"
  },
  "05-21": {
    "year": 1997,
    "text": "Fotballspilleren Federico Bonazzoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q16382834"
  },
  "05-22": {
    "year": 1932,
    "text": "Forfatteren Tavo Burat ble født.",
    "source": "https://www.wikidata.org/wiki/Q3915746"
  },
  "05-23": {
    "year": 1961,
    "text": "Fotballspilleren Daniele Massaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q352826"
  },
  "05-24": {
    "year": 1987,
    "text": "Tennisspilleren Fabio Fognini ble født.",
    "source": "https://www.wikidata.org/wiki/Q251980"
  },
  "05-25": {
    "year": 1953,
    "text": "Fotballtreneren Gaetano Scirea ble født.",
    "source": "https://www.wikidata.org/wiki/Q299608"
  },
  "05-26": {
    "year": 1977,
    "text": "Fotballspilleren Luca Toni ble født.",
    "source": "https://www.wikidata.org/wiki/Q186478"
  },
  "05-27": {
    "year": 1956,
    "text": "Filmregissøren Giuseppe Tornatore ble født.",
    "source": "https://www.wikidata.org/wiki/Q53045"
  },
  "05-28": {
    "year": 1934,
    "text": "Biskopen Francesco Monterisi ble født.",
    "source": "https://www.wikidata.org/wiki/Q721621"
  },
  "05-29": {
    "year": 1977,
    "text": "Fotballspilleren Massimo Ambrosini ble født.",
    "source": "https://www.wikidata.org/wiki/Q188564"
  },
  "05-30": {
    "year": 1956,
    "text": "Politikeren David Sassoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q2391857"
  },
  "05-31": {
    "year": 1970,
    "text": "Filmregissøren Paolo Sorrentino ble født.",
    "source": "https://www.wikidata.org/wiki/Q374678"
  },
  "06-01": {
    "year": 1992,
    "text": "Gianmarco Tamberi ble født.",
    "source": "https://www.wikidata.org/wiki/Q2012594"
  },
  "06-02": {
    "year": 1946,
    "text": "Italienerne begynte å stemme om monarki eller republikk. Folkeavstemningen 2.–3. juni endte med flertall for republikk.",
    "source": "https://en.wikipedia.org/wiki/1946_Italian_institutional_referendum"
  },
  "06-03": {
    "year": 1971,
    "text": "Fotballtreneren Luigi Di Biagio ble født.",
    "source": "https://www.wikidata.org/wiki/Q314053"
  },
  "06-04": {
    "year": 1991,
    "text": "Fotballspilleren Lorenzo Insigne ble født.",
    "source": "https://www.wikidata.org/wiki/Q1756086"
  },
  "06-05": {
    "year": 1901,
    "text": "Carlo Biotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q17279884"
  },
  "06-06": {
    "year": 1979,
    "text": "Fotballtreneren Roberto De Zerbi ble født.",
    "source": "https://www.wikidata.org/wiki/Q2032119"
  },
  "06-07": {
    "year": 1974,
    "text": "Biskopen Giorgio Marengo ble født.",
    "source": "https://www.wikidata.org/wiki/Q89274820"
  },
  "06-08": {
    "year": 1938,
    "text": "Biskopen Angelo Amato ble født.",
    "source": "https://www.wikidata.org/wiki/Q535546"
  },
  "06-09": {
    "year": 1903,
    "text": "Racerføreren Felice Bonetto ble født.",
    "source": "https://www.wikidata.org/wiki/Q171897"
  },
  "06-10": {
    "year": 1959,
    "text": "Filmskuespilleren Carlo Ancelotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q174614"
  },
  "06-11": {
    "year": 1992,
    "text": "Fotballspilleren Davide Zappacosta ble født.",
    "source": "https://www.wikidata.org/wiki/Q5241591"
  },
  "06-12": {
    "year": 1922,
    "text": "Astronomen Margherita Hack ble født.",
    "source": "https://www.wikidata.org/wiki/Q14282"
  },
  "06-13": {
    "year": 1928,
    "text": "Biskopen Giacomo Biffi ble født.",
    "source": "https://www.wikidata.org/wiki/Q81156"
  },
  "06-14": {
    "year": 1976,
    "text": "Fotballtreneren Massimo Oddo ble født.",
    "source": "https://www.wikidata.org/wiki/Q125438"
  },
  "06-15": {
    "year": 1920,
    "text": "Komponisten Alberto Sordi ble født.",
    "source": "https://www.wikidata.org/wiki/Q50003"
  },
  "06-16": {
    "year": 1973,
    "text": "Politikeren Federica Mogherini ble født.",
    "source": "https://www.wikidata.org/wiki/Q3741557"
  },
  "06-17": {
    "year": 1927,
    "text": "Filmregissøren Lucio Fulci ble født.",
    "source": "https://www.wikidata.org/wiki/Q345217"
  },
  "06-18": {
    "year": 1946,
    "text": "Fotballtreneren Fabio Capello ble født.",
    "source": "https://www.wikidata.org/wiki/Q183108"
  },
  "06-19": {
    "year": 1996,
    "text": "Fotballspilleren Lorenzo Pellegrini ble født.",
    "source": "https://www.wikidata.org/wiki/Q19773058"
  },
  "06-20": {
    "year": 1967,
    "text": "Skuespilleren Angela Melillo ble født.",
    "source": "https://www.wikidata.org/wiki/Q3616767"
  },
  "06-21": {
    "year": 1925,
    "text": "Historikeren Giovanni Spadolini ble født.",
    "source": "https://www.wikidata.org/wiki/Q332709"
  },
  "06-22": {
    "year": 1930,
    "text": "Forfatteren Walter Bonatti ble født.",
    "source": "https://www.wikidata.org/wiki/Q53729"
  },
  "06-23": {
    "year": 1980,
    "text": "Tennisspilleren Francesca Schiavone ble født.",
    "source": "https://www.wikidata.org/wiki/Q188107"
  },
  "06-24": {
    "year": 1940,
    "text": "Fotografen Vittorio Storaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q363413"
  },
  "06-25": {
    "year": 1991,
    "text": "Fotballspilleren Simone Zaza ble født.",
    "source": "https://www.wikidata.org/wiki/Q3961288"
  },
  "06-26": {
    "year": 1968,
    "text": "Tennisspilleren Paolo Maldini ble født.",
    "source": "https://www.wikidata.org/wiki/Q483027"
  },
  "06-27": {
    "year": 1979,
    "text": "Fotballspilleren Fabrizio Miccoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q136959"
  },
  "06-28": {
    "year": 1964,
    "text": "Skuespilleren Sabrina Ferilli ble født.",
    "source": "https://www.wikidata.org/wiki/Q272409"
  },
  "06-29": {
    "year": 1925,
    "text": "Politikeren Giorgio Napolitano ble født.",
    "source": "https://www.wikidata.org/wiki/Q1220"
  },
  "06-30": {
    "year": 1933,
    "text": "Filmskuespilleren Lea Massari ble født.",
    "source": "https://www.wikidata.org/wiki/Q289020"
  },
  "07-01": {
    "year": 1955,
    "text": "Fotografen Augusto De Luca ble født.",
    "source": "https://www.wikidata.org/wiki/Q29419"
  },
  "07-02": {
    "year": 1999,
    "text": "Fotballspilleren Nicolò Zaniolo ble født.",
    "source": "https://www.wikidata.org/wiki/Q28974273"
  },
  "07-03": {
    "year": 1955,
    "text": "Filmregissøren Walter Veltroni ble født.",
    "source": "https://www.wikidata.org/wiki/Q319547"
  },
  "07-04": {
    "year": 1927,
    "text": "Filmregissøren Gina Lollobrigida ble født.",
    "source": "https://www.wikidata.org/wiki/Q56009"
  },
  "07-05": {
    "year": 1982,
    "text": "Fotballtreneren Alberto Gilardino ble født.",
    "source": "https://www.wikidata.org/wiki/Q182451"
  },
  "07-06": {
    "year": 1986,
    "text": "Politikeren Luigi Di Maio ble født.",
    "source": "https://www.wikidata.org/wiki/Q13581225"
  },
  "07-07": {
    "year": 1943,
    "text": "Komponisten Toto Cutugno ble født.",
    "source": "https://www.wikidata.org/wiki/Q487473"
  },
  "07-08": {
    "year": 1977,
    "text": "Fotballspilleren Christian Abbiati ble født.",
    "source": "https://www.wikidata.org/wiki/Q62166"
  },
  "07-09": {
    "year": 1964,
    "text": "Fotballtreneren Gianluca Vialli ble født.",
    "source": "https://www.wikidata.org/wiki/Q239688"
  },
  "07-10": {
    "year": 1976,
    "text": "Pino Maddaloni ble født.",
    "source": "https://www.wikidata.org/wiki/Q2738533"
  },
  "07-11": {
    "year": 1934,
    "text": "Motedesigneren Giorgio Armani ble født.",
    "source": "https://www.wikidata.org/wiki/Q157054"
  },
  "07-12": {
    "year": 1982,
    "text": "Fotballspilleren Antonio Cassano ble født.",
    "source": "https://www.wikidata.org/wiki/Q180993"
  },
  "07-13": {
    "year": 1918,
    "text": "Motorsykkelføreren Alberto Ascari ble født.",
    "source": "https://www.wikidata.org/wiki/Q2086"
  },
  "07-14": {
    "year": 1916,
    "text": "Forfatteren Natalia Ginzburg ble født.",
    "source": "https://www.wikidata.org/wiki/Q275985"
  },
  "07-15": {
    "year": 1985,
    "text": "Fotballspilleren Graziano Pellè ble født.",
    "source": "https://www.wikidata.org/wiki/Q218680"
  },
  "07-16": {
    "year": 1939,
    "text": "Fotballtreneren Lido Vieri ble født.",
    "source": "https://www.wikidata.org/wiki/Q717675"
  },
  "07-17": {
    "year": 1939,
    "text": "Operasangeren Milva ble født.",
    "source": "https://www.wikidata.org/wiki/Q241835"
  },
  "07-18": {
    "year": 1978,
    "text": "Politikeren Virginia Raggi ble født.",
    "source": "https://www.wikidata.org/wiki/Q23766020"
  },
  "07-19": {
    "year": 1975,
    "text": "Fotballtreneren Luca Castellazzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q320513"
  },
  "07-20": {
    "year": 1955,
    "text": "Biskopen Egidio Miragoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q41320755"
  },
  "07-21": {
    "year": 1948,
    "text": "Forfatteren Beppe Grillo ble født.",
    "source": "https://www.wikidata.org/wiki/Q47683"
  },
  "07-22": {
    "year": 1934,
    "text": "Historikeren Raniero Cantalamessa ble født.",
    "source": "https://www.wikidata.org/wiki/Q1233583"
  },
  "07-23": {
    "year": 1941,
    "text": "Politikeren Sergio Mattarella ble født.",
    "source": "https://www.wikidata.org/wiki/Q3956186"
  },
  "07-24": {
    "year": 1983,
    "text": "Fotballtreneren Daniele De Rossi ble født.",
    "source": "https://www.wikidata.org/wiki/Q168497"
  },
  "07-25": {
    "year": 1996,
    "text": "Syklisten Filippo Ganna ble født.",
    "source": "https://www.wikidata.org/wiki/Q20971580"
  },
  "07-26": {
    "year": 1966,
    "text": "Sangeren Anna Rita Del Piano ble født.",
    "source": "https://www.wikidata.org/wiki/Q3617810"
  },
  "07-27": {
    "year": 1968,
    "text": "Filmregissøren Maria Grazia Cucinotta ble født.",
    "source": "https://www.wikidata.org/wiki/Q234775"
  },
  "07-28": {
    "year": 1924,
    "text": "Racerføreren Luigi Musso ble født.",
    "source": "https://www.wikidata.org/wiki/Q171484"
  },
  "07-29": {
    "year": 1994,
    "text": "Fotballspilleren Daniele Rugani ble født.",
    "source": "https://www.wikidata.org/wiki/Q15830919"
  },
  "07-30": {
    "year": 1943,
    "text": "Økonomen Giovanni Goria ble født.",
    "source": "https://www.wikidata.org/wiki/Q336259"
  },
  "07-31": {
    "year": 1969,
    "text": "Fotballtreneren Antonio Conte ble født.",
    "source": "https://www.wikidata.org/wiki/Q26580"
  },
  "08-01": {
    "year": 1964,
    "text": "Skuespilleren Kaspar Capparoni ble født.",
    "source": "https://www.wikidata.org/wiki/Q103744"
  },
  "08-02": {
    "year": 1984,
    "text": "Fotballspilleren Giampaolo Pazzini ble født.",
    "source": "https://www.wikidata.org/wiki/Q219389"
  },
  "08-03": {
    "year": 1993,
    "text": "Fotballspilleren Matteo Politano ble født.",
    "source": "https://www.wikidata.org/wiki/Q6789694"
  },
  "08-04": {
    "year": 1953,
    "text": "Politikeren Antonio Tajani ble født.",
    "source": "https://www.wikidata.org/wiki/Q440710"
  },
  "08-05": {
    "year": 1988,
    "text": "Svømmeren Federica Pellegrini ble født.",
    "source": "https://www.wikidata.org/wiki/Q234758"
  },
  "08-06": {
    "year": 1980,
    "text": "Racerføreren Vitantonio Liuzzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q171294"
  },
  "08-07": {
    "year": 1938,
    "text": "Giorgetto Giugiaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q316565"
  },
  "08-08": {
    "year": 1964,
    "text": "Politikeren Giuseppe Conte ble født.",
    "source": "https://www.wikidata.org/wiki/Q53844829"
  },
  "08-09": {
    "year": 1939,
    "text": "Økonomen Romano Prodi ble født.",
    "source": "https://www.wikidata.org/wiki/Q38484"
  },
  "08-10": {
    "year": 1971,
    "text": "Filmregissøren Luca Guadagnino ble født.",
    "source": "https://www.wikidata.org/wiki/Q1335528"
  },
  "08-11": {
    "year": 1967,
    "text": "Fotballtreneren Massimiliano Allegri ble født.",
    "source": "https://www.wikidata.org/wiki/Q354529"
  },
  "08-12": {
    "year": 1973,
    "text": "Fotballtreneren Mark Iuliano ble født.",
    "source": "https://www.wikidata.org/wiki/Q353046"
  },
  "08-13": {
    "year": 1958,
    "text": "Motedesigneren Domenico Dolce ble født.",
    "source": "https://www.wikidata.org/wiki/Q775324"
  },
  "08-14": {
    "year": 1984,
    "text": "Fotballtreneren Giorgio Chiellini ble født.",
    "source": "https://www.wikidata.org/wiki/Q80306"
  },
  "08-15": {
    "year": 1922,
    "text": "Historikeren Carlo M. Cipolla ble født.",
    "source": "https://www.wikidata.org/wiki/Q454036"
  },
  "08-16": {
    "year": 2001,
    "text": "Tennisspilleren Jannik Sinner ble født.",
    "source": "https://www.wikidata.org/wiki/Q54812588"
  },
  "08-17": {
    "year": 1975,
    "text": "Luigi Mastrangelo ble født.",
    "source": "https://www.wikidata.org/wiki/Q965931"
  },
  "08-18": {
    "year": 1943,
    "text": "Politikeren Gianni Rivera ble født.",
    "source": "https://www.wikidata.org/wiki/Q230046"
  },
  "08-19": {
    "year": 1973,
    "text": "Fotballtreneren Marco Materazzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q185081"
  },
  "08-20": {
    "year": 1901,
    "text": "Forfatteren Salvatore Quasimodo ble født.",
    "source": "https://www.wikidata.org/wiki/Q83038"
  },
  "08-21": {
    "year": 1968,
    "text": "Fotballspilleren Antonio Benarrivo ble født.",
    "source": "https://www.wikidata.org/wiki/Q530759"
  },
  "08-22": {
    "year": 1989,
    "text": "Fotballspilleren Giacomo Bonaventura ble født.",
    "source": "https://www.wikidata.org/wiki/Q726848"
  },
  "08-23": {
    "year": 1910,
    "text": "Fotballtreneren Giuseppe Meazza ble født.",
    "source": "https://www.wikidata.org/wiki/Q192131"
  },
  "08-24": {
    "year": 1973,
    "text": "Fotballtreneren Fabio Pecchia ble født.",
    "source": "https://www.wikidata.org/wiki/Q1087530"
  },
  "08-25": {
    "year": 1953,
    "text": "Biskopen Maurizio Malvestiti ble født.",
    "source": "https://www.wikidata.org/wiki/Q17617264"
  },
  "08-26": {
    "year": 1958,
    "text": "Forfatteren Nichi Vendola ble født.",
    "source": "https://www.wikidata.org/wiki/Q507595"
  },
  "08-27": {
    "year": 1974,
    "text": "Skuespilleren Dado Coletti ble født.",
    "source": "https://www.wikidata.org/wiki/Q19984665"
  },
  "08-28": {
    "year": 1909,
    "text": "Skuespilleren Lamberto Maggiorani ble født.",
    "source": "https://www.wikidata.org/wiki/Q635456"
  },
  "08-29": {
    "year": 1942,
    "text": "Presten Federico Lombardi ble født.",
    "source": "https://www.wikidata.org/wiki/Q725753"
  },
  "08-30": {
    "year": 1983,
    "text": "Fotballspilleren Simone Pepe ble født.",
    "source": "https://www.wikidata.org/wiki/Q203684"
  },
  "08-31": {
    "year": 1907,
    "text": "Forfatteren Altiero Spinelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q441294"
  },
  "09-01": {
    "year": 1922,
    "text": "Filmregissøren Vittorio Gassman ble født.",
    "source": "https://www.wikidata.org/wiki/Q55452"
  },
  "09-02": {
    "year": 1938,
    "text": "Skuespilleren Giuliano Gemma ble født.",
    "source": "https://www.wikidata.org/wiki/Q463944"
  },
  "09-03": {
    "year": 1947,
    "text": "Økonomen Mario Draghi ble født.",
    "source": "https://www.wikidata.org/wiki/Q294460"
  },
  "09-04": {
    "year": 1913,
    "text": "Filmregissøren Renato Castellani ble født.",
    "source": "https://www.wikidata.org/wiki/Q978075"
  },
  "09-05": {
    "year": 1980,
    "text": "Politikeren Marianna Madia ble født.",
    "source": "https://www.wikidata.org/wiki/Q3847714"
  },
  "09-06": {
    "year": 1925,
    "text": "Filmregissøren Andrea Camilleri ble født.",
    "source": "https://www.wikidata.org/wiki/Q334219"
  },
  "09-07": {
    "year": 1940,
    "text": "Komponisten Dario Argento ble født.",
    "source": "https://www.wikidata.org/wiki/Q53011"
  },
  "09-08": {
    "year": 1994,
    "text": "Fotballspilleren Marco Benassi ble født.",
    "source": "https://www.wikidata.org/wiki/Q129333"
  },
  "09-09": {
    "year": 1908,
    "text": "Forfatteren Cesare Pavese ble født. Han skrev dikt og romaner og oversatte amerikansk litteratur til italiensk.",
    "source": "https://www.britannica.com/biography/Cesare-Pavese"
  },
  "09-10": {
    "year": 1991,
    "text": "Fotballspilleren Nicola Sansone ble født.",
    "source": "https://www.wikidata.org/wiki/Q457302"
  },
  "09-11": {
    "year": 1970,
    "text": "Sangeren Fanny Cadeo ble født.",
    "source": "https://www.wikidata.org/wiki/Q3739265"
  },
  "09-12": {
    "year": 1992,
    "text": "Sangeren og låtskriveren Mahmood ble født.",
    "source": "https://www.wikidata.org/wiki/Q60036307"
  },
  "09-13": {
    "year": 1973,
    "text": "Fotballtreneren Fabio Cannavaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q102027"
  },
  "09-14": {
    "year": 1937,
    "text": "Arkitekten Renzo Piano ble født.",
    "source": "https://www.wikidata.org/wiki/Q190148"
  },
  "09-15": {
    "year": 1919,
    "text": "Syklisten Fausto Coppi ble født.",
    "source": "https://www.wikidata.org/wiki/Q219912"
  },
  "09-16": {
    "year": 1901,
    "text": "Ugo Frigerio ble født.",
    "source": "https://www.wikidata.org/wiki/Q360649"
  },
  "09-17": {
    "year": 1944,
    "text": "Filmregissøren Reinhold Messner ble født.",
    "source": "https://www.wikidata.org/wiki/Q189307"
  },
  "09-18": {
    "year": 1967,
    "text": "Fotballdommeren Roberto Rosetti ble født.",
    "source": "https://www.wikidata.org/wiki/Q296229"
  },
  "09-19": {
    "year": 1941,
    "text": "Politikeren Umberto Bossi ble født.",
    "source": "https://www.wikidata.org/wiki/Q47832"
  },
  "09-20": {
    "year": 1975,
    "text": "Filmregissøren Asia Argento ble født.",
    "source": "https://www.wikidata.org/wiki/Q232052"
  },
  "09-21": {
    "year": 1960,
    "text": "Fotografen Maurizio Cattelan ble født.",
    "source": "https://www.wikidata.org/wiki/Q655398"
  },
  "09-22": {
    "year": 1958,
    "text": "Komponisten Andrea Bocelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q42402"
  },
  "09-23": {
    "year": 1916,
    "text": "Politikeren Aldo Moro ble født.",
    "source": "https://www.wikidata.org/wiki/Q171834"
  },
  "09-24": {
    "year": 1954,
    "text": "Fotballtreneren Marco Tardelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q312626"
  },
  "09-25": {
    "year": 1955,
    "text": "Komponisten Zucchero ble født.",
    "source": "https://www.wikidata.org/wiki/Q125948"
  },
  "09-26": {
    "year": 1927,
    "text": "Fotballtreneren Enzo Bearzot ble født.",
    "source": "https://www.wikidata.org/wiki/Q313457"
  },
  "09-27": {
    "year": 1976,
    "text": "Fotballspilleren Francesco Totti ble født.",
    "source": "https://www.wikidata.org/wiki/Q20110"
  },
  "09-28": {
    "year": 1924,
    "text": "Skuespilleren Marcello Mastroianni ble født.",
    "source": "https://www.wikidata.org/wiki/Q55469"
  },
  "09-29": {
    "year": 1936,
    "text": "Politikeren Silvio Berlusconi ble født.",
    "source": "https://www.wikidata.org/wiki/Q11860"
  },
  "09-30": {
    "year": 1964,
    "text": "Skuespilleren Monica Bellucci ble født.",
    "source": "https://www.wikidata.org/wiki/Q81819"
  },
  "10-01": {
    "year": 1961,
    "text": "Fotballtreneren Walter Mazzarri ble født.",
    "source": "https://www.wikidata.org/wiki/Q370838"
  },
  "10-02": {
    "year": 1910,
    "text": "Fotballtreneren Aldo Olivieri ble født.",
    "source": "https://www.wikidata.org/wiki/Q967005"
  },
  "10-03": {
    "year": 1990,
    "text": "Sangeren Michele Morrone ble født.",
    "source": "https://www.wikidata.org/wiki/Q96106282"
  },
  "10-04": {
    "year": 1975,
    "text": "Fotballtreneren Cristiano Lucarelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q310034"
  },
  "10-05": {
    "year": 1971,
    "text": "Arkitekten Nicola Rizzoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q315234"
  },
  "10-06": {
    "year": 1935,
    "text": "Bruno Sammartino ble født.",
    "source": "https://www.wikidata.org/wiki/Q369270"
  },
  "10-07": {
    "year": 1994,
    "text": "Fabio Basile ble født.",
    "source": "https://www.wikidata.org/wiki/Q23901354"
  },
  "10-08": {
    "year": 1957,
    "text": "Fotballtreneren Antonio Cabrini ble født.",
    "source": "https://www.wikidata.org/wiki/Q68064"
  },
  "10-09": {
    "year": 1949,
    "text": "Skuespilleren Ottavia Piccolo ble født.",
    "source": "https://www.wikidata.org/wiki/Q271293"
  },
  "10-10": {
    "year": 1945,
    "text": "Fotballtreneren Edoardo Reja ble født.",
    "source": "https://www.wikidata.org/wiki/Q2327467"
  },
  "10-11": {
    "year": 1955,
    "text": "Biskopen Matteo Maria Zuppi ble født.",
    "source": "https://www.wikidata.org/wiki/Q600191"
  },
  "10-12": {
    "year": 1935,
    "text": "Operasangeren Luciano Pavarotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q37615"
  },
  "10-13": {
    "year": 1977,
    "text": "Fotballtreneren Antonio Di Natale ble født.",
    "source": "https://www.wikidata.org/wiki/Q167281"
  },
  "10-14": {
    "year": 1915,
    "text": "Biskopen Loris Francesco Capovilla ble født.",
    "source": "https://www.wikidata.org/wiki/Q697159"
  },
  "10-15": {
    "year": 1923,
    "text": "Romanforfatteren Italo Calvino ble født.",
    "source": "https://www.wikidata.org/wiki/Q154756"
  },
  "10-16": {
    "year": 1906,
    "text": "Romanforfatteren Dino Buzzati ble født.",
    "source": "https://www.wikidata.org/wiki/Q242095"
  },
  "10-17": {
    "year": 1976,
    "text": "Sangeren Fabri Fibra ble født.",
    "source": "https://www.wikidata.org/wiki/Q1390708"
  },
  "10-18": {
    "year": 1909,
    "text": "Filosofen Norberto Bobbio ble født.",
    "source": "https://www.wikidata.org/wiki/Q332693"
  },
  "10-19": {
    "year": 1956,
    "text": "Legen Carlo Urbani ble født.",
    "source": "https://www.wikidata.org/wiki/Q525262"
  },
  "10-20": {
    "year": 1951,
    "text": "Fotballtreneren Claudio Ranieri ble født.",
    "source": "https://www.wikidata.org/wiki/Q235068"
  },
  "10-21": {
    "year": 1953,
    "text": "Filmregissøren Eleonora Giorgi ble født.",
    "source": "https://www.wikidata.org/wiki/Q434423"
  },
  "10-22": {
    "year": 1966,
    "text": "Filmregissøren Valeria Golino ble født.",
    "source": "https://www.wikidata.org/wiki/Q230710"
  },
  "10-23": {
    "year": 1966,
    "text": "Racerføreren Alex Zanardi ble født.",
    "source": "https://www.wikidata.org/wiki/Q173188"
  },
  "10-24": {
    "year": 1925,
    "text": "Komponisten Luciano Berio ble født.",
    "source": "https://www.wikidata.org/wiki/Q221450"
  },
  "10-25": {
    "year": 1997,
    "text": "Fotballspilleren Federico Chiesa ble født.",
    "source": "https://www.wikidata.org/wiki/Q26704703"
  },
  "10-26": {
    "year": 1985,
    "text": "Andrea Bargnani ble født.",
    "source": "https://www.wikidata.org/wiki/Q316253"
  },
  "10-27": {
    "year": 1952,
    "text": "Komponisten Roberto Benigni ble født.",
    "source": "https://www.wikidata.org/wiki/Q23301"
  },
  "10-28": {
    "year": 1963,
    "text": "Komponisten Eros Ramazzotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q153708"
  },
  "10-29": {
    "year": 1960,
    "text": "Fysikeren Fabiola Gianotti ble født.",
    "source": "https://www.wikidata.org/wiki/Q983183"
  },
  "10-30": {
    "year": 1906,
    "text": "Racerføreren Giuseppe Farina ble født.",
    "source": "https://www.wikidata.org/wiki/Q2040"
  },
  "10-31": {
    "year": 1929,
    "text": "Komponisten Bud Spencer ble født.",
    "source": "https://www.wikidata.org/wiki/Q221074"
  },
  "11-01": {
    "year": 1905,
    "text": "Filmregissøren Aldo Fabrizi ble født.",
    "source": "https://www.wikidata.org/wiki/Q55450"
  },
  "11-02": {
    "year": 1906,
    "text": "Filmregissøren Luchino Visconti ble født.",
    "source": "https://www.wikidata.org/wiki/Q13888"
  },
  "11-03": {
    "year": 1931,
    "text": "Filmregissøren Monica Vitti ble født.",
    "source": "https://www.wikidata.org/wiki/Q106881"
  },
  "11-04": {
    "year": 1938,
    "text": "Salvatore Morale ble født.",
    "source": "https://www.wikidata.org/wiki/Q1343248"
  },
  "11-05": {
    "year": 1947,
    "text": "Politikeren Franco Trappoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q15720632"
  },
  "11-06": {
    "year": 1954,
    "text": "Dikteren Mango ble født.",
    "source": "https://www.wikidata.org/wiki/Q1054564"
  },
  "11-07": {
    "year": 1944,
    "text": "Fotballspilleren Luigi Riva ble født.",
    "source": "https://www.wikidata.org/wiki/Q276026"
  },
  "11-08": {
    "year": 1936,
    "text": "Skuespilleren Virna Lisi ble født.",
    "source": "https://www.wikidata.org/wiki/Q106627"
  },
  "11-09": {
    "year": 1974,
    "text": "Fotballspilleren Alessandro Del Piero ble født.",
    "source": "https://www.wikidata.org/wiki/Q624"
  },
  "11-10": {
    "year": 1928,
    "text": "Komponisten Ennio Morricone ble født.",
    "source": "https://www.wikidata.org/wiki/Q23848"
  },
  "11-11": {
    "year": 1966,
    "text": "Skuespilleren Benedicta Boccoli ble født.",
    "source": "https://www.wikidata.org/wiki/Q2448709"
  },
  "11-12": {
    "year": 1986,
    "text": "Fotballtreneren Ignazio Abate ble født.",
    "source": "https://www.wikidata.org/wiki/Q213007"
  },
  "11-13": {
    "year": 1936,
    "text": "Filmregissøren Dacia Maraini ble født.",
    "source": "https://www.wikidata.org/wiki/Q286600"
  },
  "11-14": {
    "year": 1984,
    "text": "Syklisten Vincenzo Nibali ble født.",
    "source": "https://www.wikidata.org/wiki/Q312322"
  },
  "11-15": {
    "year": 1922,
    "text": "Filmregissøren Francesco Rosi ble født.",
    "source": "https://www.wikidata.org/wiki/Q53050"
  },
  "11-16": {
    "year": 1964,
    "text": "Filosofen Luciano Floridi ble født.",
    "source": "https://www.wikidata.org/wiki/Q214119"
  },
  "11-17": {
    "year": 1906,
    "text": "Filmregissøren Mario Soldati ble født.",
    "source": "https://www.wikidata.org/wiki/Q59210"
  },
  "11-18": {
    "year": 1936,
    "text": "Biskopen Ennio Antonelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q82692"
  },
  "11-19": {
    "year": 1919,
    "text": "Komponisten Gillo Pontecorvo ble født.",
    "source": "https://www.wikidata.org/wiki/Q53031"
  },
  "11-20": {
    "year": 1959,
    "text": "Filmregissøren Mario Martone ble født.",
    "source": "https://www.wikidata.org/wiki/Q1008154"
  },
  "11-21": {
    "year": 1979,
    "text": "Fotballspilleren Vincenzo Iaquinta ble født.",
    "source": "https://www.wikidata.org/wiki/Q191869"
  },
  "11-22": {
    "year": 1954,
    "text": "Politikeren Paolo Gentiloni ble født.",
    "source": "https://www.wikidata.org/wiki/Q1071031"
  },
  "11-23": {
    "year": 1941,
    "text": "Filmregissøren Franco Nero ble født.",
    "source": "https://www.wikidata.org/wiki/Q311716"
  },
  "11-24": {
    "year": 1914,
    "text": "Biskopen Agostino Casaroli ble født.",
    "source": "https://www.wikidata.org/wiki/Q182086"
  },
  "11-25": {
    "year": 1901,
    "text": "Politikeren Fernando Tambroni ble født.",
    "source": "https://www.wikidata.org/wiki/Q314004"
  },
  "11-26": {
    "year": 1977,
    "text": "Syklisten Ivan Basso ble født.",
    "source": "https://www.wikidata.org/wiki/Q309938"
  },
  "11-27": {
    "year": 1964,
    "text": "Fotballtreneren Roberto Mancini ble født.",
    "source": "https://www.wikidata.org/wiki/Q48330"
  },
  "11-28": {
    "year": 1977,
    "text": "Fotballtreneren Fabio Grosso ble født.",
    "source": "https://www.wikidata.org/wiki/Q230529"
  },
  "11-29": {
    "year": 1902,
    "text": "Legen Carlo Levi ble født.",
    "source": "https://www.wikidata.org/wiki/Q312628"
  },
  "11-30": {
    "year": 1986,
    "text": "Fotballtreneren Salvatore Bocchetti ble født.",
    "source": "https://www.wikidata.org/wiki/Q314744"
  },
  "12-01": {
    "year": 1964,
    "text": "Fotballspilleren Salvatore Schillaci ble født.",
    "source": "https://www.wikidata.org/wiki/Q295307"
  },
  "12-02": {
    "year": 1946,
    "text": "Motedesigneren Gianni Versace ble født.",
    "source": "https://www.wikidata.org/wiki/Q264490"
  },
  "12-03": {
    "year": 1955,
    "text": "Politikeren Pier Ferdinando Casini ble født.",
    "source": "https://www.wikidata.org/wiki/Q552229"
  },
  "12-04": {
    "year": 1927,
    "text": "Arkitekten Gae Aulenti ble født.",
    "source": "https://www.wikidata.org/wiki/Q8867"
  },
  "12-05": {
    "year": 1979,
    "text": "Fotballspilleren Matteo Ferrari ble født.",
    "source": "https://www.wikidata.org/wiki/Q347603"
  },
  "12-06": {
    "year": 1981,
    "text": "Fotballspilleren Federico Balzaretti ble født.",
    "source": "https://www.wikidata.org/wiki/Q294293"
  },
  "12-07": {
    "year": 1909,
    "text": "Fotballtreneren Mario Pizziolo ble født.",
    "source": "https://www.wikidata.org/wiki/Q277395"
  },
  "12-08": {
    "year": 1925,
    "text": "Politikeren Arnaldo Forlani ble født.",
    "source": "https://www.wikidata.org/wiki/Q434786"
  },
  "12-09": {
    "year": 1920,
    "text": "Økonomen Carlo Azeglio Ciampi ble født.",
    "source": "https://www.wikidata.org/wiki/Q1224"
  },
  "12-10": {
    "year": 1991,
    "text": "Syklisten Elisa Longo Borghini ble født.",
    "source": "https://www.wikidata.org/wiki/Q462480"
  },
  "12-11": {
    "year": 1944,
    "text": "Sangeren Gianni Morandi ble født.",
    "source": "https://www.wikidata.org/wiki/Q319537"
  },
  "12-12": {
    "year": 1957,
    "text": "Filmregissøren Susanna Tamaro ble født.",
    "source": "https://www.wikidata.org/wiki/Q234621"
  },
  "12-13": {
    "year": 1946,
    "text": "Fotballspilleren Pierino Prati ble født.",
    "source": "https://www.wikidata.org/wiki/Q515815"
  },
  "12-14": {
    "year": 1993,
    "text": "Racerføreren Antonio Giovinazzi ble født.",
    "source": "https://www.wikidata.org/wiki/Q7084843"
  },
  "12-15": {
    "year": 1971,
    "text": "Skuespilleren Milena Miconi ble født.",
    "source": "https://www.wikidata.org/wiki/Q946765"
  },
  "12-16": {
    "year": 1952,
    "text": "Fotballtreneren Francesco Graziani ble født.",
    "source": "https://www.wikidata.org/wiki/Q355897"
  },
  "12-17": {
    "year": 1967,
    "text": "Komponisten Gigi D'Agostino ble født.",
    "source": "https://www.wikidata.org/wiki/Q311748"
  },
  "12-18": {
    "year": 1933,
    "text": "Historikeren Laura Mancinelli ble født.",
    "source": "https://www.wikidata.org/wiki/Q3827806"
  },
  "12-19": {
    "year": 1966,
    "text": "Skuespilleren Alberto Tomba ble født.",
    "source": "https://www.wikidata.org/wiki/Q1950"
  },
  "12-20": {
    "year": 1947,
    "text": "Sangeren Gigliola Cinquetti ble født.",
    "source": "https://www.wikidata.org/wiki/Q229295"
  },
  "12-21": {
    "year": 1981,
    "text": "Fotballspilleren Cristian Zaccardo ble født.",
    "source": "https://www.wikidata.org/wiki/Q154478"
  },
  "12-22": {
    "year": 1963,
    "text": "Fotballtreneren Giuseppe Bergomi ble født.",
    "source": "https://www.wikidata.org/wiki/Q235159"
  },
  "12-23": {
    "year": 1916,
    "text": "Filmregissøren Dino Risi ble født.",
    "source": "https://www.wikidata.org/wiki/Q53034"
  },
  "12-24": {
    "year": 1948,
    "text": "Filmskuespilleren Edwige Fenech ble født.",
    "source": "https://www.wikidata.org/wiki/Q266229"
  },
  "12-25": {
    "year": 1988,
    "text": "Sangeren og låtskriveren Marco Mengoni ble født.",
    "source": "https://www.wikidata.org/wiki/Q737866"
  },
  "12-26": {
    "year": 1942,
    "text": "Fotballspilleren Antonio Juliano ble født.",
    "source": "https://www.wikidata.org/wiki/Q602665"
  },
  "12-27": {
    "year": 1950,
    "text": "Fotballspilleren Roberto Bettega ble født.",
    "source": "https://www.wikidata.org/wiki/Q67990"
  },
  "12-28": {
    "year": 1905,
    "text": "Fotballtreneren Fulvio Bernardini ble født.",
    "source": "https://www.wikidata.org/wiki/Q963445"
  },
  "12-29": {
    "year": 1970,
    "text": "Fotballtreneren Enrico Chiesa ble født.",
    "source": "https://www.wikidata.org/wiki/Q345026"
  },
  "12-30": {
    "year": 1986,
    "text": "Fotballtreneren Domenico Criscito ble født.",
    "source": "https://www.wikidata.org/wiki/Q215527"
  },
  "12-31": {
    "year": 1929,
    "text": "Sosiologen Francesco Alberoni ble født.",
    "source": "https://www.wikidata.org/wiki/Q1386131"
  }
};
