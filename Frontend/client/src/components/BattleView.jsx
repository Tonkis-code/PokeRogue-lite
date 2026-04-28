function BattleView({ runData }) {
  if (!runData) return <p>No run yet</p>;

  const battle = runData.battle;

  return (
    <section>
      <p>Floor: {runData.floor}</p>
      <p>
        Player: {runData.battle.player.name} HP {runData.battle.player.hp}/
        {runData.battle.player.maxHp}
      </p>
      <p>
        Enemy: {runData.battle.enemy.name} HP {runData.battle.enemy.hp}/
        {runData.battle.enemy.maxHp}
      </p>
    </section>
  );
}

export default BattleView;
