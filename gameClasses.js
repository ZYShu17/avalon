class Room {
    constructor() {
        this.players = []; // 存储加入房间的玩家
        this.started = false;
    }

    addPlayer(name, id) {
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
        let newPlayer = new Player(name, id);
        this.players.push(newPlayer);
        return 0
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
    constructor(name, id, role = null) {
        this.name = name;
        this.socketId = id;
        this.role = role;

        // 输出玩家创建的信息
        console.log(`A player named ${name} has joined.`);
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