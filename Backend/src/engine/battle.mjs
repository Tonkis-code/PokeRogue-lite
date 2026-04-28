export default class Battle {
    constructor(player, enemy) {
        this.player = player;
        this.enemy = enemy;
        this.isOver = false;
        this.winner = null;
    }

    calculateDamage(attacker, defender, move) {
        const randomFactor = Math.random() * 0.2 + 0.9; // 0.9-1.1
        const base = (move.power + attacker.attack) * randomFactor;
        const reduced = base - defender.defense;
        return reduced > 1 ? Math.floor(reduced) : 1;
    }

    takeTurn(playerMoveIndex = 0) {
        if (this.isOver) {
            return { message: "Battle is already over." };
        }

        const playerMove = this.player.moves[playerMoveIndex];

        // Player attacks
        const playerDamage = this.calculateDamage(
            this.player,
            this.enemy,
            playerMove
        );

        this.enemy.takeDamage(playerDamage);

        if (this.enemy.isFainted()) {
            this.isOver = true;
            this.winner = "player";
            return this.getState();
        }

        // Enemy attacks back (Only uses first move for now)
        const enemyMove = this.enemy.moves[0];

        const enemyDamage = this.calculateDamage(
            this.enemy,
            this.player,
            enemyMove
        );

        this.player.takeDamage(enemyDamage);

        if (this.player.isFainted()) {
            this.isOver = true;
            this.winner = "enemy";
        }

        return this.getState();
    }

    getState() {
        return {
            player: {
                name: this.player.name,
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                moves: this.player.moves.map(move => ({
                    name: move.name,
                    power: move.power
                }))
            },
            enemy: {
                name: this.enemy.name,
                hp: this.enemy.hp,
                maxHp: this.enemy.maxHp
            },
            isOver: this.isOver,
            winner: this.winner
        };
    }
}