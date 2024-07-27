const socket = io.connect('https://your-app-name.herokuapp.com');
let playerName;
let gameCode;
let playerRole;

function showCreateGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('create').style.display = 'block';
}

function showJoinGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('join').style.display = 'block';
}

function goBack() {
    document.getElementById('create').style.display = 'none';
    document.getElementById('join').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

function createGame() {
    playerName = document.getElementById('createName').value;
    fetch('/create', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        gameCode = data.game_code;
        document.getElementById('create').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
        document.getElementById('lobbyGameCode').textContent = gameCode;
        addPlayerToList(playerName);
        socket.emit('join_lobby', { game_code: gameCode, name: playerName });
    });
}

function joinGame() {
    playerName = document.getElementById('joinName').value;
    gameCode = document.getElementById('gameCode').value;
    fetch('/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: playerName, game_code: gameCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('join').style.display = 'none';
            document.getElementById('lobby').style.display = 'block';
            document.getElementById('lobbyGameCode').textContent = gameCode;
            data.players.forEach(addPlayerToList);
            socket.emit('join_lobby', { game_code: gameCode, name: playerName });
        } else {
            alert('Game not found');
        }
    });
}

function addPlayerToList(name) {
    const playerList = document.getElementById('playerList');
    const playerItem = document.createElement('li');
    playerItem.textContent = name;
    playerList.appendChild(playerItem);
}

function startGame() {
    const roles = ['mafia', 'doctor', 'detective', 'villager', 'villager'];
    fetch('/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game_code: gameCode, roles: roles })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('lobby').style.display = 'none';
        document.getElementById('reveal').style.display = 'block';
        playerRole = data.roles[playerName];
        socket.emit('game_started', { game_code: gameCode });
    });
}

function revealRole() {
    document.getElementById('reveal').style.display = 'none';
    document.getElementById('role').style.display = 'block';
    document.getElementById('roleName').textContent = playerRole;
}

function submitAction() {
    const action = prompt("Enter your action:");
    socket.emit('night_action', { player: playerName, action: action, game_code: gameCode });
}

socket.on('player_joined', (name) => {
    addPlayerToList(name);
});

socket.on('update', (data) => {
    console.log('Game update:', data);
});

socket.on('game_started', () => {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('reveal').style.display = 'block';
});

