import { useState } from "react";
import { login, register } from "../api/authApi";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </>
  );
}

export default Auth;
