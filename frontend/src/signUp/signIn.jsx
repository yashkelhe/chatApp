import React, { useState } from "react";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInCall = () => {
    fetch("http://localhost:8080/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json()) // ✅ Return response JSON
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token:", data.token);
        } else {
          console.error("Login failed:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error); // ✅ Proper error logging
      });
  };

  return (
    <div>
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <br />
      <input
        type="password" // ✅ Change input type to "password" for security
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <br />
      <button onClick={signInCall}>Submit</button>
    </div>
  );
}

export default SignIn;
