//Strutture dati
let numPlayer = 0;
let handCards = [[], [], [], [], [], []];
let playedCards = [[], [], [], [], [], [], []];
let stats = [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]];
let currentTurn = 0;
let deck = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, //25 Bang
    1, 1,
    2, 2, 2, 2, 2, 2,
    3,
    4, 4, 4, 4,
    5, 5,
    6,
    7, 7, 7,
    8, 8,
    9,
    10, 10,
    11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
    12,
    13, 13,
    14, 14, 14, 14,
    15, 15, 15,
    16,
    17,
    18, 18, 18,
    19, 19,
    20,
    21,
];
let discarded = [];
let isPermanent = [
    false,//Bang
    true,//Barile
    false,//Birra
    true,//Carabina
    false,//Catbalou
    false,//Diligenza
    true,//Dinamite
    false,//Duello
    false,//Emporio
    false,//Gatling
    false,//Indiani
    false,//Mancato
    true,//Mirino
    true,//Mustang
    false,//Panico
    true,//Prigione
    true,//Remington
    false,//Saloon
    true,//Schofield
    true,//Volcanic
    false,//WellsFargo
    true,//Winchester
];

//Connection variables

let myIo;

module.exports.gameBoard = {
    numPlayer: numPlayer,
    handCards: handCards,
    playedCards: playedCards,
    stats: stats,
    currentTurn: currentTurn,
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}

function drawACard(playerId) {
    let drawnCard = deck.splice(getRandomInt(0, deck.length), 1)[0];
    handCards[playerId].push(drawnCard);
    console.log("player "+playerId+" drawn the card "+ drawnCard);
    myIo.emit('cardDrawn', playerId, drawnCard);
}

//Metodi
function getGameBoard() {
    
}

function playerLeft() {
    console.log('player left');
    numPlayer--;
    if(numPlayer<=0){
        numPlayer=0;
        currentTurn=0;
    }
    myIo.emit('playerLeft');
    console.log("Connected players: " + numPlayer/2);
}

function playerEntered(socket, name){
    console.log('player '+name+' entered');
    //myIo.emit('playerEntered');
    socket.emit('forLauncher', numPlayer/2);
    //Disconnect is fired two times
    numPlayer++;
    numPlayer++;
    socket.broadcast.emit('exceptForLauncher', name);
    myIo.emit("playerEntered", numPlayer/2);
    myIo.emit('nextTurn', currentTurn);
    console.log("Connected players: " + numPlayer/2);
}

function onCardPlayed(socket, userId, cardAbsId, cardId){
    console.log("User "+userId+" played the card "+cardAbsId+".");
    console.log("Tutte le carte giocate:");
    console.log(playedCards);
    playedCards[userId].push(handCards[userId].splice(cardId, 1)[0]);
    socket.broadcast.emit('cardPlayed', userId, cardAbsId, playedCards, handCards);
}

function nextTurn(){
    currentTurn = (currentTurn+1)%(numPlayer/2);
    myIo.emit('nextTurn', currentTurn);
    console.log("Now is the turn of"+currentTurn);
}

function cardDiscarded(socket, playerId, cardPosition){
    cardDiscardedId = playedCards[playerId].splice(cardPosition, 1);
    discarded.push(cardDiscardedId);
    socket.broadcast.emit('cardDiscarded', playerId, cardDiscardedId, playedCards);
    console.log("user "+ playerId + " discarded the card "+ cardDiscardedId);
    console.log(discarded);
}

//Switch
function socket_io(io) {
    myIo = io;
    //io.on('cardPlayed', (userId, cardId)=>{onCardPlayed(userId, cardId)});

    io.on('connection', function(socket){
        socket.on('disconnect', ()=>{playerLeft()});
        socket.on('playerEntered', (name)=>{playerEntered(socket, name)});
        socket.on('cardPlayed', (userId, cardAbsId, cardId)=>{onCardPlayed(socket, userId, cardAbsId, cardId)});
        socket.on('getGameBoard', () =>{getGameBoard()});
        socket.on('cardDrawn', (playerId) => {drawACard(playerId)});
        socket.on('nextTurn', () => {nextTurn()});
        socket.on('cardDiscarded', (playerId, cardPosition)=>{cardDiscarded(socket, playerId, cardPosition)});
    })
}

module.exports.sock = socket_io;