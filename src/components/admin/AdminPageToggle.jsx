import { useState } from "react";
import Testimonials from "./Testimonials";
import AboutPage from "./AdminAboutPage";

const PageToggle = () => {
  const [activePage, setActivePage] = useState("about");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActivePage("about")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: activePage === "about" ? "2px solid #333" : "1px solid #ccc",
            backgroundColor: activePage === "about" ? "#f0f0f0" : "white",
            cursor: "pointer",
            fontWeight: activePage === "about" ? "bold" : "normal"
          }}
        >
          About Page
        </button>
        <button
          onClick={() => setActivePage("testimonial")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: activePage === "testimonial" ? "2px solid #333" : "1px solid #ccc",
            backgroundColor: activePage === "testimonial" ? "#f0f0f0" : "white",
            cursor: "pointer",
            fontWeight: activePage === "testimonial" ? "bold" : "normal"
          }}
        >
          Testimonial
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "1.5rem"
        }}
      >
        {activePage === "about" ? <AboutPage /> : <Testimonials />}
      </div>
    </div>
  );
};

export default PageToggle;
