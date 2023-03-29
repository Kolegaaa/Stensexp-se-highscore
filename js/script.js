const datorValet = document.getElementById('DatorVal');
const dittVal = document.getElementById('DittVal');
const resultatVal = document.getElementById('Resultatet');
const btnVal = document.querySelectorAll('#valknapp');
const h3 = document.querySelector('#Poäng');
const h4 = document.querySelector('#DatorPoäng');
const h1 = document.createElement('h1');
const button = document.getElementById('guess-btn');
const textinput = document.getElementById('text-input');
const container = document.querySelector('.container');
const highscoreDOM = document.querySelectorAll('.highScore');
let minaVal; // Jag vet jag har namngett dåligt men allt som slutar på siffran 1 är en let variabel som ändrar värde   const dittval / let DittVal 1
let datorValet1; //   samma sak här const datorValet / let Dittval 1
let resultat;
let playerscore = 0;
let datorscore = 0;
let namn = '';
let symbol = ['', 'Sten', 'Sax', 'Påse'];
let lowestScore = '';
let lowestScoreValue = 0;
let restart = true;
let amountOfPlayersInList = 0;
let alreadyInHighScore = false;
console.log(symbol[1]);
const baseUrl = `https://highscore-ef67b-default-rtdb.europe-west1.firebasedatabase.app/`;

let highObject = {};

//Hämta listan från databasen och sedan sorterar vi dom i arrays från högsta till lägsta
async function readHighscore() {
    try {
        const url = baseUrl + '.json';
        const response = await fetch(baseUrl + '.json');
        const data = await response.json();
        console.log(data.Highscore);
        const { Highscore } = data;

        console.log(Highscore);
        //const sortedObjects= Object.entries(Highscore).sort(function([ ,a],[,b ]){return b - a })
        const sortedObjects = Object.entries(Highscore).sort(function (a, b) {
            return b[1] - a[1];
        });

        console.log(sortedObjects);

        for (let i = 0; i < sortedObjects.length; i++) {
            highscoreDOM[i].innerHTML = sortedObjects[i][0] + ' ' + sortedObjects[i][1];
            if (namn == sortedObjects[i][0]) {
                console.log(namn, sortedObjects[i][0]);
                alreadyInHighScore = true;
            }
            //highscoreDOM[i].innerText= objectArray[i].join(" ")
        }
        lowestScore = sortedObjects[sortedObjects.length - 1][0];
        lowestScoreValue = sortedObjects[sortedObjects.length - 1][1];
        amountOfPlayersInList = sortedObjects.length;
    } catch {
        let header = document.createElement('h1');
        header.innerText = `Something is wrong`;
        document.body.appendChild(header);
        console.log('Something is wrong');
    }
}
readHighscore();

// Deletar den som har lägst score i databasen
async function deleteLowest() {
    // ifsatsen gör att om det är fem eller större då tar jag bort 1 så den kan bli till 4 så deleten den inte
    console.log(alreadyInHighScore, 'finns redan i listan');
    if (amountOfPlayersInList >= 5 && alreadyInHighScore == false) {
        const url = baseUrl + `Highscore/${lowestScore}.json`;
        const respons = await fetch(url, { method: 'DELETE' });
        const data = await respons.json();
        console.log(data);
    }
}

// Patchar den nya namnet och lägger in den i databasen ifall den har högre än highscore
async function patch(a) {
    const putObj = {};
    putObj[namn] = playerscore;

    const init = {
        method: 'PATCH',
        body: JSON.stringify(putObj),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    };

    const respons = await fetch(baseUrl + `Highscore/.json`, init);
    const data = await respons.json();
    console.log(data);
}

button.addEventListener('click', function (event) {
    // Nör jag skriver in ett namn i inputer så blir det display = 'block' o startar spelet och det är en form
    if (textinput.value === '') {
        // så preventDefault ska anges för att få funktionen att fungera
        return;
    }
    event.preventDefault();
    namn = textinput.value;
    container.style.display = 'block';
    h3.innerText = namn;
    readHighscore();
});
//console.log(btnVal);
btnVal.forEach(
    (
        btnVal, // Använde mig utav foreach men såklart med förståelse att den tar varje item för sig precis som en forloop , fick lite hjälp på nätet
    ) =>
        btnVal.addEventListener('click', (event) => {
            /// Varje gång jag klickar så vill jag att något ska hända
            //  minaVal = event.target.textContent; // Min let variabel ska "targeta"/ fånga upp textcontent på de jag klickar

            if (restart) {
                h3.innerHTML = 0;
                h4.innerHTML = 0;
                restart = false;
            }
            minaVal = event.target.value; // Min let variabel ska "targeta"/ fånga upp textcontent på de jag klickar
            dittVal.innerHTML = symbol[minaVal];
            const input = document.querySelector('#text-input');
            const guess = input.value;
            input.value = '';
            h1.innerText = ``;

            computer();
            slutresultat();
        }),
);

console.log(computer);
function computer() {
    // Min function computer ger varje Nummer en String så exempelvis
    const randomNummer = Math.floor(Math.random() * 3) + 1; // landar numret på 1 i consolen kommer det loggas som "Sten"
    console.log(randomNummer);

    datorValet1 = randomNummer;

    datorValet.innerHTML = symbol[datorValet1];
}

//console.log(endGame)
function slutresultat(event) {
    // Min function slutresultat är bara if-satser på olika statement på olkia utfall av matchen
    if (endGame()) {
        //  Vi ger ett Exempel : vi säger att mittval är påse och datorn randomar sten, så kommer resultatet att logga "Du vann"
        h1.style.visibility = 'hidden'; // och min let variabel = playerscore  kommer ju öka med 1 playerscore++
    }

    console.log(symbol[minaVal], symbol[datorValet1]);

    if (minaVal == 1 && datorValet1 == 3) {
        resultat = ' Datorn vann';
        h4.innerText = ++datorscore;
    } else if (minaVal < datorValet1) {
        resultat = ' Du vann';
        h3.innerHTML = ++playerscore;
    } else if (minaVal == datorValet1) resultat = ' Det blev lika';
    else {
        resultat = 'Du Förlora';
        h4.innerText = ++datorscore;
    }

    console.log(resultat);

    if (endGame()) {
        document.body.append(h1);
        playerscore = 0;
        datorscore = 0;
        restart = true;
        const spelaOm = document.querySelector('#spelaOm');
        spelaOm.style.display = 'block';
        spelaOm.addEventListener('click', () => {
            window.location.reload();
        });
    }
    resultatVal.innerHTML = resultat;
    
}

//Om spelarens nya poäng platsar på listan ska den nya poängen läggas till på rätt plats i databasen med spelarens namn. (Använd namnet som användaren angett i början av spelet.)Highscore-listan på webbsidan uppdateras

function checkIfhighscore() {
    if (playerscore > lowestScoreValue) {
        h1.innerHTML = `Grattis ${namn}!!!! , Du tillhör nu bland dom bästa i HighScore `;
        h1.style.color = 'green';
        deleteLowest();
        patch();
        readHighscore();
    } else {
        h1.style.color = 'red';
        h1.innerHTML = `Tyvärr ${namn} du förlora !!! Försök igen`;
    }

    console.log(playerscore);

    setTimeout(() => {
        let response = alert('Bra spelat,tryck ok för att börja om.');
        if (!response) window.location.reload();
    }, 500);
}

//När ‘datorn’ har vunnit ska spelarens nya poäng jämföras med highscore-listan.
function endGame() {
    if (datorscore >= 1) {
        checkIfhighscore();
        return true;
    }
    return false;
}
