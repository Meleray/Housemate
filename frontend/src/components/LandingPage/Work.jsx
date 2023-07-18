import React from "react";
import Connect from "../../images/chat.png";
import Tasks from "../../images/task.png";
import Bills from "../../images/bill.png";

const Work = () => {
  const workInfoData = [
    {
      image: Connect,
      title: "Connect",
      text: "With our app you can chat with all of your neighbors",
    },
    {
      image: Tasks,
      title: "Manage tasks",
      text: "Assign tasks and share responsibility for making your house a great place to live",
    },
    {
      image: Bills,
      title: "Split Bills",
      text: "Make sure everyone pays their share for general household ecpenses",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
