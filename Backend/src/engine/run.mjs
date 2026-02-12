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
}
