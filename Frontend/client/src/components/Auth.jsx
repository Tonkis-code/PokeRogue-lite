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

  async function handleRegister() {
    try {
      const data = await register(email, password);
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
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </>
  );
}

export default Auth;
