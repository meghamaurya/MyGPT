import { Link } from "react-router-dom";
import "./Nav.scss";
import logo from "../Images/chat.gif";

const Nav = () => {
  return (
    <div className="nav">
      <div className="logoItems">
        <img src={logo} alt="logo" className="logo" />
        <span className="appName">MyGPT</span>
      </div>
      <div className="linkContent">
        <Link to="/" className="link">
          Text Generate
        </Link>
        <Link to="/imageGenerate" className="link">
          Image Generate
        </Link>
      </div>
    </div>
  );
};

export default Nav;
