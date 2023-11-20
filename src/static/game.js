const starCount = 1000; // broj zvijezda

const initialAsteroidCount = 10; // broj inicijalno stvorenih asteroida
const generationInterval = 30000; // vremenski razmak nakon kojeg se generiraju novi asteroidi

// širina asteroida je u intervalu [10, 60>
const minAsteroidSize = 10;
const maxAsteroidSize = 60;

// polje unutar kojeg se generiraju asteroidi
// [-0.5 * canvas.width, 1.5 * canvas.width> x [-0.5 * canvas.height, 1.5 * canvas.height>
const fieldScale = {
    x: -0.5,
    y: -0.5,
    width: 2,
    height: 2
};

let [
    lastGenerationTime, // posljednji trenutak generiranja asteroida
    startTime, // trenutak pojave prvog asteroida u canvasu (početak igre)
    bestTime, // najbolje zabilježeno vrijeme
    keys // indikatori aktivacije strelica
] = [undefined, undefined, undefined, undefined, undefined];

setInitialState(); // inicijalno postavljanje početnog stanja

let stars = []; // lista kreiranih zvijezda
let asteroids = []; // lista kreiranih asteroida

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

setCanvasDimensions(); // incijalno postavljanje dimenzija canvasa

// okidači koji postavljaju vrijednost true pritisnutoj strelici, tj. vrijednost false otpuštenoj strelici
window.addEventListener('keydown', event => keys[event.key] = true);
window.addEventListener('keyup', event => keys[event.key] = false);

// okidač koji prilikom promjene veličine prozora, nanovo postavlja dimenzije i crta canvas
window.addEventListener('resize', () => {
    setCanvasDimensions()
    stars = createStars(starCount); // ponovno kreiranje zvijezda kako bi se prikazivale preko cijelog prozora
    if (startTime === 0) {
        spaceship.respawn(); // postavljanje igrača u novi centar prozora, ako igra još nije počela
    }
    spaceship.draw();
    draw();
});

// igrač - pravokutnik (kvadrat) dimenzija 40x40; inicijalno se nalazi u središtu canvasa
const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    // funkcija koja igrača vraća u središte canvasa
    respawn: function () {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    },
    // funkcija koja crta igrača na canvas
    draw: function () {
        context.shadowColor = 'gray';
        context.shadowBlur = 20;
        context.fillStyle = 'red';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    },
    // funkcija koja pomiče igrača ovisno o pritisnutim strelicama
    move: function () {
        if (keys['ArrowUp']) {
            this.y -= 5;
        }
        if (keys['ArrowDown']) {
            this.y += 5;
        }
        if (keys['ArrowLeft']) {
            this.x -= 5;
        }
        if (keys['ArrowRight']) {
            this.x += 5;
        }
        // ako igrač izađe iz prostora canvasa, pojavljuje se na suprotnoj strani
        if (this.x > canvas.width) {
            this.x = 0;
        }  else if (this.x < 0) {
            this.x = canvas.width;
        }

        if (this.y > canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height;
        }
    },
    // funkcija koja provjerava je li se igrač sudario s ikojim asteroidom
    checkForCollision: function () {
        if (startTime > 0) {
            for (const asteroid of asteroids) {
                if (objectsOverlap(this, asteroid)) {
                    // ako je trenutno trajanje igre duže od najboljeg vremena,
                    // ažurira se najbolje vrijeme
                    const currentTime = Date.now() - startTime;
                    if (currentTime > bestTime) {
                        localStorage.setItem('bestTime', String(currentTime));
                    }
                    // reproduciranje zvuka kolizije i ponovno pokretanje igre
                    document.getElementById('collisionSound').play();
                    return true;
                }
            }
        }
        return false;
    }
};

// inicijalno pokretanje igre
start();



// funkcija koja varijablama vraća inicijalno stanje
function setInitialState() {
    startTime = 0; // čekanje na ulazak prvog asteroida u canvas
    bestTime = Number(localStorage.getItem('bestTime')) || 0; // pohranjeno najbolje vrijeme ili 0
    lastGenerationTime = 0; // čekanje na prvu iteraciju generiranja asteroida
    keys = {}; // brisanje informacija o aktivnosti strelica
}

// funkcija koja postavlja dimenzije canvasa
function setCanvasDimensions() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// funkcija koja ispituje nalazi li se value u intervalu [lowerBound, upperBound]
function valueInRange(value, lowerBound, upperBound) {
    return lowerBound <= value && value <= upperBound;
}

// funkcija koja ispituje dodiruju/preklapaju li se dva objekta
function objectsOverlap(object1, object2) {
    // za x-os mora vrijediti x2 <= x1 <= x2 + w2 ili x1 <= x2 <= x1 + w1
    const xOverlap = valueInRange(object1.x, object2.x, object2.x + object2.width)
        || valueInRange(object2.x, object1.x, object1.x + object1.width);

    // za y-os mora vrijediti y2 <= y1 <= y2 + h2 ili y1 <= y2 <= y1 + h1
    const yOverlap = valueInRange(object1.y, object2.y, object2.y + object2.height)
        || valueInRange(object2.y, object1.y, object1.y + object1.height);

    // objekti se dodiruju/preklapaju ako vrijede oba uvjeta
    return xOverlap && yOverlap;
}

// funkcija koja (ponovno) pokreće igru
function start() {
    setInitialState(); // (ponovno) postavljanje inicijalnog stanja varijabli

    document.getElementById('bestTime').innerText = formatTime(bestTime); // postavljanje najboljeg vremena
    document.getElementById('currentTime').parentElement.style.color = ''; // postavljanje boje trenutne duljine igre na naslijeđenu vrijednost

    stars = createStars(starCount); // (ponovno) kreiranje zvijezda

    asteroids = createAsteroids(initialAsteroidCount); // (ponovno) kreiranje inicijalnih asteroida
    lastGenerationTime = Date.now(); // bilježenje vremena zadnje iteracije generiranja asteroida

    spaceship.respawn(); // (ponovno) postavljanje igrača u središte canvasa
    // (ponovno) crtanje canvasa
    spaceship.draw();
    draw();
}

// funkcija koja vrijeme izraženo u milisekundama pretvara u format 00:00.000
function formatTime(time) {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor(time % 60000 / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');

    return `${minutes}:${seconds},${milliseconds}`;
}

// funkcija koja kreira i vraća listu n zvijezda
function createStars(n) {
    const stars = [];
    for (let i = 0; i < n; i++) {
        stars.push({
            // nasumična točka u prostoru canvasa
            // [0, canvas.width> x [0, canvas.height>
            ...getRandomCoordinates(0, 1, 0, 1),
            // polumjer kruga koji predstavlja zvijezdu
            // [0, 1>
            radius: Math.random(),
            // brzina vertikalnog gibanja zvijezde
            // [0, 1>
            velocity: Math.random()
        });
    }
    return stars;
}

// funkcija koja kreira i vraća listu n asteroida
function createAsteroids(n) {

    // funkcija koja generira i vraća nasumičnu nijansu sive boje
    // udio boja iz intervala [50, 150>
    const getRandomGrayShade = () => {
        const colorValue = 50 + 150 * Math.random();
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    };

    const asteroids = [];
    for (let i = 0; i < n; i++) {
        asteroids.push({
            ...createAsteroid(), // kreiranje asteroida,
            color: getRandomGrayShade() // generiranje boje asteroida
        });
    }
    return asteroids;
}

// funkcija koja kreira asteroid nasumičnih koordinata, dimenzija i vektora brzine
function createAsteroid() {
    const asteroid = {
        ...getRandomCoordinates(fieldScale.x, fieldScale.width, fieldScale.y, fieldScale.height),
        ...getRandomDimensions(),
        velocity_a: 0,
        velocity_b: 0
    };

    // generiraj koordinate asteroida tako dugo dok asteroid ne bude izvan canvasa
    while (asteroidInCanvas(asteroid)) {
        const { x, y } = getRandomCoordinates(fieldScale.x, fieldScale.width, fieldScale.y, fieldScale.height);
        asteroid.x = x;
        asteroid.y = y;
    }

    const velocity = getRandomVelocity(asteroid.x, asteroid.y);
    asteroid.velocity_a = velocity.a;
    asteroid.velocity_b = velocity.b;

    return asteroid;
}

// funkcija koja generira nasumične koordinate u prostoru
// [lowerXBound * canvas.width, (lowerXBound + xLength) * canvas.width> x [lowerYBound * canvas.height, (lowerYBound + yLength) * canvas.height>
function getRandomCoordinates(lowerXBound, xLength, lowerYBound, yLength) {
    return {
        x: (lowerXBound + xLength * Math.random()) * canvas.width,
        y: (lowerYBound + yLength * Math.random()) * canvas.height
    };
}

// funkcija koja generira nasumične dimenzije širine i visine
// širina: [10, 60>, visina: [0.7 * širina, širina>
function getRandomDimensions() {
    const w = minAsteroidSize + (maxAsteroidSize - minAsteroidSize) * Math.random();
    const h = (0.7 + 0.3 * Math.random()) * w;

    return  {
        width: w,
        height: h
    };
}

// funkcija koja provjerava je li asteroid ušao u prostor canvasa
function asteroidInCanvas(asteroid) {
    return objectsOverlap(asteroid, {x: 0, y: 0, width: canvas.width, height: canvas.height});
}

// funkcija koja generira nasumični vektor brzine
function getRandomVelocity(x, y) {
    const scale = 100 * (1 + 5 * Math.random()); // mjerilo: [100, 500>
    // generiranje nasumične točke unutar canvasa prema kojoj će vektor biti usmjeren
    const randomPoint = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    };

    return {
        a: (randomPoint.x - x) / scale,
        b: (randomPoint.y - y) / scale
    };
}

// funkcija koja (ponovno) crta canvas
function draw() {
    // crtanje pozadine
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(stars);

    // crtanje asteroida
    createAdditionalAsteroids();
    drawAsteroids(asteroids);

    spaceship.move(); // pomicanje igrača
    if (spaceship.checkForCollision()) {
        start(); // ponovno pokretanje igre ako se igrač sudario s bilo kojim asteroidom
    } else {
        spaceship.draw(); // crtanje igrača
        displayCurrentTime(); // osvježavanje prikaza trenutnog trajanja igre

        requestAnimationFrame(draw); // nastavljanje animacije
    }
}

// funkcija koja crta zvijezde
function drawStars(stars) {
    for (const star of stars) {
        star.y += star.velocity;

        if (star.y > canvas.height) {
            star.y = 0; // vraćanje zvijezde na vrh ako je izašla iz prostora canvasa
        }

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }
}

// funkcija koja periodično kreira nove asteroide
function createAdditionalAsteroids() {
    const currentTime = Date.now();
    if (currentTime - lastGenerationTime >= generationInterval) {
        const additionalAsteroidsCount = Math.floor((currentTime - lastGenerationTime) / generationInterval);
        asteroids.push(...createAsteroids(additionalAsteroidsCount));
        lastGenerationTime = currentTime;
    }
}

// funkcija koja crta asteroide
function drawAsteroids(asteroids) {
    for (const asteroid of asteroids) {
        asteroid.x += asteroid.velocity_a;
        asteroid.y += asteroid.velocity_b;

        if (!asteroidInField(asteroid)) {
            // postavljanje asteroida na nove koordinate s novim vektorom brzine ako je izašao iz polja
            const asteroidVector = createAsteroid();
            asteroid.x = asteroidVector.x;
            asteroid.y = asteroidVector.y;
            asteroid.velocity_a = asteroidVector.velocity_a;
            asteroid.velocity_b = asteroidVector.velocity_b;
        }

        if (startTime === 0 && asteroidInCanvas(asteroid)) {
            // pokretanje timera ako je riječ prvom asteroidu koji je ušao u područje canvasa
            startTime = Date.now();
            displayCurrentTime();
        }

        context.shadowColor = 'white';
        context.shadowBlur = asteroid.width / 2;
        context.fillStyle = asteroid.color;
        context.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    }
}

// funkcija koja provjerava nalazi li se asteroid u polju
function asteroidInField(asteroid) {
    const field = {
        x: fieldScale.x * canvas.width,
        y: fieldScale.y * canvas.height,
        width: fieldScale.width * canvas.width,
        height: fieldScale.height * canvas.height
    };
    return objectsOverlap(asteroid, field);
}

// funkcija koja osvježava prikaz trenutnog trajanja igre
function displayCurrentTime() {
    const currentTime = startTime === 0 ? startTime : Date.now() - startTime;
    document.getElementById('currentTime').innerText = formatTime(currentTime);

    if (currentTime > bestTime) {
        // isticanje trenutnog trajanja igre zelenom bojom ako je prestignuto najbolje zabilježeno vrijeme
        document.getElementById('currentTime').parentElement.style.color = 'green';
    }
}