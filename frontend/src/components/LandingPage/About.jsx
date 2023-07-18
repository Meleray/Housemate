import React from "react";
import AboutBackground from "../../images/about-background.png";
import AboutBackgroundImage from "../../images/Other22.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          Convenient living spaces pave the way for better life
        </h1>
        <p className="primary-text">
          It may be very daunting to organize your household and especially so when you live with many other people.
        </p>
        <p className="primary-text">
          Housemate is an application that has many tools to help you create the best household.
        </p>
      </div>
    </div>
  );
};

export default About;
