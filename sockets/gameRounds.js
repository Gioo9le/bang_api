//Strutture dati
function RoomCondition(){
    this.playersData=[];
    this.numPlayer = 0;
    this.currentTurn = 0;
    this.deck = [
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
    this.isPermanent = [
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
    this.cowboysDeck = [
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
    ];
    this.discarded = [];
    this.isPlaying = false;
    this.sockets = [];
    this.semeEstratto = -1;
    this.numeroEstratto = -1;
    this.gameState = 0;

}
function PlayerData(name){
    this.Name = name;
    this.Cowboy = -1;
    this.handCard = [];
    this.playedCard = [];
    this.nHandCard = 0;
    this.bullets = 5;
    this.role = -1;
    this.mirino = 0;
    this.mustang = 0;
    this.sight = 1;
    this.nonPermanentCard = -1;
    this.isTarget = false;
}

let CardNames = [
    "bang",
    "barile",
    "birra",
    "carabine",
    "catbalou",
    "diligenza",
    "dinamite",
    "duello",
    "emporio",
    "gatling",
    "indiani",
    "mancato",
    "mirino",
    "mustang",
    "panico",
    "prigione",
    "remington",
    "saloon",
    "schofield",
    "volcanic",
    "wellsfargo",
    "winchester"
]
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

let initialBullets = [
    4,
    4,
    4,
    3,
    4,
    4,
    4,
    4,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    4
]

let message = [];

let cardsFunction = [
    function bang(currRoom, senderId, receiverId) {
        currRoom.playersData[receiverId].isTarget = true;
        //currRoom.playersData[receiverId].bullets--;
        //TODO wait for receiver to play a mancato
        //TODO set
    },
    function barile(currRoom, senderId, receiverId) {
        //TODO
    },
    function birra(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].bullets = currRoom.playersData[senderId].bullets<5?currRoom.playersData[senderId].bullets+1:currRoom.playersData[senderId].bullets;
    },
    function carabine(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].sight = 4;
    },
    function catbalou(currRoom, senderId, receiverId) {
        currRoom.playersData[receiverId].isTarget = true;
        currRoom.discarded.push(currRoom.playersData[receiverId].handCard.splice(getRandomInt(0, currRoom.playersData[receiverId].length), 1));
        //TODO
    },
    function diligenza(currRoom, senderId, receiverId) {
        let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[senderId].handCard.push(drawnCard);
        currRoom.playersData[senderId].nHandCard++;
        console.log("player "+senderId+" drawn the card "+ drawnCard);
        message = currRoom.playersData[senderId].Name + " ha pescato una carta";

        drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[senderId].handCard.push(drawnCard);
        currRoom.playersData[senderId].nHandCard++;
        console.log("player "+senderId+" drawn the card "+ drawnCard);
        message = currRoom.playersData[senderId].Name + " ha pescato una carta";
    },
    function dinamite(currRoom, senderId, receiverId) {
        //TODO
    },
    function duello(currRoom, senderId, receiverId) {
        currRoom.playersData[receiverId].isTarget = true;
        //TODO
    },
    function emporio(currRoom, senderId, receiverId) {
        //TODO
    },
    function gatling(currRoom, senderId, receiverId) {
        //TODO
    },
    function indiani(currRoom, senderId, receiverId) {
        //TODO
    },
    function mancato(currRoom, senderId, receiverId) {
        //TODO
    },
    function mirino(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].mirino = -1;
    },
    function mustang(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].mustang = +1;
    },
    function panico(currRoom, senderId, receiverId) {
        currRoom.playersData[receiverId].isTarget = true;
        //TODO
    },
    function prigione(currRoom, senderId, receiverId) {
        currRoom.playersData[receiverId].isTarget = true;
        //TODO
    },
    function remington(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].sight = 3;
    },
    function saloon(currRoom, senderId, receiverId) {
        currRoom.playersData.forEach((value => {
            value.bullets<5? value.bullets++: {};
        }))
    },
    function schofield(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].sight = 2;
    },
    function volcanic(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].sight = 1;
    },
    function wellsFargo(currRoom, senderId, receiverId) {
        let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[senderId].handCard.push(drawnCard);
        currRoom.playersData[senderId].nHandCard++;
        console.log("player "+senderId+" drawn the card "+ drawnCard);
        message = currRoom.playersData[senderId].Name + " ha pescato una carta";

        drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[senderId].handCard.push(drawnCard);
        currRoom.playersData[senderId].nHandCard++;
        console.log("player "+senderId+" drawn the card "+ drawnCard);
        message = currRoom.playersData[senderId].Name + " ha pescato una carta";

        drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[senderId].handCard.push(drawnCard);
        currRoom.playersData[senderId].nHandCard++;
        console.log("player "+senderId+" drawn the card "+ drawnCard);
        message = currRoom.playersData[senderId].Name + " ha pescato una carta";
    },
    function winchester(currRoom, senderId, receiverId) {
        currRoom.playersData[senderId].sight = 5;
    }
];



//Connection variables

let myIo;

function playerEntered(socket, name, room){
    if(!rooms.has(room)){
        rooms.set(room, new RoomCondition());
    }
    let currRoom = rooms.get(room);
    currRoom.sockets.push(socket.id);
    socket.join(room);
    currRoom.numPlayer++;
    let newPlayer = new PlayerData(name);
    currRoom.playersData.push(newPlayer);
    message = "E' entrato un nuovo giocatore: "+name;
    myIo.in(room).emit("dataChanged", currRoom, message);
    socket.emit('forLauncher', currRoom.numPlayer-1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}

function drawACard(playerId, room) {
    let currRoom = rooms.get(room);
    let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
    currRoom.playersData[playerId].handCard.push(drawnCard);
    currRoom.playersData[playerId].nHandCard++;
    console.log("player "+playerId+" drawn the card "+ drawnCard);
    message = currRoom.playersData[playerId].Name + " ha pescato una carta";
    myIo.in(room).emit("dataChanged", currRoom, message);
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
                console.log(socketS+"=="+socket.id);
                return socketS==socket.id;
            });
            console.log("Index of the socket ");
            console.log(playerExitedId);
            currRoom.sockets.splice(playerExitedId, 1);
            let exitingPlayer = currRoom.playersData.splice(playerExitedId, 1)[0];
            currRoom.discarded.push(exitingPlayer.handCard);
            currRoom.discarded.push(exitingPlayer.playedCard);
            currRoom.discarded = currRoom.discarded.flat(5);
            console.log(currRoom.discarded);
            console.log("Remaining "+currRoom.numPlayer);
            message = exitingPlayer.Name + " ha lasciato il tavolo";
            myIo.in(value).emit("dataChanged", currRoom, message);
            myIo.in(value).emit("playerLeft", playerExitedId);
            if(playerExitedId==currRoom.currentTurn){
                currRoom.currentTurn = (currRoom.currentTurn-1)%(currRoom.numPlayer);
                myIo.to(value).emit('nextTurn', currRoom.currentTurn);
            }
            if(currRoom.numPlayer<=0){
                rooms.set(value, new RoomCondition());
            }

        }

    };

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let lastTimeout;

function onCardPlayed(socket, userId, cardId, receiverId, room){
    let currRoom = rooms.get(room);

    console.log("Tutte le carte giocate:");

    let cardPlayed = currRoom.playersData[userId].handCard.splice(cardId, 1)[0];
    cardsFunction[cardPlayed](currRoom, userId, receiverId);
    if(currRoom.isPermanent[cardPlayed]) {
        if(cardPlayed == 15){
            currRoom.playersData[receiverId].playedCard.push(cardPlayed);
            clearTimeout(lastTimeout);
            lastTimeout = setTimeout(()=>{
                currRoom.playersData.forEach((value)=>{value.isTarget=false});
                myIo.in(room).emit("dataChanged", currRoom, message);
            }, 5000)
        }else{
            currRoom.playersData[userId].playedCard.push(cardPlayed);
        }
    }else{
        clearTimeout(lastTimeout);
        if(currRoom.playersData[userId].nonPermanentCard != -1){
            currRoom.discarded.push(currRoom.playersData[userId].nonPermanentCard);
            currRoom.playersData[userId].nonPermanentCard = -1;
            //currRoom.playersData.forEach((value)=>{value.isTarget=false});
        }
        currRoom.playersData[userId].nonPermanentCard = cardPlayed;
        lastTimeout = setTimeout(()=>{
            if(currRoom.playersData[userId].nonPermanentCard != -1){
                currRoom.discarded.push(currRoom.playersData[userId].nonPermanentCard);
            }
            currRoom.playersData[userId].nonPermanentCard = -1;
            currRoom.playersData.forEach((value)=>{value.isTarget=false});
            currRoom.playersData.forEach((value)=>{
                if(value.nonPermanentCard!=-1){
                    currRoom.discarded.push(value.nonPermanentCard);
                    value.nonPermanentCard = -1
                }

            })
            myIo.in(room).emit("dataChanged", currRoom, message);
        }, 5000)
    }
    currRoom.playersData[userId].nHandCard--;
    console.log(currRoom.playersData[userId].Name + " ha giocato "+ capitalizeFirstLetter(CardNames[cardPlayed]));
    //console.log(currRoom.playersData[receiverId].isTarget);
    message = currRoom.playersData[userId].Name + " ha giocato "+ capitalizeFirstLetter(CardNames[cardPlayed]);

    myIo.in(room).emit("dataChanged", currRoom, message);

}

function nextTurn(room){
    let currRoom = rooms.get(room);
    let lastTurn = currRoom.currentTurn;
    if(currRoom.playersData[lastTurn].nHandCard > currRoom.playersData[lastTurn].bullets){
        message = currRoom.playersData[lastTurn].Name + " non puo' passare perche' ha piu' carte che proiettili ";
    }else{
        currRoom.currentTurn = (currRoom.currentTurn+1)%(currRoom.numPlayer);
        message = currRoom.playersData[lastTurn].Name + " ha passato, adesso tocca a " + currRoom.playersData[currRoom.currentTurn].Name;
    }
    myIo.in(room).emit("dataChanged", currRoom, message);
}

function cardDiscarded(socket, playerId, cardPosition, isHand, room){
    let currRoom = rooms.get(room);
    let cardDiscardedId
    if(isHand){
        cardDiscardedId = currRoom.playersData[playerId].handCard.splice(cardPosition, 1)[0];
    }else{
        cardDiscardedId = currRoom.playersData[playerId].playedCard.splice(cardPosition, 1)[0];
    }

    currRoom.discarded.push(cardDiscardedId);
    message = currRoom.playersData[playerId].Name + " ha scartato " + CardNames[cardDiscardedId];
    myIo.in(room).emit("dataChanged", currRoom, message);
    myIo.in(room).emit("cardDiscarded", currRoom.discarded, message);
    console.log("user "+ playerId + " discarded the card "+ cardDiscardedId);
    console.log(currRoom.discarded);
}

function drawDiscarded(socket, playerId, discardedPosition, room){
    let currRoom = rooms.get(room);
    let cardDrawedId = currRoom.discarded[discardedPosition];
    currRoom.playersData[playerId].handCard.push(currRoom.discarded.splice(discardedPosition, 1)[0]);
    currRoom.playersData[playerId].nHandCard++;
    message = currRoom.playersData[playerId].Name + " ha pescato dagli scarti " + CardNames[cardDrawedId];
    myIo.in(room).emit("dataChanged", currRoom, message);
    myIo.in(room).emit("drawDiscarded");
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
    currRoom.playersData.forEach((val, idx)=>{
        val.role = roles[idx];
    });
    console.log("Roles: "+roles);
    message = "Inizio della partita";
    myIo.to(room).emit('beginGame');
    myIo.in(room).emit("dataChanged", currRoom, message);
    currRoom.isPlaying = true;
}

function lifeChanged(socket, playerId, newLife, room){
    let currRoom = rooms.get(room);

    newLife = Math.min(newLife,initialBullets[currRoom.playersData[playerId].Cowboy])
        currRoom.playersData[playerId].bullets=newLife;
    message = "Le pallottole di " + currRoom.playersData[playerId].Name + " sono diventate " + newLife;
    myIo.in(room).emit("dataChanged", currRoom, message);
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
    currRoom.playersData[playerId].Cowboy = cowboy;
    currRoom.playersData[playerId].bullets = initialBullets[cowboy];
    for(let i=0; i<currRoom.playersData[playerId].bullets; i++) {
        let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
        currRoom.playersData[playerId].handCard.push(drawnCard);
        currRoom.playersData[playerId].nHandCard++;
        console.log("player "+playerId+" drawn the card "+ drawnCard);
    }
    myIo.in(room).emit("dataChanged", currRoom, message);
}

function extractCard(socket, room){
    let currRoom = rooms.get(room);
    let drawnCard = currRoom.deck.splice(getRandomInt(0, currRoom.deck.length), 1)[0];
    currRoom.discarded.push(drawnCard);
    currRoom.semeEstratto = getRandomInt(0, 4);//0:Quadri,1:picche,2:cuori,3:fiori
    currRoom.numeroEstratto = getRandomInt(1, 13);
    let nomiSemi = ["Fiori", "Picche", "Quadri", "Cuori"];
    let nomiNumeri = ["Err","Asso", 'Due', "Tre", "Quattro", "Cinque", "Sei", "Sette", "Otto", "Nove", "Dieci", "Jack", "Donna", "Re"];
    message = "E' stata estratta la carta " + nomiNumeri[currRoom.numeroEstratto] + " di " + nomiSemi[currRoom.semeEstratto];
    myIo.in(room).emit("cardExtracted", currRoom.discarded);
    myIo.in(room).emit("dataChanged", currRoom, message);
}

function giveCard(socket, sender, cardIdx, receiver, isHand, room){
    let currRoom = rooms.get(room);
    let givenCard
    if(isHand){
        givenCard = currRoom.playersData[sender].handCard.splice(cardIdx, 1).flat(5);
    }else{
        givenCard = currRoom.playersData[sender].playedCard.splice(cardIdx, 1).flat(5);

    }
    currRoom.playersData[(sender + receiver) % (currRoom.numPlayer)].handCard.push(givenCard);
    currRoom.playersData[(sender + receiver) % (currRoom.numPlayer)].nHandCard++;
    message = currRoom.playersData[sender].Name + " ha passato una carta a " + currRoom.playersData[receiver].Name;
    myIo.in(room).emit("dataChanged", currRoom, message);
}

//Switch
function socket_io(io) {
    try {
        myIo = io;
        //io.on('cardPlayed', (userId, cardId)=>{onCardPlayed(userId, cardId)});

        io.on('connection', function(socket){
            socket.on('disconnecting', ()=>{playerLeaving(socket)});
            socket.on('playerEntered', (name, room)=>{playerEntered(socket, name, room)});
            socket.on('beginGame',(room)=>{beginGame(socket, room)});
            socket.on('cardPlayed', (userId, cardId, receiverId, room)=>{onCardPlayed(socket, userId, cardId, receiverId, room)});
            socket.on('getGameBoard', () =>{getGameBoard()});
            socket.on('cardDrawn', (playerId, room) => {drawACard(playerId, room)});
            socket.on('nextTurn', (room) => {nextTurn(room)});
            socket.on('cardDiscarded', (playerId, cardPosition, isHand, room)=>{cardDiscarded(socket, playerId, cardPosition, isHand, room)});
            socket.on('drawDiscarded', (playerId, discardedPosition, room)=>(drawDiscarded(socket, playerId, discardedPosition, room)));
            socket.on('lifeChanged', (playerId, newLife, room)=>{lifeChanged(socket,playerId, newLife, room)});
            socket.on('checkIsPlaying', (room)=>{socket.emit('isPlaying',rooms.has(room)?rooms.get(room).isPlaying:false)});
            socket.on('drawCowboys', (playerId, room)=>{drawCowboys(socket, playerId, room)})
            socket.on('cowBoyChoosen', (playerId, cowboy, room)=>{setCowboy(socket, playerId, cowboy, room)});
            socket.on('cardExtracted', (room)=>{extractCard(socket, room)})
            socket.on('cardGiven', (sender, cardIdx, receiver, isHand, room)=>giveCard(socket, sender, cardIdx, receiver, isHand, room));
        })
    }catch (e) {
        console.log(e)
    }

}

module.exports.sock = socket_io;