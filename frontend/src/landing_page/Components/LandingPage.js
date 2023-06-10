import "../../App.css";
import Home from "./Home";
import About from "./About";
import Work from "./Work";
import Testimonial from "./Testimonial";
import Contact from "./Contact";
import Footer from "./Footer";
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
      <section id="testimonials">
        <Testimonial />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;