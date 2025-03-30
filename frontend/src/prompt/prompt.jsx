import React, { useState } from "react";

function Prompt() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  const promting = async () => {
    try {
      const response = await fetch("http://localhost:8080/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setAnswer(data.answer);
      console.log("Message has been submitted");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const reset = () => {
    setAnswer("");
  };

  return (
    <div>
      <input
        type="text"
        name="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <br />
      <button onClick={promting}>Submit</button>
      <br />
      <button onClick={reset}>Reset</button>
      <br />
      <div>
        This is the answer: {answer ? answer : "Waiting for response..."}
      </div>
    </div>
  );
}

export default Prompt;
