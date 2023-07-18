import "./LandingPage.css";
import Home from "./Home";
import About from "./About";
import Work from "./Work";
import React from "react";

function LandingPage() {
  return (
    <div className="App">
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="work">
        <Work />
      </section>
    </div>
  );
}

export default LandingPage;