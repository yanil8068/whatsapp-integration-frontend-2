import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  // let [DeveloperAppAccessToken, setDeveloperAppAccessToken] = useState("");

  let navigate = useNavigate();
  // console.log("email", email);
  // console.log("password", password);

  const SubmitForm = async (e) => {
    e.preventDefault();
    console.log("email", email);
    console.log("password", password);
    await axios.post("http://localhost:8055/users/register", {
      email: email,
      password: password,
    });
    navigate("/login");
  };

  return (
    <div>
      Signin
      <br />
      <br />
      <form onSubmit={SubmitForm}>
        email:{" "}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        password:{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {/* DeveloperAppAccessToken:{" "}
        <input
          type="text"
          value={DeveloperAppAccessToken}
          onChange={(e) => setDeveloperAppAccessToken(e.target.value)}
        />
        <br /> */}
        <button type="submit">signin</button>
      </form>
    </div>
  );
};

export default Signup;
