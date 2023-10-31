class Room {
    constructor() {
        this.players = []; // 存储加入房间的玩家
        this.started = false;
        this.currentMission = null;
        this.missionHistory = [];
    }

    addPlayer(name, password, id) {
        // 检查名字是否为空
        if  (!name) {
            return 1;
        }
        // 检查玩家是否已在房间中
        for (let player of this.players) {
            if (player.name == name) {
                return 2
            }
        }
        //检查游戏是否已经开始
        if (this.started) {
            return 3;
        }
        //添加新玩家
        let newPlayer = new Player(name, password, id);
        this.players.push(newPlayer);
        return 0
    }

    reconnect(name, password, id) {
        for (let player of this.players) {
            if (player.name == name && player.password == password) {
                player.socketId = id
                return player;
            }
        }
        return null;
    }

    // 分配角色
    assignRole(role) {
        let roles;
        switch (this.players.length) {
            case 5:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Loyal Servant"];
                break;
            case 6:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Loyal Servant", "Loyal Servant"];
                break;
            case 7:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Oberon", "Loyal Servant", "Loyal Servant"];
                break;
            case 8:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Minion of Mordred", "Loyal Servant", "Loyal Servant", "Loyal Servant"];
                break;
            case 9:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Mordred", "Loyal Servant", "Loyal Servant", "Loyal Servant", "Loyal Servant"];
                break;
            case 10:
                roles = ["Merlin", "Percival", "Morgana", "Assassin", "Mordred", "Oberon", "Loyal Servant", "Loyal Servant", "Loyal Servant", "Loyal Servant"];
                break;
            default:
                console.log("Invalid number of players");
        }

        // 打乱角色数组
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // 将角色分配给玩家
        this.players.forEach((player, index) => {
            player.assignRole(roles[index]);
        });
    }

    // 开始游戏
    initializeGame() {
        if (this.players.length < 5 || this.players.length >10) {
            return false;
        } 
        if (this.started === false) {
            this.assignRole();
            this.started =true
            return true;
        } else {
            return true
        }

    }

    //重新开始游戏
    restartGame() {
        this.players = [];
        this.started = false;
        // 游戏重启
        console.log(`game restarted`);
    }

    //提出任务
    propose(proposer, selectedPlayers) {
        if(!this.started || this.currentMission) {
            return false; // 如果游戏未开始或当前已有任务，则不能提出新任务
        }

        this.currentMission = {
            proposer: proposer,
            selectedPlayers: selectedPlayers,
            votes: {}, // 存储每个玩家的投票
            state: 'voting', // 状态：voting, approved, rejected, finish
            actions: {}, //做任务玩家的行动
        }

        return true
    }

    // 对任务投票
    voteOnMission(playerName, vote) {
        if (!this.currentMission || this.currentMission.state !== 'voting') {
            return false; // 如果当前没有任务或任务不在投票阶段，则无法投票
        }

        this.currentMission.votes[playerName] = vote;
        // 检查是否所有玩家都已投票
        if (Object.keys(this.currentMission.votes).length === this.players.length) {
            this.evaluateMissionVote(); // 当所有玩家投票完毕时，评估投票结果
        }
        return true;
    }

    // 评估任务投票结果
    evaluateMissionVote() {
        const votes = Object.values(this.currentMission.votes);
        const approveCount = votes.filter(vote => vote).length; //总通过票数
        if (approveCount * 2 > this.players.length) {
            this.currentMission.state = 'approved'; // 赞成票数过半，任务开始执行
        } else {
            this.currentMission.state = 'rejected';
            this.missionHistory.push(this.currentMission);
            this.currentMission = null; // 投票未通过，任务rejected，重置当前任务
        }
    }

    // 执行任务
    executeMission(playerName, success) {
        if (!this.currentMission || this.currentMission.state !== 'approved') {
            return false; // 如果当前没有任务或任务不在执行阶段，则无法执行
        }
        if (!this.currentMission.selectedPlayers.includes(playerName)) {
            return false; // 只有被选中的玩家才能执行任务
        }

        this.currentMission.actions[playerName] = success;
        return true;
    }

    //任务结束
    endMission() {
        if (!this.currentMission || this.currentMission.state !== 'approved') {
            return false;
        }

        // 检查所有选定的玩家是否都已执行行动
        const allPlayersActed = this.currentMission.selectedPlayers.every(
            player => player in this.currentMission.actions
        );

        if (allPlayersActed) {
            // 如果所有选定玩家都行动过，结束任务
            this.currentMission.state = 'finished';
            this.missionHistory.push(this.currentMission);
            this.currentMission = null; // 重置当前任务

            // 这里可以添加其他逻辑，比如通知玩家、处理游戏逻辑等
            // ...

            return true;
        } else {
            // 如果有选定玩家尚未行动
            return false;
        }
    }
}

class Role {
    constructor(name) {
        this.name = name;
    }

    // 技能函数，可在子类中重写
    useSkill(players) {
        return players.filter(player => 
            ["None"].includes(player.role.name)
        ).map(player => player.name);
    }
}


class Merlin extends Role {
    constructor() {
        super("Merlin");
    }

    useSkill(players) {
        // 获取 Morgana, Assassin, Minion of Mordred, Oberon 的玩家用户名
        return players.filter(player => 
            ["Morgana", "Assassin", "Minion of Mordred", "Oberon"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class Percival extends Role {
    constructor() {
        super("Percival");
    }

    useSkill(players) {
        // 获取 Merlin 和 Morgana 的玩家用户名
        return players.filter(player => 
            ["Merlin", "Morgana"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class LoyalServant extends Role {
    constructor() {
        super("Loyal Servant");
    }

    // 无特殊技能
    useSkill(players) {
        return players.filter(player => 
            ["None"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class Mordred extends Role {
    constructor() {
        super("Mordred");
    }

    useSkill(players) {
        // 获取 Mordred, Morgana, Assassin, Minion of Mordred 的玩家用户名
        return players.filter(player => 
            ["Mordred", "Morgana", "Assassin", "Minion of Mordred"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class Morgana extends Role {
    constructor() {
        super("Morgana");
    }

    useSkill(players) {
        // 与 Mordred 相同的技能实现
        return players.filter(player => 
            ["Mordred", "Morgana", "Assassin", "Minion of Mordred"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class Assassin extends Role {
    constructor() {
        super("Assassin");
    }

    useSkill(players) {
        // 与 Mordred 相同的技能实现
        return players.filter(player => 
            ["Mordred", "Morgana", "Assassin", "Minion of Mordred"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class MinionOfMordred extends Role {
    constructor() {
        super("Minion of Mordred");
    }

    useSkill(players) {
        // 与 Mordred 相同的技能实现
        return players.filter(player => 
            ["Mordred", "Morgana", "Assassin", "Minion of Mordred"].includes(player.role.name)
        ).map(player => player.name);
    }
}

class Oberon extends Role {
    constructor() {
        super("Oberon");
    }

    // 无特殊技能
    useSkill(players) {
        return players.filter(player => 
            ["None"].includes(player.role.name)
        ).map(player => player.name);
    }
}


class Player {
    constructor(name, password, id, role = null) {
        this.name = name;
        this.password = password;
        this.socketId = id;
        this.role = role;
    }

    // 设置角色
    assignRole(role) {
        switch (role) {
            case "Merlin":
                this.role = new Merlin();
                break;
            case "Percival":
                this.role =  new Percival();
                break;
            case "Loyal Servant":
                this.role = new LoyalServant();
                break;
            case "Mordred":
                this.role = new Mordred();
                break;
            case "Morgana":
                this.role = new Morgana();
                break;
            case "Assassin":
                this.role = new Assassin();
                break;
            case "Minion of Mordred":
                this.role = new MinionOfMordred();
                break;
            case "Oberon":
                this.role = new Oberon();
                break;
            default:
                console.log("Invalid role");
        }
    }

    // 使用技能
    useSkill(players) {
        return this.role.useSkill(players);
    }
}

module.exports = {Room, Role, Player, Merlin, Percival, LoyalServant, Mordred, Morgana, Assassin, MinionOfMordred, Oberon};