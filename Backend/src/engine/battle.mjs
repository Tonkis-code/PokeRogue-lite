function calculateDamage(attacker, defender, move) {
    const base = move.power + attacker.attack;
    const reduced = base - defender.defense;
    return reduced > 1 ? reduced : 1;
}

export function attack(attacker, defender, move) {
    const damage = calculateDamage(attacker, defender, move);
    defender.takeDamage(damage);

    return {
        attacker: attacker.name,
        move: move.name,
        damage,
        defenderHp: defender.hp
    };
}