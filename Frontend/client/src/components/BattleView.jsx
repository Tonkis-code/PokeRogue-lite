function BattleView({ runData }) {
    const battle = runData.battle;

    return (
        <section>
            <p>Floor: ${data.floor}</p>
            <p>Player: ${battle.player.name} HP ${battle.player.hp}/${battle.player.maxHp}</p>
            <p>Enemy: ${battle.enemy.name} HP ${battle.enemy.hp}/${battle.enemy.maxHp}</p>
        </section>
    )
}