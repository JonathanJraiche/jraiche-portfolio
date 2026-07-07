import React from "react";
import ReactDOM from "react-dom/client";

// Self-hosted fonts: two weights per family, nothing heavier.
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./styles/global.css";
import App from "./App.jsx";

// Fade-in hidden states are gated on this class so the page is
// fully visible for anyone without JavaScript.
document.documentElement.classList.add("js");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
