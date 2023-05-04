import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (username && password) {
      const data = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const res = await data.json();

      console.log(res);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "password") {
      setPassword(e.target.value);
    } else {
      setUsername(e.target.value);
    }
  };

  return (
    <div>
      <label>Username:</label>
      <input
        onChange={handleInputChange}
        name="username"
        value={username}
        type="text"
      />
      <label>Password:</label>
      <input
        name="password"
        onChange={handleInputChange}
        type="password"
        value={password}
      />
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
