import Battle from "./battle.mjs";
import Pokemon from "./pokemon.mjs";
import Move from "./move.mjs";

export default class Run {
    constructor() {
        this.floor = 1;
        this.isOver = false;

        const ember = new Move("Ember", 10);
        const scratch = new Move("Scratch", 6);
        this.player = new Pokemon("Charmander", {
            hp: 39,
            attack: 52,
            defense: 43
        }, [ember, scratch]);
        
        this.currentBattle = this.generateBattle();
    }

    generateBattle() {
        const tackle = new Move("Tackle", 8);

        const enemy = new Pokemon("Wild Squirtle", {
            hp: 30 + this.floor * 2,
            attack: 40 + this.floor,
            defense: 30 + this.floor
        }, [tackle]);

        return new Battle(this.player, enemy);
    }

    attack(moveIndex = 0) {
        if (this.isOver) {
            return { message: "Run is over." };
        }

        const state = this.currentBattle.takeTurn(moveIndex);

        if (state.isOver && state.winner === "player") {
            this.floor++;

            this.healBetweenFloors();

            this.currentBattle = this.generateBattle();

            return {
                ...state,
                message: "Enemy defeated! Moving to the next floor.",
                newFloor: this.floor
            };
        }

        if (state.isOver && state.winner === "enemy") {
            this.isOver = true;
            return {
                ...state,
                message: "You lost the run."
            };
        }

        return state;
    }

    getState() {
        return {
            floor: this.floor,
            isOver: this.isOver,
            battle: this.currentBattle.getState()
        };
    }

    healBetweenFloors() {
        const healAmount = Math.floor(this.player.maxhp * 0.2); // 20% heal

        this.player.hp = Math.min(
            this.player.maxHp,
            this.player.hp + healAmount
        );
    }

    toJson() {
        return {
            floor: this.floor,
            isOver: this.isOver,
            player: {
                name: this.player.name,
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                attack: this.player.attack,
                defense: this.player.defense,
                moves: this.player.moves.map(m => ({ name: m.name, power: m.power })),
            },
            enemy: {
                name: this.currentBattle.enemy.name,
                hp: this.currentBattle.enemy.hp,
                maxHp: this.currentBattle.enemy.maxHp,
                attack: this.currentBattle.enemy.attack,
                defense: this.currentBattle.enemy.defense,
                moves: this.currentBattle.enemy.moves.map(m => ({ name: m.name, power: m.power })),
            }

        };
    }

    static async fromJSON(data) {
        const { default: Pokemon } = await import("./pokemon.mjs");
        const { default: Move } = await import("./move.mjs");
        const { default: Battle } = await import("./battle.mjs");
        
        const playerMoves = data.player.moves.map(m => new Move(m.name, m.power));
        const enemyMoves = data.enemy.moves.map(m => new Move(m.name, m.power));

        const player = new Pokemon(
            data.player.name,
            { hp: data.player.maxHp, attack: data.player.attack, defense: data.player.defense },
            playerMoves
        );
        player.hp = data.player.hp;

        const enemy = new Pokemon(
            data.enemy.name,
            { hp: data.enemy.maxHp, attack: data.enemy.attack, defense: data.enemy.defense },
            enemyMoves
        );
        enemy.hp = data.enemy.hp;

        const run = Object.create(this.prototype);
        run.floor = data.floor;
        run.isOver = data.isOver;
        run.player = player;
        run.currentBattle = new Battle(player, enemy);

        return run;
    }
}
