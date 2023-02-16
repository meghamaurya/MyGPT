import { Configuration, OpenAIApi } from "openai";
import { useEffect, useRef, useState } from "react";
import Nav from "../Nav/Nav";
import "./ImageGenerate.scss";

const ImageGenerate = () => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_APIKEY,
  });
  const openai = new OpenAIApi(configuration);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [dots, setDots] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await openai.createImage({
        prompt: search,
        n: 1,
        size: "1024x1024",
      });
      setSearch("");
      setImageUrl((prevState) => [
        ...prevState,
        {
          id: imageUrl.length + 1,
          image: search,
          result: response.data.data[0].url,
        },
      ]);
      setSearch("");
      setError("");
    } catch (err) {
      // console.log(err);
      if (err.message === "Request failed with status code 429") {
        setError(true);
        setSearch("");
        setIsTyping(false);
      } else {
        setError(err.message);
        setSearch("");
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
        setSearch((prevState) => `${prevState} \n`);
        return;
      }
      setLoading(true);
      try {
        const response = await openai.createImage({
          prompt: search,
          n: 1,
          size: "1024x1024",
        });
        setSearch("");
        setImageUrl((prevState) => [
          ...prevState,
          {
            id: imageUrl.length + 1,
            image: search,
            result: response.data.data[0].url,
          },
        ]);
        setIsTyping(false);
        inputRef.current.style.height = "3.6rem";
        setSearch("");
        setError("");
      } catch (err) {
        // console.log(err);

        if (err.message === "Request failed with status code 429") {
          setError("too many request");
          setSearch("");
          setIsTyping(false);
        } else {
          setError(err.message);
          setSearch("");
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
      inputRef.current.style.height = `57.6px`;
    } else {
      height = height <= 57.6 ? 57.6 : height;
      inputRef.current.style.height = `${height}px`;
    }
  };

  return (
    <main className="imgGenerator">
      <Nav />
      <div className="imgContainer">
        <div className="imgContent">
          {imageUrl &&
            imageUrl.map(({ id, image, result }, i) => (
              <div key={id}>
                {result && (
                  <>
                    {/* <div className="imgCard"> */}
                    <p className="imgTitle">{image}</p>
                    {loading ? (
                      <div className="dot-spin"></div>
                    ) : (
                      <img src={result} alt="" width="200px" className="img" />
                    )}
                    {/* {imageUrl.length-1 === i && ()} */}
                    {/* </div> */}
                  </>
                )}
              </div>
            ))}
          {error && (
            <div
              style={{
                color: "red",
                float: "center",
                justifyContent: "end",
              }}
            >
              {error}
            </div>
          )}
        </div>
        {/* <div className="imgContainer"> */}
        <textarea
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleInputChange(e);
            setIsTyping(false);
          }}
          onKeyDown={handleKeyEvent}
          placeholder={
            isTyping ? `what type of image you want${dots}` : `${dots}`
          }
          className="input"
        />
        <button
          onClick={handleClick}
          className={loading ? "btnEffect" : "btn"}
          disabled={loading || search.length === 0}
        >
          {loading ? "Generating" : "Generate"}
        </button>
        {/* </div> */}
      </div>
    </main>
  );
};

export default ImageGenerate;
