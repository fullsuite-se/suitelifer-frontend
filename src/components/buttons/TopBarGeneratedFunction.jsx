import { useNavigate } from "react-router-dom";
import TopBarBlogs from "./top-bar-button/TopBarBlogs";
import TopBarDashboard from "./top-bar-button/TopBarDashboard";

const TopBarGeneratedFunction = ({ page }) => {
  switch (page) {
    case "My Blogs":
    case "Blogs Feed":
      return <TopBarBlogs />;
    case "Dashboard":
      return <TopBarDashboard />;
    default:
      return null;
  }
};

export default TopBarGeneratedFunction;
