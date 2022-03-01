import { useState, useEffect } from "react";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Home from "../Home/Home";

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
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
    console.log(email, password);
    const id = toast.loading("Logging in...");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
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
