const {Room, Role, Player, Merlin, Percival, LoyalServant, Mordred, Morgana, Assassin, MinionOfMordred, Oberon} = require('./gameClasses.js');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public')); // 'public' 是存放静态文件的文件夹

// 当用户访问根URL时，发送webpage.html文件
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/webpage.html');
});

let room = new Room(); // 存储游戏房间

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (playerName) => {
        // 检查 playerName 是否有效（非空且不重复）
        const isJoinSuccessful = room.addPlayer(playerName, socket.id);
        socket.emit('joinGameResponse', isJoinSuccessful);

        // 如果加入成功，可能还需要更新所有客户端的玩家列表
        if (isJoinSuccessful === 0) {
            updateAllPlayersList();
        }
    });

    function updateAllPlayersList() {
        var playerNames = room.players.map(player => player.name); // 假设你有一个Room实例叫room
        io.emit('updatePlayerList', playerNames); // 向所有客户端发送更新
    }

    socket.on('startGameRequest', () => {
        // 分配角色，假设 room 是一个 Room 实例
        const isStartSuccessful = room.initializeGame();
        if (isStartSuccessful) {
            io.emit('gameStartResponse');
            room.players.forEach(player => {
                // 向每个玩家发送他们的角色和技能效果
                io.to(player.socketId).emit('showId', player.name);
                console.log(`Sent id to ${player.socketId}:`, player.name);
                io.to(player.socketId).emit('showRole', player.role);
                console.log(`Sent Role to ${player.socketId}:`, player.role);
                io.to(player.socketId).emit('showSkill', player.useSkill(room.players));
                console.log(`Sent Skill to ${player.socketId}`, player.useSkill(room.players));
            });
        } else {
            // 显示错误信息
            io.emit('gameStartFail');
        }
    });

    socket.on('restartGame', () => {
        // 重置房间信息和玩家状态
        // 假设 `resetGame` 是一个实现重置逻辑的函数
        room.restartGame();

        // 可以向所有客户端广播重置事件，如果需要
        io.emit('gameReset');
    });

});

const PORT = 3000; // 或者您选择的其他端口
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});