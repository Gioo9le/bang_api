//Strutture dati
let initialCondition ={
    playerNames: [],
    cowboyChoosen: [],
    numPlayer:0,
    handCards:[],
    playedCards:[],
    stats:[],
    currentTurn:0,
    deck:[
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
    ],
    cowboysDeck:[
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
    ],
    discarded:[],
    isPlaying:false
};
let initialRoles = [0, 1, 2, 2, 3, 2, 3];
let rooms = new Map();
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}

function drawACard(playerId, room) {
    let currRoom = rooms.get(room);
    let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
    currRoom.handCards[playerId].push(drawnCard);
    currRoom.stats[playerId][1]++;
    console.log("player "+playerId+" drawn the card "+ drawnCard);
    myIo.to(room).emit('cardDrawn', playerId, drawnCard);
    myIo.to(room).emit('statsChanged', currRoom.stats);
}

function playerLeaving(socket) {
    console.log("The player is leaving");
    console.log(socket.rooms);
    console.log(typeof socket.rooms);
    let roomToEmit;
    let playerExitedId;
    for (const [key, value] of Object.entries(socket.rooms)) {
        if(rooms.has(value)){
            let currRoom = rooms.get(value);
            roomToEmit = value;
            currRoom.numPlayer--;
            playerExitedId = currRoom.sockets.findIndex((socketS)=>{
                console.log(socketS.id+"=="+socket.id);
                return socketS.id==socket.id;
            });
            console.log("Index of the socket ");
            console.log(playerExitedId);
            currRoom.sockets.splice(playerExitedId, 1);
            currRoom.playerNames.splice(playerExitedId, 1);
            currRoom.stats.splice(playerExitedId, 1);
            currRoom.discarded.push(currRoom.playedCards.splice(playerExitedId, 1));
            currRoom.discarded.push(currRoom.handCards.splice(playerExitedId, 1));
            currRoom.discarded = currRoom.discarded.flat(5);
            console.log(currRoom.discarded);
            console.log(currRoom.playerNames);
            console.log("Remaining "+currRoom.numPlayer);
            myIo.to(roomToEmit).emit('playerLeft', playerExitedId, currRoom.playerNames, currRoom.playedCards, currRoom.numPlayer, currRoom.discarded);
            if(playerExitedId==currRoom.currentTurn){
                currRoom.currentTurn = (currRoom.currentTurn-1)%(currRoom.numPlayer);
                myIo.to(value).emit('nextTurn', currRoom.currentTurn);
            }
            if(currRoom.numPlayer<=0){
                let copyCondition =  JSON.parse(JSON.stringify(initialCondition));
                copyCondition.sockets = [];
                rooms.set(value, copyCondition);
            }

        }

    };

}

function playerEntered(socket, name, room){
    if(!rooms.has(room)){
        let copyCondition =  JSON.parse(JSON.stringify(initialCondition));
        copyCondition.sockets = [];
        rooms.set(room, copyCondition);
    }
    let currRoom = rooms.get(room);
    currRoom.sockets.push(socket);
    console.log(socket.id);
    console.log('player '+name+' entered');
    console.log('in room '+room);
    socket.join(room);
    console.log(socket.rooms);
    currRoom.numPlayer++;
    currRoom.playerNames.push(name);
    socket.emit('forLauncher', currRoom.numPlayer-1, currRoom.playerNames);
    socket.in(room).broadcast.emit('exceptForLauncher', name, currRoom.playerNames);
    currRoom.playedCards.push([]);
    currRoom.handCards.push([]);
    currRoom.stats.push([5, 0]);
    currRoom.cowboyChoosen.push(-1);
    console.log("CowboyChoosen:"+currRoom.cowboyChoosen);
    myIo.in(room).emit("playerIsEntered", currRoom.numPlayer, currRoom.playedCards, currRoom.discarded, currRoom.stats, currRoom.cowboyChoosen);
    myIo.in(room).emit('nextTurn', currRoom.currentTurn);
    console.log("Connected players: " + currRoom.numPlayer+ " in room"+ room);
}

function onCardPlayed(socket, userId, cardAbsId, cardId, room){
    let currRoom = rooms.get(room);
    console.log("User "+userId+" played the card "+cardAbsId+".");
    console.log("Tutte le carte giocate:");
    console.log(currRoom.playedCards);
    currRoom.playedCards[userId].push(currRoom.handCards[userId].splice(cardId, 1)[0]);
    currRoom.stats[userId][1]--;
    myIo.to(room).emit("statsChanged", currRoom.stats);
    socket.to(room).broadcast.emit('cardPlayed', userId, cardAbsId, currRoom.playedCards, currRoom.handCards);

}

function nextTurn(room){
    let currRoom = rooms.get(room);
    currRoom.currentTurn = (currRoom.currentTurn+1)%(currRoom.numPlayer);
    myIo.to(room).emit('nextTurn', currRoom.currentTurn);
    console.log("Now is the turn of"+currRoom.currentTurn);
}

function cardDiscarded(socket, playerId, cardPosition, room){
    let currRoom = rooms.get(room);
    let cardDiscardedId = currRoom.playedCards[playerId].splice(cardPosition, 1)[0];
    currRoom.discarded.push(cardDiscardedId);
    socket.to(room).broadcast.emit('cardDiscarded', playerId, cardDiscardedId, currRoom.playedCards, currRoom.discarded);
    console.log("user "+ playerId + " discarded the card "+ cardDiscardedId);
    console.log(currRoom.discarded);
}

function drawDiscarded(socket, playerId, discardedPosition, room){
    let currRoom = rooms.get(room);
    let cardDrawedId = currRoom.discarded[discardedPosition];
    currRoom.handCards[playerId].push(currRoom.discarded.splice(discardedPosition, 1)[0])
    currRoom.stats[playerId][1]++;
    socket.to(room).broadcast.emit("drawDiscarded", playerId, currRoom.discarded, cardDrawedId, currRoom.stats);
}

function shuffle(array) {
    let i = array.length-1;
    for(; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
        return array;
    }
}

function beginGame(socket, room) {
    let currRoom = rooms.get(room);
    let roles = initialRoles.slice(0,currRoom.numPlayer);
    roles = shuffle(roles);
    console.log("Roles: "+roles);
    myIo.to(room).emit('beginGame', roles);
    currRoom.isPlaying = true;
}

function lifeChanged(socket, playerId, newLife, room){
    let currRoom = rooms.get(room);
    currRoom.stats[playerId][0]=newLife;
    myIo.to(room).emit("statsChanged", currRoom.stats);
}

function drawCowboys(socket, playerID, room) {
    console.log("Sending two cards");
    let currRoom = rooms.get(room);
    let firstCard = currRoom.cowboysDeck.splice(getRandomInt(0, currRoom.cowboysDeck.length), 1)[0];
    let secondCard = currRoom.cowboysDeck.splice(getRandomInt(0, currRoom.cowboysDeck.length), 1)[0];
    socket.emit('pickCowboyCard', firstCard, secondCard);
}

function setCowboy(socket, playerId, cowboy, room) {
    let currRoom = rooms.get(room);
    currRoom.cowboyChoosen[playerId] = cowboy;
    myIo.to(room).emit("cowboyChanged", currRoom.cowboyChoosen);
}

function extractCard(socket, room){
    let currRoom = rooms.get(room);
    let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
    currRoom.discarded.push(drawnCard);
    seme = getRandomInt(0, 4);//0:Quadri,1:picche,2:cuori,3:fiori
    numero = getRandomInt(0, 12);

    myIo.to(room).emit('cardExtracted', currRoom.discarded, seme, numero);
}

function giveCard(socket, sender, cardIdx, receiver, room){
    let currRoom = rooms.get(room);
    let givenCard = currRoom.playedCards[sender].splice(cardIdx, 1).flat(5);
    currRoom.handCards[(sender+receiver)%(currRoom.numPlayer)].push(givenCard);
    currRoom.stats[(sender+receiver)%(currRoom.numPlayer)][1]++;
    myIo.to(room).emit("statsChanged", currRoom.stats);
    myIo.to(room).emit('cardDrawn', (sender+receiver)%(currRoom.numPlayer), givenCard);
    myIo.to(room).emit('playedChanged', currRoom.playedCards);
}

//Switch
function socket_io(io) {
    myIo = io;
    //io.on('cardPlayed', (userId, cardId)=>{onCardPlayed(userId, cardId)});

    io.on('connection', function(socket){
        socket.on('disconnecting', ()=>{playerLeaving(socket)});
        socket.on('playerEntered', (name, room)=>{playerEntered(socket, name, room)});
        socket.on('beginGame',(room)=>{beginGame(socket, room)});
        socket.on('cardPlayed', (userId, cardAbsId, cardId, room)=>{onCardPlayed(socket, userId, cardAbsId, cardId, room)});
        socket.on('getGameBoard', () =>{getGameBoard()});
        socket.on('cardDrawn', (playerId, room) => {drawACard(playerId, room)});
        socket.on('nextTurn', (room) => {nextTurn(room)});
        socket.on('cardDiscarded', (playerId, cardPosition, room)=>{cardDiscarded(socket, playerId, cardPosition, room)});
        socket.on('drawDiscarded', (playerId, discardedPosition, room)=>(drawDiscarded(socket, playerId, discardedPosition, room)));
        socket.on('lifeChanged', (playerId, newLife, room)=>{lifeChanged(socket,playerId, newLife, room)});
        socket.on('checkIsPlaying', (room)=>{socket.emit('isPlaying',rooms.has(room)?rooms.get(room).isPlaying:false)});
        socket.on('drawCowboys', (playerId, room)=>{drawCowboys(socket, playerId, room)})
        socket.on('cowBoyChoosen', (playerId, cowboy, room)=>{setCowboy(socket, playerId, cowboy, room)});
        socket.on('cardExtracted', (room)=>{extractCard(socket, room)})
        socket.on('cardGiven', (sender, cardIdx, receiver, room)=>giveCard(socket, sender, cardIdx, receiver, room));
    })
}

module.exports.sock = socket_io;