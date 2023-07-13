import React from "react";
import BannerBackground from "../../images/home-banner-background.png";
import BannerImage from "../../images/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Get organized with Housemate - The all-in-one app for living together.
          </h1>
          <p className="primary-text">
            Say goodbye to messy rooms, unpaid bills, and communication breakdowns. With Housemate, you can stay on track, so you can focus on living your best life together. Get started with Housemate today and experience the benefits of living together, simplified.
          </p>
          <Link to="/register" className="secondary-button">
            Register <FiArrowRight />{" "}
          </Link>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
