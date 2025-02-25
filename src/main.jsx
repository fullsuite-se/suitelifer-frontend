import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// base folder contains the base styles
import "./css/base/theme.css";
import "./css/base/typography.css";

// responsive folder contains the responsive styles
import "./css/responsive/footer.css";
import "./css/responsive/home.css";
import "./css/responsive/about.css";

// animations folder contains the animations styles
import "./css/animation/animation.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
