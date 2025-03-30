import React, { useState } from "react";

function GetPromptAnswer() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getPromptAanswer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });
      // console.log(localStorage.getItem("token"));
      const result = await response.json();
      console.log("res", result.outputPrompt);
      setData(result.outputPrompt);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {data.length > 0 ? (
        data.map((dd, index) => (
          <div key={index}>
            <div>
              <strong>Prompt:</strong> {dd.prompt}
            </div>
            <div>
              <strong>Answer:</strong> {dd.answer}
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}

      <button onClick={getData}>Refresh</button>
    </div>
  );
}

export default GetPromptAnswer;
