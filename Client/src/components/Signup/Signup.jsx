import { useEffect, useState } from "react";
import axios from "axios";
import "../Login/Login.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    // const data = {
    //   username: username,
    //   password: password,
    //   email: email,
    // };
    // axios
    //   .post("http://localhost:5000/login", data)
    //   .then(() => console.log(`data passed successfully!!!`))
    //   .catch((err) => {
    //     console.error(err);
    //   });
    const id = toast.loading("Signing Up..");
    const { username, email, password, password2 } = userDetails;
    if (password !== password2) {
      toast.error("Passwords are not matching", {
        position: "top-right",
        theme: "dark",
        closeOnClick: true,
        autoClose: 3000,
        progress: true,
      });
    }
    try {
      console.log("trying user auth");

      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      toast.update(id, {
        render: "Login successfull",
        type: "success",
        isLoading: false,
        theme: "dark",
        autoClose: 3000,
        closeOnClick: true,
      });
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      toast.update(id, {
        render: "Some error occured",
        type: "error",
        isLoading: false,
        theme: "dark",
        autoClose: 3000,
        closeOnClick: true,
      });
      setUserDetails({
        username: "",
        email: "",
        password: "",
        password2: "",
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
            name="username"
            type="text"
            placeholder="Username"
            onChange={itemEvent}
            value={userDetails.username}
          />
          <input
            className="my-3 outline-none p-2 bg-[#1e1e30] text-center input font-bold"
            name="password"
            placeholder="Password"
            type="password"
            onChange={itemEvent}
            value={userDetails.password}
          />
          <input
            className="my-3 outline-none p-2 bg-[#1e1e30] text-center input font-bold"
            name="password2"
            placeholder="Repeat password"
            type="password"
            onChange={itemEvent}
            value={userDetails.password2}
          />
          <div>
            <button
              className="outline-none my-3 bg-white text-[#1e1e30] hover:bg-[#1e1e30] hover:text-white p-3 w-40 rounded-xl hover:border-white border-2 font-bold transition-all"
              name="submit"
              type="submit"
              onClick={submitForm}
            >
              Signup
            </button>
            <ToastContainer />
            {/* <button className="outline-none">Signup</button> */}
          </div>
          <p>
            Already registered?{" "}
            <NavLink to="/login" className="hover:text-blue-800 text-blue-500">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
