import { useState } from "react";
import BattleView from "./components/BattleView";
import Auth from "./components/Auth";
import StartRun from "./components/StartRun";
import { startRun, attack } from "./api/runApi";

function App() {
  const [runId, setRunId] = useState(null);
  const [runData, setRunData] = useState(null);

  async function handleStartRun() {
    try {
      const data = await startRun();

      setRunId(data.runId);
      setRunData(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAttack(moveIndex) {
    try {
      const data = await attack(runId, moveIndex);
      console.log("attack response:", data);
      setRunData(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <Auth />
      <StartRun onStartRun={handleStartRun} />
      <BattleView runData={runData} onAttack={handleAttack} />
    </>
  );
}

export default App;
