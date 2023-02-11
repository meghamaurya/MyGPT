import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
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

  const handleClick = async () => {
    // e.preventDefault();
    setLoading(true);
    try {
      const response = await openai.createImage({
        prompt: search,
        n: 1,
        size: "1024x1024",
      });
      setImageUrl((prevState) => [
        ...prevState,
        {
          id: imageUrl.length + 1,
          image: search,
          result: response.data.data[0].url,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <main className="imgGenerator">
      <Nav />
      {imageUrl &&
        imageUrl.map(({ id, image, result }) => {
          return (
            <div key={id} className="imgCard">
              <p className="imgTitle">{image}</p>
              <img src={result} alt="" width="200px" className="img" />
            </div>
          );
        })}
      <div className="imgContainer">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="what type of image you want..."
          className="input"
        />
        <button onClick={handleClick} className="btn">
          {loading ? "generating..." : "image generate"}
        </button>
      </div>
    </main>
  );
};

export default ImageGenerate;
