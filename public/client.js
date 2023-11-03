const socket = io();

// 加入游戏的函数
function joinGame() {
    var playerName = document.getElementById('playerName').value;
    var password = document.getElementById('password').value;
    socket.emit('joinGame', playerName, password);
}

// 刷新页面，重新加入游戏的函数
function reconnect() {
    var playerName = document.getElementById('playerName').value;
    var password = document.getElementById('password').value;
    socket.emit('Iamback', playerName, password);
}

// 刷新页面
function fresh() {
    socket.emit('fresh');
}

// 开始游戏的函数
function startGame() {
    socket.emit('startGameRequest');
}

function updatePlayerList(players) {
    var playerListElement = document.getElementById('playerList');
    playerListElement.innerHTML = ''; // 清空现有的列表

    // 为每个玩家创建一个列表项并添加到列表中
    players.forEach((playerName) => {
        var listItem = document.createElement('li');
        listItem.textContent = playerName;
        playerListElement.appendChild(listItem);
    });
}

function restartGame() {
    // 通知服务器重置游戏
    socket.emit('restartGame');
}

//公开投票
function publicvote() {
    // 获取下拉菜单的值
    var vote = document.getElementById('publicvoteSelect').value;
    socket.emit('publicvote', vote)
}

//匿名投票
function privatevote() {
    // 获取下拉菜单的值
    var vote = document.getElementById('privatevoteSelect').value;
    socket.emit('privatevote', vote)
}



// 接收服务器对加入游戏请求的响应
socket.on('joinGameResponse', (isJoinSuccessful) => {
    if (isJoinSuccessful === 0) {
        // 关闭玩家名输入界面，打开玩家列表界面
        document.getElementById('player-name-input').style.display = 'none';
        document.getElementById('player-list').style.display = 'block';
        document.getElementById('game-start-restart').style.display = 'block';
    } 
    if (isJoinSuccessful === 1) {
        // 显示错误信息
        alert('Failed to join game: Name is empty.');
    }
    if (isJoinSuccessful === 2) {
        // 显示错误信息
        alert('Failed to join game: Name is used.');
    }
    if (isJoinSuccessful === 3) {
        // 显示错误信息
        alert('Failed to join game: Game has started.');
    }
});

// 接收服务器对开始游戏请求的响应
socket.on('gameStartResponse', () => {
    // 隐藏玩家列表，显示游戏信息
    document.getElementById('game-start-restart').style.display = 'none';
    document.getElementById('game-info').style.display = 'block';
    document.getElementById('container1').style.display = 'block';
    document.getElementById('container2').style.display = 'block';
    document.getElementById('voteResultDisplay').style.display = 'block';
});

// 游戏启动失败
socket.on('gameStartFail', () => {
    // 游戏启动失败，弹出警告
    alert('Game start fails. 5-10 players required.')
});

// 游戏重连失败
socket.on('reconnectFail', () =>{
    // 游戏重连失败，弹出警告
    alert('Reconnect fails. Check name and password.')
})

// 更新玩家列表
socket.on('updatePlayerList', (players) => {
    updatePlayerList(players);
});

// 从服务器接收角色分配信息并更新界面
socket.on('showId', (id) => {
    // 显示角色信息
    var idInfoElement = document.getElementById('idInfo');
    idInfoElement.textContent = `${id}`;
});

// 从服务器接收角色分配信息并更新界面
socket.on('showRole', (role) => {
    // 显示角色信息
    var roleInfoElement = document.getElementById('roleInfo');
    roleInfoElement.textContent = `${role.name}`;
});

// 从服务器接收技能信息并更新界面
socket.on('showSkill', (result) => {
    // 显示角色技能
    var skillInfoElement = document.getElementById('skillInfo');
    // 使用 join 方法将数组元素用 <br> 连接成一个字符串
    skillInfoElement.innerHTML = result.join('<br>');
});

socket.on('gameReset', () => {
    //清除存储的用户名
    sessionStorage.removeItem('playerName');

    // 隐藏游戏信息页面，显示玩家名输入页面
    document.getElementById('game-info').style.display = 'none';
    document.getElementById('player-list').style.display = 'none';
    document.getElementById('container1').style.display = 'none';
    document.getElementById('container2').style.display = 'none';
    document.getElementById('game-start-restart').style.display = 'none';
    document.getElementById('voteResultDisplay').style.display = 'none';
    document.getElementById('player-name-input').style.display = 'block';
})

// 展示投票结果
socket.on('show_vote', (result) => {
    // 获取显示结果的元素
    const resultDisplay = document.getElementById('voteResultDisplay');

    // 设置元素的内容为接收到的结果
    resultDisplay.innerHTML = result;
});
