import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const MyGPT = () => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_APIKEY,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 100,
      });
      console.log(response.data);
      setResult((prevState) => [response.data.choices[0].text, ...prevState]);
    } catch (err) {
      console.log(err);
      // setError(response.data)
    }
    setLoading(false);
  };
  return (
    <main className="main">
      <div className="container">
        {result.map((el) => (
          <pre className="result">{el}</pre>
        ))}
        <input
          typeof="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="type here.."
          className="input"
        ></input>

        <button
          onClick={handleClick}
          disabled={loading || prompt.length === 0}
          className="btn"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </main>
  );
};

export default MyGPT;
