import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="nav">
      <Link to="/">Text Generate</Link>
      <Link to="imageGenerate">Image Generate</Link>
    </div>
  );
};

export default Nav;
