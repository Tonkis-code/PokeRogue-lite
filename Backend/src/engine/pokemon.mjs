export default class Pokemon {
    constructor(name, stats, moves) {
        this.name = name;
        this.maxHp = stats.hp;
        this.hp = stats.hp;
        this.attack = stats.attack;
        this.defense = stats.defense;
        this.moves = moves;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if(this.hp < 0) this.hp = 0;
    }

    isFainted() {
        return this.hp === 0;
    }
}