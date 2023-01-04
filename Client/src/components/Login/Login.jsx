import { useState, useEffect, useContext } from "react";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ServerContext } from "../Contexts/ServerContext";
import { ChannelContext } from "../Contexts/ChannelContext";
import axios from "axios";
// import Home from "../Home/Home";

const Login = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const { setServerInfo } = useContext(ServerContext);
  const { setChannelInfo } = useContext(ChannelContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const colors = [
    "bg-[#0096c7]",
    "bg-[#06d6a0]",
    "bg-[#5465ff]",
    "bg-[#fdca40]",
    "bg-[#fb8b24]",
    "bg-slate-800",
  ];
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  });
  const itemEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const submitForm = async (e) => {
    e.preventDefault();
    const { email, password } = userDetails;
    // console.log(email, password);
    const id = toast.loading("Logging in...");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // Have to store these colors in db
      // await updateProfile(auth.currentUser, {
      //   photoURL:
      //     auth.currentUser.photoURL ||
      //     colors[Math.floor(Math.random() * array.length)],
      // });
      const res = await axios.post(backendURL + "/userapi/adduser", {
        Email: user.user.email,
        Name: user.user.displayName,
      });
      let userInfo = {
        userName: res.data?.Name,
        userId: res.data?.id,
      };
      // preserve the userInfo state
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      toast.update(id, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.update(id, {
        render: "Invalid email or password..",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        progress: false,
      });
      setUserDetails({
        email: "",
        password: "",
      });
      console.log(error.message);
    }
  };
  const googleLogin = async (e) => {
    e.preventDefault();
    const id = toast.loading("Logging in with google..");
    try {
      const provider = new GoogleAuthProvider();
      const userDetail = await signInWithPopup(auth, provider);
      const res = await axios.post(backendURL + "/userapi/adduser", {
        Email: userDetail.user.email,
        Name: userDetail.user.displayName,
      });
      let userInfo = {
        userName: res.data?.Name,
        userId: res.data?.id,
      };
      // preserve the userInfo state
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setServerInfo({
        serverName: null,
        serverId: null,
        serverCode: null,
      });
      setChannelInfo({
        channelId: null,
        channelName: null,
      });
      // await updateProfile(auth.currentUser, {
      //   photoURL:
      //     "https://source.boringavatars.com/beam/60?colors=264653,2a9d8f,e9c46a,f4a261,e76f51",
      // });
      // console.log(userDetail.user);
      toast.update(id, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      toast.update(id, {
        render: "Some error occured!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        progress: false,
      });
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="loginBody">
        <form className="flex-col loginContainer p-5">
          <input
            className="my-3 outline-none p-2 bg-[#1e1e30] text-center input font-bold"
            name="email"
            type="email"
            placeholder="Email"
            onChange={itemEvent}
            value={userDetails.email}
          />
          <input
            className="my-3 outline-none p-2 bg-[#1e1e30] text-center input font-bold"
            name="password"
            placeholder="Password"
            type="password"
            onChange={itemEvent}
            value={userDetails.password}
          />
          <div>
            <button
              className="outline-none my-3 bg-white text-[#1e1e30] hover:bg-[#1e1e30] hover:text-white p-3 w-40 rounded-xl hover:border-white border-2 font-bold transition-all"
              name="submit"
              type="submit"
              onClick={submitForm}
            >
              Login
            </button>
            <ToastContainer />
            {/* <button className="outline-none">Signup</button> */}
          </div>
          <hr className="border-dashed border-white w-full" />
          <div className="flex justify-evenly flex-col items-center">
            <button
              className="outline-none my-3 bg-white text-[#1e1e30] hover:bg-[#1e1e30] hover:text-white p-4  rounded-xl hover:border-white border-2 font-bold transition-all"
              onClick={googleLogin}
            >
              Login with{" "}
              <img
                src="/images/google.svg"
                alt="google"
                className="w-5 h-5 inline"
              />
            </button>
          </div>
          <p>
            Not registered?{" "}
            <NavLink
              to="/register"
              className="hover:text-blue-800 text-blue-500"
            >
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
