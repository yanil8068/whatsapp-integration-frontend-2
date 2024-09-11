import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; // Import crypto-js for encryption

const ProvideAccessToken = () => {
  let [DeveloperToken, setDeveloperToken] = useState("");

  let navigate = useNavigate();
  const secretKey = "your-secret-key"; // Use a strong, secret key

  const SubmitForm = async (e) => {
    e.preventDefault();

    // Encrypt the DeveloperToken before storing it in localStorage
    const encryptedToken = CryptoJS.AES.encrypt(
      DeveloperToken,
      secretKey
    ).toString();

    // Store the encrypted token in localStorage
    localStorage.setItem("DeveloperToken", encryptedToken);

    navigate("/redirecturl");
  };

  return (
    <div>
      <form onSubmit={SubmitForm}>
        DeveloperToken:{" "}
        <input
          type="text"
          value={DeveloperToken}
          onChange={(e) => setDeveloperToken(e.target.value)}
        />
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default ProvideAccessToken;
