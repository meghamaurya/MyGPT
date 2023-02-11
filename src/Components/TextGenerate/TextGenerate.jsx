import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import Typewriter from "typewriter-effect";
import "./TextGenerate.scss";
import Nav from "../Nav/Nav";

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
  const [stopType, setStopType] = useState(false);

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
    <main className="textGenerator">
      <Nav />
      <div className="textContainer">
        {messageResult.map(({ id, message, result }) => (
          <div key={id}>
            {result ? (
              <>
                <div className="searchMsg">{message}</div>
                <Typewriter
                  className="typewriter"
                  onInit={(typewriter) => {
                    stopType
                      ? typewriter.typeString(result).stop()
                      : typewriter.typeString(result).start();
                  }}
                />
                <button
                  onClick={() => {
                    setStopType(true);
                    console.log("stop");
                  }}
                >
                  stop
                </button>
              </>
            ) : (
              <div className="searchMsg">{message}</div>
            )}

            {/* <pre className="result">{result}</pre> */}
          </div>
        ))}
        <input
          typeof="text"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setStopType(false);
          }}
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
