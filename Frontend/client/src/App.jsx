import { useState } from "react";
import BattleView from "./components/BattleView";
import Auth from "./components/Auth";

function App() {
  const [battle, setBattle] = useState(0);
  return (
    <>
      <BattleView />
      <Auth />
    </>
  );
}

export default App;
