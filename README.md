# [WEB2] Treća laboratorijska vježba
## 2D računalna igra kao HTML5 web stranica

Inspirirano arkadnom igrom [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)).

ZAHTJEVI
- igra mora započeti učitavanjem web stranice
- prikazati igru unutar Canvas objekta, koji:
  - mora pokrivati cijeli prozor web preglednika
  - mora imati pozadinu crne boje
    - opcionalno: animirana pozadina sa zvijezdama koje se kreću vertikalno konstantnom brzinom
  - mora imati vidljiv rub
- objekt koji predstavlja igrača mora:
  - biti pravokutnik
  - biti crvene boje
  - imati 3D sjenu oko ruba
  - nalaziti se točno u sredini Canvasa na početku igre
- igrač mora moći upravljati svojim položajem koristeći tipkovnicu (tipke strelice)
  - opcionalno: ako izađe izvan rubova ekrana može se vratiti sa suprotne strane
- objekti koji predstavljaju asteroide moraju:
  - biti pravokutnici
  - biti različitih nijansi sive boje
  - imati 3D sjenu oko ruba
- inicijalni broj asteroida i učestalost njihovog generiranja moraju biti predefinirani u kodu
- svi generirani asteroidi inicijalno se moraju nalaziti izvan ekrana
- položaj, smjer i brzina gibanja asteroida moraju biti slučajno generirani
  - opcionalno: generirati sve više asteroida što igra duže traje
- u svakom se trenutku mora detektirati kolizija asteroida s igračem
  - opcionalno: generirati zvuk prilikom kolizije
- igra mora mjeriti vrijeme od pokretanja igrice do kolizije asteroida s igračem
- igra mora čuvati informaciju o najboljem (najdužem) vremenu od kad je prvi put pokrenuta
  - informaciju pohraniti u local storage pomoću HTML5 Web Storage API
- prikaz najboljeg vremena i trenutnog vremena mora biti u gornjem desnom kutu Canvasa
  - format prikaza mora biti u formatu minute:sekunde.milisekunde
  - vrsta i veličina fonta su proizvoljni

Zvučna datoteka preuzeta s [freesound.org](https://freesound.org/people/MATRIXXX_/sounds/458906/).