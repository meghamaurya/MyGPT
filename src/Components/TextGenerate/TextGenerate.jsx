import React, { useState, useEffect, useRef } from "react";
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
  const [dots, setDots] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [inputHeight, setInputHeight] = useState(3.4);
  const typewriterRef = useRef();
  const inputRef = useRef();

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 100,
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
    } catch (err) {
      console.log(err);
      // setError(response.data)
    }
    setLoading(false);
    setIsTyping(false);
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
        setPrompt("");
        setStopType(false);
      } catch (err) {
        console.log(err);
        // setError(response.data)
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
    console.log(height, "height");
    let height1 = height < 5 ? 3.4 : height;
    let height2 = height > 10 ? 8 : height1;
    inputRef.current.style.height = height2 + "rem";
    // setInputHeight((prevHeight) => {
    //   if (height1 >= 5 && height2 >= 10) {
    //     return height2;
    //   } else {
    //     return prevHeight;
    //   }
    // });
  };

  return (
    <main className="textGenerator">
      <Nav />
      <div className="textContainer">
        <div className="messageContent">
          {messageResult.map(({ id, message, result }, i) => (
            <div key={id}>
              {result ? (
                <>
                  <div className="searchMsg">{message}</div>
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
                </>
              ) : (
                <div className="searchMsg">{message}</div>
              )}
            </div>
          ))}
        </div>
        <textarea
          typeof="text"
          value={prompt}
          ref={inputRef}
          onChange={(e) => {
            setPrompt(e.target.value);
            // handleInputChange(e);
            if (typewriterRef.current) {
              typewriterRef.current.stop();
            }
            setStopType(false);
          }}
          onKeyDown={handleKeyEvent}
          style={{ height: `${inputHeight}rem` }}
          onInput={handleInputChange}
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
    </main>
  );
};

export default TextGenerate;
