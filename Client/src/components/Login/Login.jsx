import { useState } from "react";
import axios from "axios";
import "./Login.css";
// import Home from "../Home/Home";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const itemEvent = (event) => {
    setUsername(event.target.value);
    setPassword(event.target.value);
  };
  const submitForm = (e) => {
    e.preventdefault();
    const data = {
      username: username,
      password: password,
    };
    axios
      .post("http://localhost:5000/login", data)
      .then(() => console.log(`data passed successfully!!!`))
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      <div class="grid grid-cols-2">
        <input
          className="border-b-2 border-grey-200"
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={itemEvent}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={itemEvent}
        />
        <div>
          <button
            className="outline-none"
            name="submit"
            type="submit"
            onSubmit={submitForm}
          >
            Submit
          </button>
          {/* <button className="outline-none">Signup</button> */}
        </div>
      </div>
    </>
  );
};

export default Login;
