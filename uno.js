// ============================================================
// UNO – ONLINE MULTIPLAYER (Raum-Code, 2 Spieler)
// ============================================================
//
// Das hier läuft über Firebase Realtime Database als
// "Vermittler" zwischen den zwei Geräten. Du brauchst dafür
// EINMALIG ein kostenloses Firebase-Projekt:
//
//   1. Auf https://console.firebase.google.com ein neues
//      Projekt anlegen (kostenlos, Google-Konto reicht).
//   2. Im Projekt links auf "Build" → "Realtime Database" →
//      "Datenbank erstellen" (Testmodus reicht zum Start).
//   3. Bei den Regeln (Rules) Folgendes eintragen und
//      veröffentlichen (einfache Regeln für ein kleines
//      privates Spiel unter Freunden):
//
//          {
//            "rules": {
//              ".read": true,
//              ".write": true
//            }
//          }
//
//   4. Links oben auf das Zahnrad → "Projekteinstellungen" →
//      ganz unten bei "Meine Apps" → Web-App (</>) hinzufügen.
//      Dort bekommst du ein "firebaseConfig"-Objekt.
//   5. Trag die Werte unten bei UNO_FIREBASE_CONFIG ein.
//
// Bis die echten Werte eingetragen sind, funktioniert Uno
// noch nicht (es kommt eine Fehlermeldung im Lobby-Bereich).
//
// ============================================================

const UNO_FIREBASE_CONFIG = {
    apiKey: "AIzaSyC7HXw_Wnh7UMEwGBF7YyqR5-WR1ZZVgt0",
    authDomain: "mini-fun-lab.firebaseapp.com",
    databaseURL: "https://mini-fun-lab-default-rtdb.firebaseio.com",
    projectId: "mini-fun-lab",
    storageBucket: "mini-fun-lab.firebasestorage.app",
    messagingSenderId: "102474221179",
    appId: "1:102474221179:web:a0d5321330b374e66fc4de"
};


// =========================
// ELEMENTE
// =========================

const unoHomeScreen =
    document.getElementById("home");

const unoScreen =
    document.getElementById("unoGame");

const unoGameButton =
    document.getElementById("unoGameButton");

const unoBackButton =
    document.getElementById("unoBackButton");

const unoLeaveButton =
    document.getElementById("unoLeaveButton");

const unoLobby =
    document.getElementById("unoLobby");

const unoNameInput =
    document.getElementById("unoNameInput");

const unoCreateButton =
    document.getElementById("unoCreateButton");

const unoJoinCodeInput =
    document.getElementById("unoJoinCodeInput");

const unoJoinButton =
    document.getElementById("unoJoinButton");

const unoLobbyError =
    document.getElementById("unoLobbyError");

const unoWaiting =
    document.getElementById("unoWaiting");

const unoRoomCodeDisplay =
    document.getElementById("unoRoomCodeDisplay");

const unoCopyCodeButton =
    document.getElementById("unoCopyCodeButton");

const unoBoard =
    document.getElementById("unoBoard");

const unoOpponentName =
    document.getElementById("unoOpponentName");

const unoOpponentCardCount =
    document.getElementById("unoOpponentCardCount");

const unoDrawPile =
    document.getElementById("unoDrawPile");

const unoDiscardTop =
    document.getElementById("unoDiscardTop");

const unoTurnIndicator =
    document.getElementById("unoTurnIndicator");

const unoHand =
    document.getElementById("unoHand");

const unoCallButton =
    document.getElementById("unoCallButton");

const unoColorPicker =
    document.getElementById("unoColorPicker");

const unoResult =
    document.getElementById("unoResult");

const unoResultText =
    document.getElementById("unoResultText");

const unoRestartButton =
    document.getElementById("unoRestartButton");


// =========================
// FIREBASE INIT
// =========================

let unoDb = null;

let unoFirebaseReady = false;

try {

    firebase.initializeApp(UNO_FIREBASE_CONFIG);

    unoDb = firebase.database();

    unoFirebaseReady = true;

} catch (error) {

    console.error(
        "Uno: Firebase konnte nicht gestartet werden.",
        error
    );

}


// =========================
// ZUSTAND (pro Browser)
// =========================

let unoSession = null;
// { code, role: "p1" | "p2", playerId }

let unoRoomRef = null;

let unoRoomListener = null;

let unoPendingCard = null;
// { card, index } – wartet auf Farbwahl bei Wild-Karten

let unoHostInitLock = false;


// =========================
// SPIEL ÖFFNEN / SCHLIESSEN
// =========================

unoGameButton.addEventListener(
    "click",
    function() {

        unoHomeScreen.style.display = "none";

        unoScreen.style.display = "block";

        openUnoScreen();

    }
);


unoBackButton.addEventListener(
    "click",
    function() {

        detachUnoListener();

        unoScreen.style.display = "none";

        unoHomeScreen.style.display = "block";

    }
);


function openUnoScreen() {

    if (!unoFirebaseReady) {

        showUnoView("lobby");

        unoLobbyError.textContent =
            "Uno ist noch nicht eingerichtet " +
            "(Firebase-Zugangsdaten fehlen in uno.js).";

        return;

    }


    const savedSession =
        loadUnoSession();


    if (savedSession) {

        unoSession = savedSession;

        showUnoView("waiting");

        attachUnoListener();

        return;

    }


    showUnoView("lobby");

    unoLobbyError.textContent = "";

}


// =========================
// SESSION SPEICHERN
// =========================

function saveUnoSession() {

    localStorage.setItem(
        "unoSession",
        JSON.stringify(unoSession)
    );

}


function loadUnoSession() {

    const raw =
        localStorage.getItem("unoSession");

    if (!raw) {

        return null;

    }


    try {

        return JSON.parse(raw);

    } catch (error) {

        return null;

    }

}


function clearUnoSession() {

    unoSession = null;

    localStorage.removeItem("unoSession");

}


function getUnoPlayerId() {

    let id =
        localStorage.getItem("unoPlayerId");

    if (!id) {

        id =
            "p_" +
            Math.random().toString(36).slice(2, 10);

        localStorage.setItem(
            "unoPlayerId",
            id
        );

    }

    return id;

}


// =========================
// ANSICHT WECHSELN
// =========================

function showUnoView(view) {

    unoLobby.classList.toggle(
        "hidden",
        view !== "lobby"
    );

    unoWaiting.classList.toggle(
        "hidden",
        view !== "waiting"
    );

    unoBoard.classList.toggle(
        "hidden",
        view !== "board"
    );

    unoResult.classList.toggle(
        "hidden",
        view !== "result"
    );

    unoColorPicker.classList.add(
        "hidden"
    );

    unoLeaveButton.classList.toggle(
        "hidden",
        view === "lobby"
    );

}


// =========================
// RAUM ERSTELLEN
// =========================

unoCreateButton.addEventListener(
    "click",
    function() {

        if (!unoFirebaseReady) {

            return;

        }


        const name =
            unoNameInput.value.trim() ||
            "Spieler 1";

        const playerId =
            getUnoPlayerId();

        const code =
            generateUnoRoomCode();


        unoSession = {
            code: code,
            role: "p1",
            playerId: playerId
        };


        unoDb.ref("unoRooms/" + code).set({

            status: "waiting",

            createdAt:
                firebase.database.ServerValue.TIMESTAMP,

            players: {

                p1: {
                    id: playerId,
                    name: name
                }

            }

        }).then(function() {

            saveUnoSession();

            unoRoomCodeDisplay.textContent =
                code;

            showUnoView("waiting");

            attachUnoListener();

        }).catch(function(error) {

            unoLobbyError.textContent =
                "Raum konnte nicht erstellt werden: " +
                error.message;

        });

    }
);


function generateUnoRoomCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 5; i++) {

        code +=
            chars[
                Math.floor(
                    Math.random() * chars.length
                )
            ];

    }

    return code;

}


// =========================
// RAUM BEITRETEN
// =========================

unoJoinButton.addEventListener(
    "click",
    function() {

        if (!unoFirebaseReady) {

            return;

        }


        const name =
            unoNameInput.value.trim() ||
            "Spieler 2";

        const code =
            unoJoinCodeInput.value
                .trim()
                .toUpperCase();

        unoLobbyError.textContent = "";


        if (!code) {

            unoLobbyError.textContent =
                "Bitte Raum-Code eingeben.";

            return;

        }


        const playerId =
            getUnoPlayerId();

        const roomRef =
            unoDb.ref("unoRooms/" + code);


        roomRef.once("value").then(
            function(snapshot) {

                const room =
                    snapshot.val();


                if (!room) {

                    unoLobbyError.textContent =
                        "Raum nicht gefunden. " +
                        "Code richtig eingegeben?";

                    return;

                }


                if (
                    room.players &&
                    room.players.p2 &&
                    room.players.p2.id !== playerId
                ) {

                    unoLobbyError.textContent =
                        "Dieser Raum ist schon voll.";

                    return;

                }


                roomRef.child("players/p2").set({

                    id: playerId,
                    name: name

                }).then(function() {

                    unoSession = {
                        code: code,
                        role: "p2",
                        playerId: playerId
                    };

                    saveUnoSession();

                    unoRoomCodeDisplay.textContent =
                        code;

                    showUnoView("waiting");

                    attachUnoListener();

                });

            }
        ).catch(function(error) {

            unoLobbyError.textContent =
                "Fehler beim Beitreten: " +
                error.message;

        });

    }
);


unoCopyCodeButton.addEventListener(
    "click",
    function() {

        if (!unoSession) {

            return;

        }


        navigator.clipboard
            .writeText(unoSession.code)
            .catch(function() {});

        unoCopyCodeButton.textContent =
            "✅ Kopiert!";

        setTimeout(function() {

            unoCopyCodeButton.textContent =
                "📋 Code kopieren";

        }, 1500);

    }
);


// =========================
// RAUM-LISTENER
// =========================

function attachUnoListener() {

    detachUnoListener();


    if (!unoSession) {

        return;

    }


    unoRoomRef =
        unoDb.ref("unoRooms/" + unoSession.code);

    unoRoomListener =
        unoRoomRef.on(
            "value",
            function(snapshot) {

                handleUnoRoomUpdate(
                    snapshot.val()
                );

            }
        );

}


function detachUnoListener() {

    if (unoRoomRef && unoRoomListener) {

        unoRoomRef.off(
            "value",
            unoRoomListener
        );

    }

    unoRoomRef = null;

    unoRoomListener = null;

    unoHostInitLock = false;

}


// =========================
// RAUM VERLASSEN
// =========================

unoLeaveButton.addEventListener(
    "click",
    function() {

        const roomCode =
            unoSession ? unoSession.code : null;

        detachUnoListener();

        if (unoFirebaseReady && roomCode) {

            unoDb.ref("unoRooms/" + roomCode)
                .remove()
                .catch(function() {});

        }

        clearUnoSession();

        unoJoinCodeInput.value = "";

        unoLobbyError.textContent = "";

        showUnoView("lobby");

    }
);


function handleUnoRoomUpdate(room) {

    if (!room || !unoSession) {

        clearUnoSession();

        showUnoView("lobby");

        unoLobbyError.textContent =
            "Der Raum existiert nicht mehr.";

        return;

    }


    unoRoomCodeDisplay.textContent =
        unoSession.code;


    if (room.status === "waiting") {

        showUnoView("waiting");


        const bothJoined =
            room.players &&
            room.players.p1 &&
            room.players.p2;

        const alreadyDealt =
            room.deck &&
            room.deck.length > 0;


        if (
            unoSession.role === "p1" &&
            bothJoined &&
            !alreadyDealt &&
            !unoHostInitLock
        ) {

            unoHostInitLock = true;

            startNewUnoRound(room);

        }

        return;

    }


    if (room.status === "playing") {

        showUnoView("board");

        renderUnoBoard(room);

        return;

    }


    if (room.status === "finished") {

        showUnoView("result");

        const winnerName =
            room.players[room.winner].name;

        const iWon =
            room.winner === unoSession.role;

        unoResultText.textContent =
            iWon ?
                "🏆 Du hast gewonnen!" :
                "😢 " + winnerName + " hat gewonnen.";

        return;

    }

}


// =========================
// NEUES SPIEL AUSTEILEN (nur Host)
// =========================

function startNewUnoRound(room) {

    let deck =
        buildShuffledUnoDeck();

    const handP1 =
        deck.splice(0, 7);

    const handP2 =
        deck.splice(0, 7);


    let firstCard =
        deck.pop();

    let safety = 0;

    while (
        firstCard === "wild4" &&
        safety < 20
    ) {

        deck.unshift(firstCard);

        firstCard =
            deck.pop();

        safety++;

    }


    let startColor =
        firstCard.split("-")[0];

    if (firstCard === "wild") {

        const colors =
            ["red", "yellow", "green", "blue"];

        startColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

    }


    unoDb.ref("unoRooms/" + unoSession.code).update({

        status: "playing",

        deck: deck,

        discard: [firstCard],

        hands: {
            p1: handP1,
            p2: handP2
        },

        turn: "p1",

        currentColor: startColor,

        winner: null

    });

}


function buildShuffledUnoDeck() {

    const colors =
        ["red", "yellow", "green", "blue"];

    let deck = [];


    colors.forEach(function(color) {

        deck.push(color + "-0");


        for (let n = 1; n <= 9; n++) {

            deck.push(color + "-" + n);

            deck.push(color + "-" + n);

        }


        ["skip", "reverse", "draw2"].forEach(
            function(type) {

                deck.push(color + "-" + type);

                deck.push(color + "-" + type);

            }
        );

    });


    for (let i = 0; i < 4; i++) {

        deck.push("wild");

        deck.push("wild4");

    }


    for (let i = deck.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        const temp = deck[i];

        deck[i] = deck[j];

        deck[j] = temp;

    }


    return deck;

}


// =========================
// KARTE ANALYSIEREN
// =========================

function parseUnoCard(cardStr) {

    if (cardStr === "wild") {

        return {
            raw: cardStr,
            color: null,
            type: "wild",
            value: null
        };

    }


    if (cardStr === "wild4") {

        return {
            raw: cardStr,
            color: null,
            type: "wild4",
            value: null
        };

    }


    const parts =
        cardStr.split("-");

    const color = parts[0];

    const rest = parts[1];


    if (/^[0-9]$/.test(rest)) {

        return {
            raw: cardStr,
            color: color,
            type: "number",
            value: Number(rest)
        };

    }


    return {
        raw: cardStr,
        color: color,
        type: rest,
        value: null
    };

}


function isUnoCardPlayable(
    cardStr,
    topCardStr,
    currentColor
) {

    const card =
        parseUnoCard(cardStr);


    if (
        card.type === "wild" ||
        card.type === "wild4"
    ) {

        return true;

    }


    if (card.color === currentColor) {

        return true;

    }


    const top =
        parseUnoCard(topCardStr);


    if (
        card.type === "number" &&
        top.type === "number" &&
        card.value === top.value
    ) {

        return true;

    }


    if (
        card.type !== "number" &&
        card.type === top.type
    ) {

        return true;

    }


    return false;

}


// =========================
// KARTE ALS ELEMENT ANZEIGEN
// =========================

const UNO_SYMBOLS = {
    skip: "🚫",
    reverse: "🔁",
    draw2: "+2",
    wild: "★",
    wild4: "+4"
};

const UNO_COLOR_HEX = {
    red: "#e6423a",
    yellow: "#f4c418",
    green: "#3aa655",
    blue: "#2a7de1",
    black: "#1a1a2e"
};


function styleUnoCardElement(
    element,
    cardStr,
    displayColor
) {

    const card =
        parseUnoCard(cardStr);

    const color =
        displayColor ||
        card.color ||
        "black";

    element.style.background =
        UNO_COLOR_HEX[color] ||
        "#1a1a2e";


    if (card.type === "number") {

        element.textContent =
            String(card.value);

    } else {

        element.textContent =
            UNO_SYMBOLS[card.type] || "?";

    }

}


// =========================
// SPIELFELD ZEICHNEN
// =========================

function renderUnoBoard(room) {

    const myRole =
        unoSession.role;

    const opponentRole =
        myRole === "p1" ? "p2" : "p1";

    const myHand =
        (room.hands && room.hands[myRole]) || [];

    const opponentHand =
        (room.hands && room.hands[opponentRole]) || [];

    const topCard =
        room.discard[room.discard.length - 1];

    const isMyTurn =
        room.turn === myRole;


    unoOpponentName.textContent =
        room.players[opponentRole] ?
            room.players[opponentRole].name :
            "Gegner";

    unoOpponentCardCount.textContent =
        opponentHand.length + " Karten";


    styleUnoCardElement(
        unoDiscardTop,
        topCard,
        room.currentColor
    );


    unoTurnIndicator.textContent =
        isMyTurn ?
            "Du bist dran!" :
            (room.players[opponentRole].name +
                " ist dran …");

    unoTurnIndicator.classList.toggle(
        "my-turn",
        isMyTurn
    );


    unoDrawPile.classList.toggle(
        "disabled",
        !isMyTurn
    );


    unoHand.innerHTML = "";

    myHand.forEach(function(cardStr, index) {

        const cardEl =
            document.createElement("div");

        cardEl.className =
            "uno-card uno-hand-card";

        styleUnoCardElement(
            cardEl,
            cardStr,
            null
        );


        const playable =
            isMyTurn &&
            isUnoCardPlayable(
                cardStr,
                topCard,
                room.currentColor
            );

        cardEl.classList.toggle(
            "playable",
            playable
        );


        cardEl.addEventListener(
            "click",
            function() {

                if (!playable) {

                    return;

                }

                attemptPlayUnoCard(
                    cardStr,
                    index
                );

            }
        );


        unoHand.appendChild(cardEl);

    });

}


// =========================
// KARTE SPIELEN
// =========================

function attemptPlayUnoCard(cardStr, index) {

    const card =
        parseUnoCard(cardStr);


    if (
        card.type === "wild" ||
        card.type === "wild4"
    ) {

        unoPendingCard = {
            card: cardStr,
            index: index
        };

        unoColorPicker.classList.remove(
            "hidden"
        );

        return;

    }


    performUnoCardPlay(
        cardStr,
        index,
        card.color
    );

}


document.querySelectorAll(
    ".uno-color-option"
).forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            if (!unoPendingCard) {

                return;

            }

            const chosenColor =
                button.dataset.color;

            performUnoCardPlay(
                unoPendingCard.card,
                unoPendingCard.index,
                chosenColor
            );

            unoPendingCard = null;

            unoColorPicker.classList.add(
                "hidden"
            );

        }
    );

});


function performUnoCardPlay(
    cardStr,
    index,
    chosenColor
) {

    unoRoomRef.once("value").then(
        function(snapshot) {

            const room =
                snapshot.val();

            if (!room || room.status !== "playing") {

                return;

            }


            const myRole =
                unoSession.role;

            const opponentRole =
                myRole === "p1" ? "p2" : "p1";


            let myHand =
                room.hands[myRole].slice();

            if (myHand[index] !== cardStr) {

                return;

            }

            myHand.splice(index, 1);


            let discard =
                room.discard.slice();

            discard.push(cardStr);


            let deck =
                room.deck.slice();

            let opponentHand =
                room.hands[opponentRole].slice();


            const card =
                parseUnoCard(cardStr);

            let nextTurn =
                opponentRole;


            if (card.type === "draw2") {

                const drawResult =
                    drawUnoCards(deck, discard, 2);

                deck = drawResult.deck;

                discard = drawResult.discard;

                opponentHand =
                    opponentHand.concat(
                        drawResult.drawn
                    );

                nextTurn = myRole;

            } else if (card.type === "wild4") {

                const drawResult =
                    drawUnoCards(deck, discard, 4);

                deck = drawResult.deck;

                discard = drawResult.discard;

                opponentHand =
                    opponentHand.concat(
                        drawResult.drawn
                    );

                nextTurn = myRole;

            } else if (
                card.type === "skip" ||
                card.type === "reverse"
            ) {

                nextTurn = myRole;

            }


            const updates = {

                deck: deck,

                discard: discard,

                currentColor: chosenColor,

                turn: nextTurn

            };

            updates["hands/" + myRole] =
                myHand;

            updates["hands/" + opponentRole] =
                opponentHand;


            if (myHand.length === 0) {

                updates.status = "finished";

                updates.winner = myRole;

            }


            unoRoomRef.update(updates);

        }
    );

}


// =========================
// KARTE ZIEHEN
// =========================

unoDrawPile.addEventListener(
    "click",
    function() {

        if (
            unoDrawPile.classList.contains(
                "disabled"
            )
        ) {

            return;

        }


        unoRoomRef.once("value").then(
            function(snapshot) {

                const room =
                    snapshot.val();

                if (
                    !room ||
                    room.status !== "playing" ||
                    room.turn !== unoSession.role
                ) {

                    return;

                }


                const myRole =
                    unoSession.role;

                const opponentRole =
                    myRole === "p1" ? "p2" : "p1";


                const drawResult =
                    drawUnoCards(
                        room.deck.slice(),
                        room.discard.slice(),
                        1
                    );

                const myHand =
                    room.hands[myRole]
                        .concat(drawResult.drawn);


                const updates = {

                    deck: drawResult.deck,

                    discard: drawResult.discard,

                    turn: opponentRole

                };

                updates["hands/" + myRole] =
                    myHand;


                unoRoomRef.update(updates);

            }
        );

    }
);


function drawUnoCards(deck, discard, count) {

    let workingDeck = deck.slice();

    let workingDiscard = discard.slice();

    let drawn = [];


    for (let i = 0; i < count; i++) {

        if (workingDeck.length === 0) {

            const topCard =
                workingDiscard.pop();

            workingDeck = workingDiscard;

            workingDiscard = [topCard];


            for (
                let j = workingDeck.length - 1;
                j > 0;
                j--
            ) {

                const k =
                    Math.floor(
                        Math.random() * (j + 1)
                    );

                const temp = workingDeck[j];

                workingDeck[j] = workingDeck[k];

                workingDeck[k] = temp;

            }

        }


        if (workingDeck.length === 0) {

            break;

        }


        drawn.push(
            workingDeck.pop()
        );

    }


    return {
        deck: workingDeck,
        discard: workingDiscard,
        drawn: drawn
    };

}


// =========================
// UNO RUFEN
// =========================

unoCallButton.addEventListener(
    "click",
    function() {

        unoCallButton.classList.add(
            "uno-call-flash"
        );

        setTimeout(function() {

            unoCallButton.classList.remove(
                "uno-call-flash"
            );

        }, 600);


        if (unoRoomRef) {

            unoRoomRef.child("lastCall").set({

                by: unoSession.role,

                at: Date.now()

            });

        }

    }
);


// =========================
// NEUES SPIEL NACH ENDE
// =========================

unoRestartButton.addEventListener(
    "click",
    function() {

        unoRoomRef.once("value").then(
            function(snapshot) {

                const room =
                    snapshot.val();

                if (!room) {

                    return;

                }

                startNewUnoRound(room);

            }
        );

    }
);
