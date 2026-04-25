

function renderBattle(data) {
    const battle = data.battle;

    document.getElementById("battle").innerHTML = `
        <p>Floor: ${data.floor}</p>
        <p>Player: ${battle.player.name} HP ${battle.player.hp}/${battle.player.maxHp}</p>
        <p>Enemy: ${battle.enemy.name} HP ${battle.enemy.hp}/${battle.enemy.maxHp}</p>
    `;
}