import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const TextGenerate = () => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_APIKEY,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageResult, setMessageResult] = useState([
    { id: "", text: "", result: "" },
  ]);
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
      setPrompt("");
      setMessageResult((prevState) => [
        ...prevState,
        {
          id: messageResult.length + 1,
          message: prompt,
          result: response.data.choices[0].text,
        },
      ]);
    } catch (err) {
      console.log(err);
      // setError(response.data)
    }
    setLoading(false);
  };

  const handleKeyEvent = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 100,
        });
        console.log(response.data);
        setPrompt("");
        setMessageResult((prevState) => [
          ...prevState,
          {
            id: messageResult.length + 1,
            message: prompt,
            result: response.data.choices[0].text,
          },
        ]);
      } catch (err) {
        console.log(err);
        // setError(response.data)
      }
      setLoading(false);
    }
  };
  return (
    <main className="main">
      <div className="container">
        {messageResult.map(({ id, message, result }) => (
          <>
            <div key={id}>{message}</div>
            <pre className="result">{result}</pre>
          </>
        ))}
        <input
          typeof="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyEvent}
          placeholder="type here..."
          className="input"
        />

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

export default TextGenerate;
