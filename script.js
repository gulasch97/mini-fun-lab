// =========================
// HAUPTSEITE
// =========================

const home =
    document.getElementById("home");


// =========================
// ZUFALLSZAHL
// =========================

const randomGame =
    document.getElementById("randomGame");

const randomGameButton =
    document.getElementById("randomGameButton");

const backButton =
    document.getElementById("backButton");

const newNumberButton =
    document.getElementById("newNumberButton");

const number =
    document.getElementById("number");

const plays =
    document.getElementById("plays");

const highest =
    document.getElementById("highest");

let playCount = 0;

let highestNumber = 0;


randomGameButton.addEventListener(
    "click",
    function() {

        home.style.display = "none";

        randomGame.style.display = "block";

    }
);


backButton.addEventListener(
    "click",
    function() {

        randomGame.style.display = "none";

        home.style.display = "block";

    }
);


newNumberButton.addEventListener(
    "click",
    function() {

        newNumberButton.disabled = true;

        let counter = 0;

        const animation =
            setInterval(
                function() {

                    const randomNumber =
                        Math.floor(
                            Math.random() * 100
                        ) + 1;

                    number.textContent =
                        randomNumber;

                    counter++;


                    if (counter >= 15) {

                        clearInterval(animation);

                        const finalNumber =
                            Math.floor(
                                Math.random() * 100
                            ) + 1;

                        number.textContent =
                            finalNumber;

                        playCount++;

                        plays.textContent =
                            playCount;


                        if (
                            finalNumber >
                            highestNumber
                        ) {

                            highestNumber =
                                finalNumber;

                            highest.textContent =
                                highestNumber;
                        }


                        newNumberButton.disabled =
                            false;

                    }

                },
                80
            );

    }
);


// =========================
// FARB-SPIEL
// =========================

const colorGame =
    document.getElementById("colorGame");

const colorGameButton =
    document.getElementById("colorGameButton");

const colorBackButton =
    document.getElementById("colorBackButton");

const newColorButton =
    document.getElementById("newColorButton");

const colorPreview =
    document.getElementById("colorPreview");

const colorCode =
    document.getElementById("colorCode");

const colorCount =
    document.getElementById("colorCount");

let colorsDiscovered = 0;


colorGameButton.addEventListener(
    "click",
    function() {

        home.style.display = "none";

        colorGame.style.display = "block";

    }
);


colorBackButton.addEventListener(
    "click",
    function() {

        colorGame.style.display = "none";

        home.style.display = "block";

        document.body.style.background =
            "#f5f5f5";

    }
);


newColorButton.addEventListener(
    "click",
    function() {

        const letters =
            "0123456789ABCDEF";

        let color = "#";


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    letters.length
                );

            color +=
                letters[randomIndex];

        }


        colorPreview.style.background =
            color;

        colorCode.textContent =
            color;

        document.body.style.background =
            color;

        colorsDiscovered++;

        colorCount.textContent =
            colorsDiscovered;

    }
);


// =========================
// REAKTIONS-SPIEL
// =========================

const reactionGame =
    document.getElementById("reactionGame");

const reactionGameButton =
    document.getElementById("reactionGameButton");

const reactionBackButton =
    document.getElementById("reactionBackButton");

const reactionArea =
    document.getElementById("reactionArea");

const reactionText =
    document.getElementById("reactionText");

const reactionTime =
    document.getElementById("reactionTime");

const bestTime =
    document.getElementById("bestTime");


let reactionStartTime = 0;

let reactionTimer = null;

let reactionState = "start";

let bestReaction = null;


reactionGameButton.addEventListener(
    "click",
    function() {

        home.style.display = "none";

        reactionGame.style.display =
            "block";

        resetReactionGame();

    }
);


reactionBackButton.addEventListener(
    "click",
    function() {

        reactionGame.style.display =
            "none";

        home.style.display =
            "block";

        resetReactionGame();

    }
);


reactionArea.addEventListener(
    "click",
    function() {

        if (reactionState === "start") {

            startReactionGame();

            return;
        }


        if (reactionState === "waiting") {

            clearTimeout(reactionTimer);

            reactionState = "start";

            reactionArea.className =
                "reaction-area too-early";

            reactionArea.textContent =
                "❌ Zu früh! Nochmal";

            reactionText.textContent =
                "Warte, bis die Fläche grün wird.";

            return;
        }


        if (reactionState === "ready") {

            const endTime =
                performance.now();

            const time =
                Math.round(
                    endTime -
                    reactionStartTime
                );


            reactionTime.textContent =
                time + " ms";


            if (
                bestReaction === null ||
                time < bestReaction
            ) {

                bestReaction = time;

                bestTime.textContent =
                    time + " ms";

            }


            reactionState = "start";

            reactionArea.className =
                "reaction-area";

            reactionArea.textContent =
                "Nochmal spielen";

            reactionText.textContent =
                "Deine Reaktionszeit!";

        }

    }
);


function startReactionGame() {

    reactionState = "waiting";

    reactionArea.className =
        "reaction-area waiting";

    reactionArea.textContent =
        "🔴 Warte...";

    reactionText.textContent =
        "Warte auf GRÜN!";


    const waitTime =
        Math.floor(
            Math.random() * 3000
        ) + 1000;


    reactionTimer =
        setTimeout(
            function() {

                reactionState =
                    "ready";

                reactionArea.className =
                    "reaction-area ready";

                reactionArea.textContent =
                    "🟢 JETZT KLICKEN!";

                reactionText.textContent =
                    "KLICK!";

                reactionStartTime =
                    performance.now();

            },
            waitTime
        );

}


function resetReactionGame() {

    clearTimeout(reactionTimer);

    reactionState = "start";

    reactionArea.className =
        "reaction-area";

    reactionArea.textContent =
        "Start";

    reactionText.textContent =
        "Wie schnell kannst du reagieren?";

    reactionTime.textContent =
        "-";

}


// =========================
// QUIZ
// =========================

const quizGame =
    document.getElementById("quizGame");

const quizGameButton =
    document.getElementById("quizGameButton");

const quizBackButton =
    document.getElementById("quizBackButton");

const questionNumber =
    document.getElementById("questionNumber");

const question =
    document.getElementById("question");

const answers =
    document.getElementById("answers");

const scoreElement =
    document.getElementById("score");

const nextQuestionButton =
    document.getElementById(
        "nextQuestionButton"
    );

const quizResult =
    document.getElementById("quizResult");

const finalScore =
    document.getElementById("finalScore");

const restartQuizButton =
    document.getElementById(
        "restartQuizButton"
    );


// Fragen

const questions = [

    {
        question: "Wie viele Kontinente gibt es?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "Was ist die Hauptstadt von Frankreich?",
        answers: ["Madrid", "Paris", "Rom", "Berlin"],
        correct: 1
    },

    {
        question: "Wie viele Beine hat eine Spinne?",
        answers: ["6", "8", "10", "12"],
        correct: 1
    },

    {
        question: "Welcher Planet ist der Sonne am nächsten?",
        answers: ["Mars", "Venus", "Merkur", "Jupiter"],
        correct: 2
    },

    {
        question: "Wie viele Minuten hat eine Stunde?",
        answers: ["30", "45", "60", "90"],
        correct: 2
    },

    {
        question: "Was ist die Hauptstadt von Deutschland?",
        answers: ["München", "Hamburg", "Berlin", "Köln"],
        correct: 2
    },

    {
        question: "Wie heißt der größte Ozean der Erde?",
        answers: ["Atlantischer Ozean", "Pazifischer Ozean", "Indischer Ozean", "Arktischer Ozean"],
        correct: 1
    },

    {
        question: "Wie viele Tage hat ein Schaltjahr?",
        answers: ["364", "365", "366", "367"],
        correct: 2
    },

    {
        question: "Welches Tier wird oft als König der Tiere bezeichnet?",
        answers: ["Tiger", "Elefant", "Löwe", "Bär"],
        correct: 2
    },

    {
        question: "Wie viele Seiten hat ein Dreieck?",
        answers: ["2", "3", "4", "5"],
        correct: 1
    },

    {
        question: "Welche Farbe entsteht aus Blau und Gelb?",
        answers: ["Orange", "Grün", "Lila", "Rosa"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Italien?",
        answers: ["Rom", "Mailand", "Venedig", "Neapel"],
        correct: 0
    },

    {
        question: "Welcher Planet ist als Roter Planet bekannt?",
        answers: ["Venus", "Mars", "Saturn", "Neptun"],
        correct: 1
    },

    {
        question: "Wie viele Stunden hat ein Tag?",
        answers: ["12", "18", "24", "48"],
        correct: 2
    },

    {
        question: "Welches Gas atmen Menschen hauptsächlich ein?",
        answers: ["Sauerstoff", "Stickstoff", "Helium", "Wasserstoff"],
        correct: 1
    },

    {
        question: "Was ist das größte Land der Erde nach Fläche?",
        answers: ["China", "USA", "Kanada", "Russland"],
        correct: 3
    },

    {
        question: "Wie viele Monate hat ein Jahr?",
        answers: ["10", "11", "12", "13"],
        correct: 2
    },

    {
        question: "Welches Tier ist das größte Landtier?",
        answers: ["Giraffe", "Elefant", "Nashorn", "Nilpferd"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Spanien?",
        answers: ["Barcelona", "Madrid", "Sevilla", "Valencia"],
        correct: 1
    },

    {
        question: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?",
        answers: ["28", "30", "32", "36"],
        correct: 2
    },

    {
        question: "Welcher Kontinent ist der größte?",
        answers: ["Afrika", "Europa", "Asien", "Amerika"],
        correct: 2
    },

    {
        question: "Was ist H2O?",
        answers: ["Sauerstoff", "Wasser", "Wasserstoff", "Salz"],
        correct: 1
    },

    {
        question: "Welche Sprache wird hauptsächlich in Brasilien gesprochen?",
        answers: ["Spanisch", "Portugiesisch", "Englisch", "Französisch"],
        correct: 1
    },

    {
        question: "Wie viele Farben hat ein Regenbogen traditionell?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "Welches Organ pumpt Blut durch den Körper?",
        answers: ["Lunge", "Gehirn", "Herz", "Leber"],
        correct: 2
    },

    {
        question: "Wie heißt die Hauptstadt von Österreich?",
        answers: ["Salzburg", "Wien", "Graz", "Linz"],
        correct: 1
    },

    {
        question: "Wie viele Sekunden hat eine Minute?",
        answers: ["30", "45", "60", "90"],
        correct: 2
    },

    {
        question: "Welcher Vogel kann nicht fliegen?",
        answers: ["Adler", "Pinguin", "Falke", "Schwalbe"],
        correct: 1
    },

    {
        question: "Welches Metall hat das chemische Symbol Au?",
        answers: ["Silber", "Gold", "Kupfer", "Eisen"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Großbritannien?",
        answers: ["Manchester", "London", "Liverpool", "Birmingham"],
        correct: 1
    },

    {
        question: "Welcher Planet hat auffällige Ringe?",
        answers: ["Mars", "Saturn", "Merkur", "Erde"],
        correct: 1
    },

    {
        question: "Wie viele Beine hat ein Insekt normalerweise?",
        answers: ["4", "6", "8", "10"],
        correct: 1
    },

    {
        question: "Was ist die Hauptstadt von Japan?",
        answers: ["Kyoto", "Osaka", "Tokio", "Nagoya"],
        correct: 2
    },

    {
        question: "Welches Tier legt Eier und ist ein Säugetier?",
        answers: ["Hund", "Schnabeltier", "Katze", "Pferd"],
        correct: 1
    },

    {
        question: "Wie viele Spieler stehen bei einer Fußballmannschaft normalerweise gleichzeitig auf dem Feld?",
        answers: ["9", "10", "11", "12"],
        correct: 2
    },

    {
        question: "Welche Währung wird in Japan verwendet?",
        answers: ["Yuan", "Won", "Yen", "Dollar"],
        correct: 2
    },

    {
        question: "Welches ist das kleinste Land der Welt?",
        answers: ["Monaco", "Vatikanstadt", "Malta", "Luxemburg"],
        correct: 1
    },

    {
        question: "Wie nennt man gefrorenes Wasser?",
        answers: ["Dampf", "Eis", "Nebel", "Regen"],
        correct: 1
    },

    {
        question: "Welcher Planet ist der größte in unserem Sonnensystem?",
        answers: ["Saturn", "Jupiter", "Neptun", "Erde"],
        correct: 1
    },

    {
        question: "Wie viele Bundesländer hat Deutschland?",
        answers: ["14", "15", "16", "17"],
        correct: 2
    },

    {
        question: "Welche Farbe hat Chlorophyll hauptsächlich?",
        answers: ["Rot", "Blau", "Grün", "Gelb"],
        correct: 2
    },

    {
        question: "Wie heißt der höchste Berg der Erde über dem Meeresspiegel?",
        answers: ["K2", "Mount Everest", "Mont Blanc", "Kilimandscharo"],
        correct: 1
    },

    {
        question: "Welches Land hat die Form eines Stiefels?",
        answers: ["Spanien", "Italien", "Griechenland", "Portugal"],
        correct: 1
    },

    {
        question: "Wie viele Herzen hat ein Oktopus?",
        answers: ["1", "2", "3", "4"],
        correct: 2
    },

    {
        question: "Welche Jahreszeit folgt auf den Winter?",
        answers: ["Sommer", "Herbst", "Frühling", "Winter"],
        correct: 2
    },

    {
        question: "Wie heißt der längste Fluss der Welt nach verbreiteter Lehrbuchangabe?",
        answers: ["Amazonas", "Nil", "Rhein", "Donau"],
        correct: 1
    },

    {
        question: "Welches Land ist für die Pyramiden von Gizeh bekannt?",
        answers: ["Ägypten", "Mexiko", "Peru", "Indien"],
        correct: 0
    },

    {
        question: "Wie viele Planeten hat unser Sonnensystem?",
        answers: ["7", "8", "9", "10"],
        correct: 1
    },

    {
        question: "Welches Instrument hat normalerweise 88 Tasten?",
        answers: ["Gitarre", "Klavier", "Geige", "Trompete"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Kanada?",
        answers: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        correct: 2
    },

    {
        question: "Welches Tier ist für seinen langen Hals bekannt?",
        answers: ["Zebra", "Giraffe", "Kamel", "Antilope"],
        correct: 1
    },

    {
        question: "Was ist die Quadratwurzel von 64?",
        answers: ["6", "7", "8", "9"],
        correct: 2
    },

    {
        question: "Welches Meer liegt zwischen Europa und Afrika?",
        answers: ["Nordsee", "Mittelmeer", "Ostsee", "Karibisches Meer"],
        correct: 1
    },

    {
        question: "Welche Zahl kommt nach 999?",
        answers: ["100", "1000", "9999", "1010"],
        correct: 1
    },

    {
        question: "Welcher Planet wird auch als Morgenstern bezeichnet?",
        answers: ["Venus", "Mars", "Jupiter", "Merkur"],
        correct: 0
    },

    {
        question: "Welche Farbe hat eine typische Banane, wenn sie reif ist?",
        answers: ["Blau", "Grün", "Gelb", "Lila"],
        correct: 2
    },

    {
        question: "Wie heißt die Hauptstadt von Griechenland?",
        answers: ["Athen", "Thessaloniki", "Patras", "Korfu"],
        correct: 0
    },

    {
        question: "Welches Tier wird auch als 'Wüstenschiff' bezeichnet?",
        answers: ["Pferd", "Kamel", "Elefant", "Esel"],
        correct: 1
    },

    {
        question: "Wie viele Seiten hat ein Würfel insgesamt?",
        answers: ["4", "6", "8", "12"],
        correct: 1
    },

    {
        question: "Welches Gas benötigen Menschen zum Atmen?",
        answers: ["Sauerstoff", "Helium", "Kohlendioxid", "Methan"],
        correct: 0
    },

    {
        question: "Was ist die Hauptstadt der Schweiz?",
        answers: ["Zürich", "Genf", "Bern", "Basel"],
        correct: 2
    },

    {
        question: "Welches Tier ist bekannt für seinen schwarz-weißen Körper und Bambus als Nahrung?",
        answers: ["Panda", "Zebra", "Pinguin", "Tapir"],
        correct: 0
    },

    {
        question: "Wie viele Stunden hat eine Woche?",
        answers: ["120", "168", "180", "240"],
        correct: 1
    },

    {
        question: "Welches Land hat die Hauptstadt Madrid?",
        answers: ["Portugal", "Spanien", "Italien", "Frankreich"],
        correct: 1
    },

    {
        question: "Wie nennt man die Wissenschaft vom Wetter?",
        answers: ["Geologie", "Meteorologie", "Biologie", "Astronomie"],
        correct: 1
    },

    {
        question: "Welche Farbe entsteht aus Rot und Blau?",
        answers: ["Grün", "Orange", "Lila", "Gelb"],
        correct: 2
    },

    {
        question: "Welcher Kontinent liegt am Südpol?",
        answers: ["Europa", "Antarktika", "Asien", "Afrika"],
        correct: 1
    },

    {
        question: "Wie viele Knochen hat ein erwachsener Mensch ungefähr?",
        answers: ["106", "206", "306", "406"],
        correct: 1
    },

    {
        question: "Welche Stadt ist die Hauptstadt von China?",
        answers: ["Shanghai", "Hongkong", "Peking", "Shenzhen"],
        correct: 2
    },

    {
        question: "Welches Tier ist das größte Tier der Welt?",
        answers: ["Elefant", "Blauwal", "Giraffe", "Walhai"],
        correct: 1
    },

    {
        question: "Wie viele Tage hat eine normale Woche?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "Welcher Planet ist für seine bläuliche Farbe bekannt und liegt am weitesten von der Sonne entfernt?",
        answers: ["Uranus", "Neptun", "Saturn", "Mars"],
        correct: 1
    },

    {
        question: "Was misst ein Thermometer?",
        answers: ["Gewicht", "Temperatur", "Geschwindigkeit", "Entfernung"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Portugal?",
        answers: ["Porto", "Lissabon", "Faro", "Braga"],
        correct: 1
    },

    {
        question: "Welches Tier kann seine Farbe zur Tarnung verändern?",
        answers: ["Chamäleon", "Elefant", "Pferd", "Panda"],
        correct: 0
    },

    {
        question: "Wie viele Nullen hat eine Million?",
        answers: ["4", "5", "6", "7"],
        correct: 2
    },

    {
        question: "Welcher Kontinent ist flächenmäßig der kleinste?",
        answers: ["Europa", "Australien", "Afrika", "Südamerika"],
        correct: 1
    },

    {
        question: "Welche Sprache wird in Österreich hauptsächlich gesprochen?",
        answers: ["Deutsch", "Französisch", "Italienisch", "Spanisch"],
        correct: 0
    },

    {
        question: "Wie heißt der natürliche Satellit der Erde?",
        answers: ["Mars", "Mond", "Sonne", "Venus"],
        correct: 1
    },

    {
        question: "Was ist 10 × 10?",
        answers: ["10", "50", "100", "1000"],
        correct: 2
    },

    {
        question: "Welches Tier ist bekannt dafür, Honig zu produzieren?",
        answers: ["Wespe", "Biene", "Fliege", "Käfer"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Norwegen?",
        answers: ["Oslo", "Bergen", "Stockholm", "Helsinki"],
        correct: 0
    },

    {
        question: "Welcher Stoff gibt Pflanzen ihre grüne Farbe?",
        answers: ["Chlorophyll", "Hämoglobin", "Melanin", "Keratin"],
        correct: 0
    },

    {
        question: "Wie viele Seiten hat ein Quadrat?",
        answers: ["3", "4", "5", "6"],
        correct: 1
    },

    {
        question: "Welche Stadt ist für den Eiffelturm bekannt?",
        answers: ["London", "Paris", "Rom", "Berlin"],
        correct: 1
    },

    {
        question: "Welches Tier ist ein Reptil?",
        answers: ["Frosch", "Krokodil", "Delfin", "Adler"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Schweden?",
        answers: ["Oslo", "Stockholm", "Kopenhagen", "Helsinki"],
        correct: 1
    },

    {
        question: "Wie viele Monate haben 31 Tage?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "Welcher Kontinent ist für die Sahara bekannt?",
        answers: ["Afrika", "Asien", "Europa", "Australien"],
        correct: 0
    },

    {
        question: "Was ist die größte Wüste der Erde nach Fläche?",
        answers: ["Sahara", "Gobi", "Antarktische Wüste", "Kalahari"],
        correct: 2
    },

    {
        question: "Welche Farbe hat der Himmel bei klarem Wetter normalerweise?",
        answers: ["Grün", "Blau", "Rot", "Orange"],
        correct: 1
    },

    {
        question: "Wie nennt man ein junges Pferd?",
        answers: ["Kalb", "Fohlen", "Lamm", "Kitz"],
        correct: 1
    },

    {
        question: "Welcher Planet ist unser Heimatplanet?",
        answers: ["Mars", "Venus", "Erde", "Jupiter"],
        correct: 2
    },

    {
        question: "Wie viele Seiten hat ein Sechseck?",
        answers: ["5", "6", "7", "8"],
        correct: 1
    },

    {
        question: "Welches Land ist bekannt für die Stadt Venedig?",
        answers: ["Italien", "Frankreich", "Spanien", "Griechenland"],
        correct: 0
    },

    {
        question: "Was ist die Hauptstadt von Irland?",
        answers: ["Dublin", "Cork", "Galway", "Belfast"],
        correct: 0
    },

    {
        question: "Wie viele Farben hat die deutsche Flagge?",
        answers: ["2", "3", "4", "5"],
        correct: 1
    },

    {
        question: "Welche Zahl ist eine gerade Zahl?",
        answers: ["7", "11", "14", "19"],
        correct: 2
    },

    {
        question: "Welches Tier lebt typischerweise in einem Bienenstock?",
        answers: ["Biene", "Ameise", "Spinne", "Schmetterling"],
        correct: 0
    },

    {
        question: "Wie heißt die Hauptstadt von Dänemark?",
        answers: ["Oslo", "Kopenhagen", "Stockholm", "Reykjavik"],
        correct: 1
    },

    {
        question: "Welches Land liegt südlich von Deutschland?",
        answers: ["Dänemark", "Polen", "Österreich", "Niederlande"],
        correct: 2
    },

    {
        question: "Wie viele Finger hat ein Mensch normalerweise an beiden Händen zusammen?",
        answers: ["8", "10", "12", "14"],
        correct: 1
    },

    {
        question: "Welches Tier ist für seinen Beutel bekannt?",
        answers: ["Känguru", "Tiger", "Wolf", "Panda"],
        correct: 0
    },

    {
        question: "Was ist die Hauptstadt von Belgien?",
        answers: ["Brüssel", "Antwerpen", "Gent", "Brügge"],
        correct: 0
    },

    {
        question: "Welcher Planet ist bekannt für den Großen Roten Fleck?",
        answers: ["Mars", "Jupiter", "Saturn", "Neptun"],
        correct: 1
    },

    {
        question: "Wie viele Räder hat ein normales Fahrrad?",
        answers: ["1", "2", "3", "4"],
        correct: 1
    },

    {
        question: "Welche Frucht wird traditionell zur Herstellung von Wein verwendet?",
        answers: ["Apfel", "Traube", "Banane", "Orange"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Finnland?",
        answers: ["Helsinki", "Oslo", "Tallinn", "Riga"],
        correct: 0
    },

    {
        question: "Was ist das Gegenteil von 'kalt'?",
        answers: ["nass", "warm", "dunkel", "klein"],
        correct: 1
    },

    {
        question: "Welches Tier ist bekannt für seine schwarz-weißen Streifen?",
        answers: ["Zebra", "Tiger", "Panda", "Skunk"],
        correct: 0
    },

    {
        question: "Wie viele Seiten hat ein A4-Blatt?",
        answers: ["1", "2", "4", "6"],
        correct: 1
    },

    {
        question: "Welche Stadt ist die Hauptstadt der Niederlande?",
        answers: ["Rotterdam", "Amsterdam", "Den Haag", "Utrecht"],
        correct: 1
    },

    {
        question: "Was ist die Sonne?",
        answers: ["Ein Planet", "Ein Stern", "Ein Mond", "Ein Asteroid"],
        correct: 1
    },

    {
        question: "Wie viele Jahreszeiten gibt es normalerweise?",
        answers: ["2", "3", "4", "5"],
        correct: 2
    },

    {
        question: "Welches Tier ist bekannt für sein schwarz-weißes Fell und lebt in China?",
        answers: ["Panda", "Zebra", "Pinguin", "Skunk"],
        correct: 0
    },

    {
        question: "Welche Zahl ist größer?",
        answers: ["25", "52", "35", "45"],
        correct: 1
    },

    {
        question: "Wie heißt die Hauptstadt von Polen?",
        answers: ["Warschau", "Krakau", "Danzig", "Posen"],
        correct: 0
    },

    {
        question: "Welches Organ ist hauptsächlich für das Atmen zuständig?",
        answers: ["Herz", "Lunge", "Magen", "Leber"],
        correct: 1
    },

    {
        question: "Wie viele Stunden hat ein Wochenende?",
        answers: ["24", "36", "48", "72"],
        correct: 2
    },

    {
        question: "Welcher Planet ist für seine Ringe besonders bekannt?",
        answers: ["Merkur", "Saturn", "Venus", "Mars"],
        correct: 1
    },

    {
        question: "Welche Farbe hat eine Zitrone normalerweise?",
        answers: ["Gelb", "Blau", "Lila", "Schwarz"],
        correct: 0
    },

    {
        question: "Wie heißt die Hauptstadt von Island?",
        answers: ["Reykjavik", "Oslo", "Helsinki", "Dublin"],
        correct: 0
    },

    {
        question: "Welches Tier macht typischerweise 'Miau'?",
        answers: ["Hund", "Katze", "Kuh", "Schaf"],
        correct: 1
    },

    {
        question: "Wie viele Seiten hat ein Achteck?",
        answers: ["6", "7", "8", "10"],
        correct: 2
    }

];


let currentQuestion = 0;

let score = 0;

let answerSelected = false;


// Quiz öffnen

quizGameButton.addEventListener(
    "click",
    function() {

        home.style.display = "none";

        quizGame.style.display = "block";

        startQuiz();

    }
);


// Quiz zurück

quizBackButton.addEventListener(
    "click",
    function() {

        quizGame.style.display =
            "none";

        home.style.display =
            "block";

    }
);


// Quiz starten

function startQuiz() {

    // 🎲 Fragen zufällig mischen
    questions.sort(() => Math.random() - 0.5);

    currentQuestion = 0;

    score = 0;

    scoreElement.textContent = score;

    quizResult.style.display = "none";

    questionNumber.style.display = "block";

    question.style.display = "block";

    answers.style.display = "grid";

    nextQuestionButton.style.display = "inline-block";

    showQuestion();
}


// Frage anzeigen

function showQuestion() {

    const current =
        questions[currentQuestion];


    questionNumber.textContent =
        "Frage " +
        (currentQuestion + 1) +
        " von " +
        questions.length;


    question.textContent =
        current.question;


    answers.innerHTML = "";


    answerSelected = false;

    nextQuestionButton.disabled =
        true;


    current.answers.forEach(
        function(answer, index) {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                answer;

            button.className =
                "answer-button";

            button.addEventListener(
                "click",
                function() {

                    selectAnswer(
                        index,
                        button
                    );

                }
            );


            answers.appendChild(button);

        }
    );

}


// Antwort auswählen

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    if (answerSelected) {
        return;
    }


    answerSelected = true;


    const current =
        questions[currentQuestion];


    const allButtons =
        answers.querySelectorAll(
            ".answer-button"
        );


    allButtons.forEach(
        function(button) {

            button.disabled = true;

        }
    );


    if (
        selectedIndex ===
        current.correct
    ) {

        selectedButton.classList.add(
            "correct"
        );

        score++;

        scoreElement.textContent =
            score;

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        allButtons[
            current.correct
        ].classList.add(
            "correct"
        );

    }


    nextQuestionButton.disabled =
        false;

}


// Nächste Frage

nextQuestionButton.addEventListener(
    "click",
    function() {

        currentQuestion++;


        if (
            currentQuestion >=
            questions.length
        ) {

            showResult();

            return;

        }


        showQuestion();

    }
);


// Ergebnis anzeigen

function showResult() {

    questionNumber.style.display =
        "none";

    question.style.display =
        "none";

    answers.style.display =
        "none";

    nextQuestionButton.style.display =
        "none";

    quizResult.style.display =
        "block";


    finalScore.textContent =
        score +
        " / " +
        questions.length;

}


// Quiz neu starten

restartQuizButton.addEventListener(
    "click",
    function() {

        startQuiz();

    }
);

// =========================
// TETRIS
// =========================

const tetrisGame =
    document.getElementById("tetrisGame");

const tetrisGameButton =
    document.getElementById("tetrisGameButton");

const tetrisBackButton =
    document.getElementById("tetrisBackButton");

const tetrisBoard =
    document.getElementById("tetris-board");

const tetrisScoreElement =
    document.getElementById("tetris-score");

const tetrisLevelElement =
    document.getElementById("tetris-level");

const tetrisRestartButton =
    document.getElementById("tetris-restart");

const tetrisLeftButton =
    document.getElementById("tetris-left");

const tetrisRightButton =
    document.getElementById("tetris-right");

const tetrisRotateButton =
    document.getElementById("tetris-rotate");

const tetrisDownButton =
    document.getElementById("tetris-down");


// =========================
// TETRIS EINSTELLUNGEN
// =========================

const TETRIS_WIDTH = 10;
const TETRIS_HEIGHT = 20;

let tetrisBoardData = [];

let tetrisCurrentPiece = null;

let tetrisCurrentX = 0;
let tetrisCurrentY = 0;

let tetrisScore = 0;
let tetrisLevel = 1;

let tetrisGameOver = false;

let tetrisTimer = null;


// =========================
// TETRIS BLÖCKE
// =========================

const tetrisPieces = [

    {
        color: "#00f0f0",
        shape: [
            [1, 1, 1, 1]
        ]
    },

    {
        color: "#f0f000",
        shape: [
            [1, 1],
            [1, 1]
        ]
    },

    {
        color: "#a000f0",
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },

    {
        color: "#00f000",
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },

    {
        color: "#f00000",
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },

    {
        color: "#0000f0",
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },

    {
        color: "#f0a000",
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }

];


// =========================
// TETRIS SPIEL ÖFFNEN
// =========================

tetrisGameButton.addEventListener(
    "click",
    function() {

        home.style.display = "none";

        tetrisGame.style.display = "block";

        startTetris();

    }
);


// =========================
// TETRIS ZURÜCK
// =========================

tetrisBackButton.addEventListener(
    "click",
    function() {

        stopTetris();

        tetrisGame.style.display = "none";

        home.style.display = "block";

    }
);


// =========================
// TETRIS STARTEN
// =========================

function startTetris() {

    stopTetris();

    tetrisScore = 0;

    tetrisLevel = 1;

    tetrisGameOver = false;

    tetrisScoreElement.textContent =
        tetrisScore;

    tetrisLevelElement.textContent =
        tetrisLevel;


    tetrisBoardData = [];

    for (
        let y = 0;
        y < TETRIS_HEIGHT;
        y++
    ) {

        tetrisBoardData[y] = [];

        for (
            let x = 0;
            x < TETRIS_WIDTH;
            x++
        ) {

            tetrisBoardData[y][x] = null;

        }

    }


    createTetrisPiece();

    drawTetrisBoard();

    startTetrisTimer();

}


// =========================
// NEUEN BLOCK ERSTELLEN
// =========================

function createTetrisPiece() {

    const randomIndex =
        Math.floor(
            Math.random() *
            tetrisPieces.length
        );

    const original =
        tetrisPieces[randomIndex];


    tetrisCurrentPiece = {

        color: original.color,

        shape: original.shape.map(
            row => [...row]
        )

    };


    tetrisCurrentX =
        Math.floor(
            (TETRIS_WIDTH -
                tetrisCurrentPiece.shape[0].length)
            / 2
        );

    tetrisCurrentY = 0;


    if (
        checkTetrisCollision(
            tetrisCurrentX,
            tetrisCurrentY,
            tetrisCurrentPiece.shape
        )
    ) {

        tetrisGameOver = true;

        stopTetris();

        drawTetrisBoard();

        setTimeout(
            function() {

                alert(
                    "Game Over! 🎮\nScore: " +
                    tetrisScore
                );

            },
            100
        );

    }

}


// =========================
// SPIELFELD ZEICHNEN
// =========================

function drawTetrisBoard() {

    tetrisBoard.innerHTML = "";


    for (
        let y = 0;
        y < TETRIS_HEIGHT;
        y++
    ) {

        for (
            let x = 0;
            x < TETRIS_WIDTH;
            x++
        ) {

            const cell =
                document.createElement("div");

            cell.className =
                "tetris-cell";


            if (
                tetrisBoardData[y][x]
            ) {

                cell.style.background =
                    tetrisBoardData[y][x];

                cell.style.boxShadow =
                    "inset 0 0 8px rgba(255,255,255,0.5)";

            }


            if (
                tetrisCurrentPiece &&
                isPartOfCurrentPiece(x, y)
            ) {

                cell.style.background =
                    tetrisCurrentPiece.color;

                cell.style.boxShadow =
                    "inset 0 0 8px rgba(255,255,255,0.5)";

            }


            tetrisBoard.appendChild(cell);

        }

    }

}


// =========================
// BLOCK ERKENNEN
// =========================

function isPartOfCurrentPiece(
    x,
    y
) {

    if (!tetrisCurrentPiece) {
        return false;
    }


    const pieceX =
        x - tetrisCurrentX;

    const pieceY =
        y - tetrisCurrentY;


    if (
        pieceY < 0 ||
        pieceY >=
        tetrisCurrentPiece.shape.length
    ) {

        return false;

    }


    if (
        pieceX < 0 ||
        pieceX >=
        tetrisCurrentPiece.shape[0].length
    ) {

        return false;

    }


    return Boolean(
        tetrisCurrentPiece.shape[pieceY][pieceX]
    );

}


// =========================
// KOLLISION
// =========================

function checkTetrisCollision(
    newX,
    newY,
    shape
) {

    for (
        let y = 0;
        y < shape.length;
        y++
    ) {

        for (
            let x = 0;
            x < shape[y].length;
            x++
        ) {

            if (!shape[y][x]) {
                continue;
            }


            const boardX =
                newX + x;

            const boardY =
                newY + y;


            if (
                boardX < 0 ||
                boardX >= TETRIS_WIDTH ||
                boardY >= TETRIS_HEIGHT
            ) {

                return true;

            }


            if (
                boardY >= 0 &&
                tetrisBoardData[boardY][boardX]
            ) {

                return true;

            }

        }

    }


    return false;

}


// =========================
// BLOCK BEWEGEN
// =========================

function moveTetris(
    direction
) {

    if (tetrisGameOver) {
        return;
    }


    const newX =
        tetrisCurrentX +
        direction;


    if (
        !checkTetrisCollision(
            newX,
            tetrisCurrentY,
            tetrisCurrentPiece.shape
        )
    ) {

        tetrisCurrentX =
            newX;

        drawTetrisBoard();

    }

}


// =========================
// BLOCK NACH UNTEN
// =========================

function dropTetris() {

    if (tetrisGameOver) {
        return;
    }


    const newY =
        tetrisCurrentY + 1;


    if (
        !checkTetrisCollision(
            tetrisCurrentX,
            newY,
            tetrisCurrentPiece.shape
        )
    ) {

        tetrisCurrentY =
            newY;

    } else {

        lockTetrisPiece();

    }


    drawTetrisBoard();

}


// =========================
// BLOCK FESTSETZEN
// =========================

function lockTetrisPiece() {

    const shape =
        tetrisCurrentPiece.shape;


    for (
        let y = 0;
        y < shape.length;
        y++
    ) {

        for (
            let x = 0;
            x < shape[y].length;
            x++
        ) {

            if (!shape[y][x]) {
                continue;
            }


            const boardX =
                tetrisCurrentX + x;

            const boardY =
                tetrisCurrentY + y;


            if (
                boardY >= 0 &&
                boardY < TETRIS_HEIGHT
            ) {

                tetrisBoardData[boardY][boardX] =
                    tetrisCurrentPiece.color;

            }

        }

    }


    clearTetrisLines();

    createTetrisPiece();

}


// =========================
// REIHEN LÖSCHEN
// =========================

function clearTetrisLines() {

    let linesCleared = 0;


    for (
        let y = TETRIS_HEIGHT - 1;
        y >= 0;
        y--
    ) {

        const full =
            tetrisBoardData[y].every(
                cell => cell !== null
            );


        if (full) {

            tetrisBoardData.splice(
                y,
                1
            );


            tetrisBoardData.unshift(
                new Array(
                    TETRIS_WIDTH
                ).fill(null)
            );


            linesCleared++;

            y++;

        }

    }


    if (linesCleared > 0) {

        const points =
            [0, 100, 300, 500, 800];

        tetrisScore +=
            points[linesCleared] || 800;


        tetrisScoreElement.textContent =
            tetrisScore;


        tetrisLevel =
            Math.floor(
                tetrisScore / 1000
            ) + 1;


        tetrisLevelElement.textContent =
            tetrisLevel;


        startTetrisTimer();

    }

}


// =========================
// BLOCK DREHEN
// =========================

function rotateTetrisPiece() {

    if (tetrisGameOver) {
        return;
    }


    const oldShape =
        tetrisCurrentPiece.shape;


    const height =
        oldShape.length;

    const width =
        oldShape[0].length;


    const newShape = [];


    for (
        let x = 0;
        x < width;
        x++
    ) {

        newShape[x] = [];

        for (
            let y = height - 1;
            y >= 0;
            y--
        ) {

            newShape[x].push(
                oldShape[y][x]
            );

        }

    }


    if (
        !checkTetrisCollision(
            tetrisCurrentX,
            tetrisCurrentY,
            newShape
        )
    ) {

        tetrisCurrentPiece.shape =
            newShape;

        drawTetrisBoard();

    }

}


// =========================
// HARD DROP
// =========================

function hardDropTetris() {

    if (tetrisGameOver) {
        return;
    }


    while (
        !checkTetrisCollision(
            tetrisCurrentX,
            tetrisCurrentY + 1,
            tetrisCurrentPiece.shape
        )
    ) {

        tetrisCurrentY++;

    }


    lockTetrisPiece();

    drawTetrisBoard();

}


// =========================
// TIMER
// =========================

function startTetrisTimer() {

    clearInterval(tetrisTimer);


    const speed =
        Math.max(
            100,
            800 -
            ((tetrisLevel - 1) * 70)
        );


    tetrisTimer =
        setInterval(
            function() {

                dropTetris();

            },
            speed
        );

}


function stopTetris() {

    clearInterval(tetrisTimer);

    tetrisTimer = null;

}


// =========================
// BUTTONS
// =========================

tetrisLeftButton.addEventListener(
    "click",
    function() {

        moveTetris(-1);

    }
);


tetrisRightButton.addEventListener(
    "click",
    function() {

        moveTetris(1);

    }
);


tetrisRotateButton.addEventListener(
    "click",
    function() {

        rotateTetrisPiece();

    }
);


tetrisDownButton.addEventListener(
    "click",
    function() {

        dropTetris();

    }
);


tetrisRestartButton.addEventListener(
    "click",
    function() {

        startTetris();

    }
);


// =========================
// TASTATUR
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            tetrisGame.style.display !==
            "block"
        ) {

            return;

        }


        if (
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            moveTetris(-1);

        }


        if (
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            moveTetris(1);

        }


        if (
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            dropTetris();

        }


        if (
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            rotateTetrisPiece();

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            hardDropTetris();

        }

    }
);
