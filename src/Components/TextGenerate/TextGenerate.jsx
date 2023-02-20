import React, { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import { BsChatDotsFill } from "react-icons/bs";
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

  const [error, setError] = useState("");
  const [stopType, setStopType] = useState(false);
  const [dots, setDots] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typewriterRef = useRef();
  const inputRef = useRef();

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.4,
        max_tokens: 150,
      });
      setPrompt("");
      setMessageResult((prevState) => [
        ...prevState,
        {
          id: messageResult.length + 1,
          message: prompt,
          result: response.data.choices[0].text,
        },
      ]);
      setPrompt("");
      setStopType(false);
      setIsTyping(false);
      setError("");
    } catch (err) {
      // console.log(err);
      if (err.message === "Request failed with status code 429") {
        setError("too many request");
        setPrompt("");
        setStopType(false);
        setIsTyping(false);
      } else {
        setError(err.message);
        setPrompt("");
        setStopType(false);
        setIsTyping(false);
      }
    }
    setLoading(false);
    setIsTyping(false);
  };

  const handleKeyEvent = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        e.preventDefault();
        setPrompt((prevState) => `${prevState} \n`);
        return;
      }
      setLoading(true);

      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 1.5,
          max_tokens: 150,
        });

        setPrompt("");
        setMessageResult((prevState) => [
          ...prevState,
          {
            id: messageResult.length + 1,
            message: prompt,
            result: response.data.choices[0].text,
          },
        ]);
        setIsTyping(false);
        inputRef.current.style.height = "3.6rem";
        setPrompt("");
        setStopType(false);
        setIsTyping(false);
        setError("");
      } catch (err) {
        // console.log(err.message, "err");

        if (err.message === "Request failed with status code 429") {
          setError("too many request");
          setPrompt("");
          setStopType(false);
          setIsTyping(false);
        } else {
          setError(err.message);
          setPrompt("");
          setStopType(false);
          setIsTyping(false);
        }
      }
      setLoading(false);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(dots.length >= 4 ? "" : `${dots}.`);
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, [dots]);

  const handleInputChange = (e) => {
    let height = e.target.scrollHeight;
    if (e.target.value === "" && isTyping) {
      inputRef.current.style.height = "50px";
    } else {
      height = height <= 50 ? 50 : height;
      inputRef.current.style.height = `${height}px`;
    }
  };

  return (
    <main className="textGenerator">
      <Nav />
      <div className="textContainer">
        <div className="messageContent">
          {messageResult.map(({ id, message, result }, i) => (
            <div key={id}>
              {result && (
                <>
                  <p className="searchMsg">
                    <BsChatDotsFill className="msgIcon" /> {message}
                  </p>
                  <div className="typingContainer">
                    <div className="iconContainer">
                      <BsChatDotsFill className="resultIcon" />
                    </div>
                    <div className="textContainer">
                      <Typewriter
                        className={"typewriter"}
                        ref={typewriterRef}
                        onInit={(typewriter) => {
                          if (!stopType) {
                            typewriterRef.current = typewriter;
                            typewriter.typeString(result).start();
                          }
                        }}
                      />
                      {messageResult.length - 1 === i && (
                        <>
                          {!stopType ? (
                            <button
                              className="controlBtn"
                              onClick={() => {
                                if (typewriterRef.current) {
                                  typewriterRef.current.stop();
                                  setStopType(true);
                                  setIsTyping(true);
                                }
                              }}
                            >
                              stop
                            </button>
                          ) : (
                            <button
                              className="controlBtn"
                              onClick={() => {
                                if (typewriterRef.current) {
                                  typewriterRef.current.start();
                                  setStopType(false);
                                  setIsTyping(false);
                                }
                              }}
                            >
                              continue
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* // : (
              //   <div className="searchMsg">{message}</div>
              // )} */}
            </div>
          ))}
          {error && (
            <div
              style={{
                color: "red",
                float: "center",
                position: "absolute",
                bottom: "11rem",
                justifyContent: "end",
              }}
            >
              {error}
            </div>
          )}
        </div>
        <div style={{ paddingBottom: "4rem", width: "100%" }}>
          <textarea
            typeof="text"
            value={prompt}
            ref={inputRef}
            onChange={(e) => {
              setPrompt(e.target.value);
              handleInputChange(e);
              if (typewriterRef.current) {
                typewriterRef.current.stop();
              }
              setStopType(false);
            }}
            onKeyDown={handleKeyEvent}
            placeholder={isTyping ? `How can I help you${dots}` : `${dots}`}
            className="input"
          />

          <button
            onClick={handleClick}
            disabled={loading || prompt.length === 0}
            className={loading ? "btnEffect" : "btn"}
          >
            {loading ? "Generating" : "Generate"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default TextGenerate;
