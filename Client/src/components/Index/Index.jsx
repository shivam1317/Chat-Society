import React from "react";
import { NavLink } from "react-router-dom";
import { BsLightningFill, BsClockHistory } from "react-icons/bs";
import { CgPerformance } from "react-icons/cg";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import { BiImage, BiUserPlus } from "react-icons/bi";
import "./index.css";

const Index = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center overflow-scroll scrollbar-hide">
      {/* Hero section */}
      <div className="w-[95%] h-[70%] relative my-4">
        <img
          src="./images/index/hero_image.png"
          alt="hero_image"
          className="w-full h-full object-cover opacity-60 relative -z-10 rounded-md"
        />
        <div className="top-10 left-10 w-fit absolute text-gray-100 p-3">
          <h1 className="text-5xl font-extrabold">Welcome To Chat-Society</h1>
          <p className="text-lg text-gray-200 p-1 my-2">
            A place for you to chat,connect and interact...
          </p>
          <NavLink to="/login">
            <button className="getStartedBtn p-3 text-gray-100 rounded-xl my-2">
              Get Started
            </button>
          </NavLink>
        </div>
      </div>
      {/* Features section */}
      <div className="font-bold text-4xl my-3 flex items-center">
        {" "}
        <BsLightningFill size="30" color="#FBBF24" />{" "}
        <span className="mx-3">Features</span>
        <BsLightningFill size="30" color="#FBBF24" />
      </div>
      <div className="w-[90%] flex flex-row justify-between py-3 text-xl items-center">
        {/* Feature Div */}
        <div className="w-2/5">
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <CgPerformance />
            <p className="ml-4">Increased Performance</p>
          </div>
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <HiOutlineChatBubbleLeft />
            <p className="ml-4">Realtime Chat</p>
          </div>
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <AiOutlineHome />
            <p className="ml-4">Organize Chatrooms in Houses</p>
          </div>
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <BiUserPlus />
            <p className="ml-4">Invite your friends to your house</p>
          </div>
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <BiImage />
            <p className="ml-4">Images & GIF Support</p>
          </div>
          <div className="flex items-center p-2 text-slate-300 rounded-lg my-4 featureCard cursor-pointer hover:text-blue-300 transition-all duration-150 ease-in-out">
            <BsClockHistory />
            <p className="ml-4">More Features Coming Soon...</p>
          </div>
        </div>
        {/* Feature Image */}
        <img
          src="./images/index/feature_image.png"
          alt="feature"
          className="object-cover w-1/2 my-auto rounded-xl h-[80%]"
        />
      </div>
    </div>
  );
};

export default Index;
