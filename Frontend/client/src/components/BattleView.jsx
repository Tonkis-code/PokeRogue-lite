function BattleView({ runData, onAttack }) {
  if (!runData) return <p>No run yet</p>;

  const battle = runData.battle;
  if (!battle) return <p>Battle ended.</p>;

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

      {battle.player.moves.map((move, index) => (
        <button key={index} onClick={() => onAttack(index)}>
          {move.name}
        </button>
      ))}
    </section>
  );
}

export default BattleView;
