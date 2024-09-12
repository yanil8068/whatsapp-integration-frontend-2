import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Redirecturl.css";
import CryptoJS from "crypto-js"; // Import crypto-js for decryption
import { useNavigate } from "react-router-dom";

const Redirecturl = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [projectsBusinessId, setProjectsBusinessId] = useState("");
  const [allBusiness, setAllBusiness] = useState("");
  const [allNumbersOfBusiness, setAllNumbersOfBusiness] = useState();
  const [whatsappbusinessaccountid, setWhatsappbusinessaccountid] =
    useState("");
  const [
    allWhatsappBusinessAccountsConnectedToApp,
    setAllWhatsappBusinessAccountsConnectedToApp,
  ] = useState("");
  const [to, setTo] = useState(null);
  const [customerTo, setCustomerTo] = useState();
  const [from, setFrom] = useState();
  const [msg, setMsg] = useState("");

  const [allCustomerNumbers, setAllCustomerNumbers] = useState(null);
  const [decryptedToken, setDecryptedToken] = useState(null);

  const navigate = useNavigate();

  const secretKey = process.env.REACT_APP_CryptoJS_SECRET_KEY; // Use the same secret key
  useEffect(() => {
    // Retrieve the encrypted token from localStorage
    const encryptedToken = localStorage.getItem("DeveloperToken");

    if (encryptedToken) {
      // Decrypt the token
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const originalToken = bytes.toString(CryptoJS.enc.Utf8);
      console.log("originaltoken", originalToken);
      setDecryptedToken(originalToken);
    }
  }, []);

  ////////////websocket

  const [messages, setMessages] = useState([]);
  const connection = useRef(null); // WebSocket connection reference

  const urll = "ws://localhost:8055/websocket";
  //web1
  useEffect(() => {
    return () => {
      // Close WebSocket connection when the component unmounts to avoid memory leaks
      if (connection.current) {
        connection.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (to) {
      handleShowCurrentChats();
    }
  }, [to]);

  //web2
  const handleShowCurrentChats = () => {
    // Create a new WebSocket connection if it doesn't exist
    if (
      !connection.current ||
      connection.current.readyState !== WebSocket.OPEN
    ) {
      // Create new WebSocket connection
      connection.current = new WebSocket(urll);

      //This is called when the WebSocket connection is successfully opened.
      connection.current.onopen = () => {
        console.log("WebSocket connection opened");
        console.log("to", to);
        // Auth is handled by cookies, send a subscription message, Here, you send a subscription message to listen for messages from the Message collection.
        // Send a subscription message to listen for messages from the Message collection
        connection.current.send(
          JSON.stringify({
            type: "subscribe",
            collection: "Message",
            query: {
              filter: {
                _or: [
                  {
                    _and: [
                      {
                        From: {
                          _eq: phoneNumberId, // Replace phoneNumberId with your actual variable
                        },
                      },
                      {
                        contacts_id: {
                          _eq: to, // Replace phoneNumberId with your actual variable
                        },
                      },
                    ],
                  },
                  {
                    _and: [
                      {
                        From: {
                          _eq: to, // Replace phoneNumberId with your actual variable
                        },
                      },
                      {
                        contacts_id: {
                          _eq: phoneNumberId, // Replace phoneNumberId with your actual variable
                        },
                      },
                    ],
                  },
                ],
              },
              fields: ["*"], // Fetch all fields
            },
          })
        );
      };

      //This handles incoming messages from the WebSocket. It parses the data and passes it to handleReceiveMessage.
      connection.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleReceiveMessage(data);
      };

      //This is called when the WebSocket connection is closed.
      connection.current.onclose = () => {
        console.log("WebSocket closed");
      };
    }
  };

  //web3
  const handleReceiveMessage = (data) => {
    console.log("Received message", data);

    //all messages
    if (data.type === "subscription" && data.event === "init") {
      // Initialize with existing messages
      const sortedMessages = data.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    }

    //sent message
    if (data.type === "subscription" && data.event === "create") {
      // Add new message to the list
      setMessages((prevMessages) => [...prevMessages, data.data[0]]);
    }

    // Respond to ping to keep the WebSocket alive
    if (data.type === "ping") {
      connection.current.send(
        JSON.stringify({
          type: "pong",
        })
      );
    }
  };

  ////////////websocket

  const [phoneNumberId, setPhoneNumberId] = useState();

  //1 start : after login getting all the whatsapp business accounts connected to the app from developer api and check if a particular business is newly created then add it to database
  useEffect(() => {
    if (allWhatsappBusinessAccountsConnectedToApp) {
      allWhatsappBusinessAccountsConnectedToApp.map(
        (eachWhatsappBusinessAccount) => {
          //     //check if eachWhatsappBusinessAccount.id already exist in the directus

          CheckBusinessAndCreate(
            eachWhatsappBusinessAccount.id,
            eachWhatsappBusinessAccount.name
          );

          //   //if exist do nothing
          //   //if not then create it in directus with information of the user in it
        }
      );
    }
  }, [allWhatsappBusinessAccountsConnectedToApp]);

  async function CheckBusinessAndCreate(
    eachWhatsappBusinessAccountId,
    eachWhatsappBusinessAccountName
  ) {
    try {
      // Check if the business
      console.log("checkbusinessid", eachWhatsappBusinessAccountId);
      const businessExist = await axios.get(
        `http://localhost:8055/items/Business/${eachWhatsappBusinessAccountId}`
      );
      console.log("businessExist", businessExist);
      // If the business exists, do nothing
      if (businessExist) {
        console.log("Business already exists:", eachWhatsappBusinessAccountId);
        return;
      }
    } catch (error) {
      // If the business does not exist (404 error), create a new one
      if (error.response) {
        try {
          const userResponse = await axios.get(
            "http://localhost:8055/users/me",
            {
              withCredentials: true,
            }
          );
          console.log("userResponse.data.data.id", userResponse.data.data.id);

          const newBusiness = {
            id: eachWhatsappBusinessAccountId,
            name: eachWhatsappBusinessAccountName, // You might want to use dynamic data instead of hardcoding

            User: userResponse.data.data.id, // Assuming this is the user ID
          };
          await axios.post(`http://localhost:8055/items/Business`, newBusiness);
          console.log("New business created:", eachWhatsappBusinessAccountId);
        } catch (postError) {
          console.error("Error creating new business:", postError);
        }
      } else {
        console.error("Error checking business existence:", error);
      }
    }
  }

  useEffect(() => {
    if (!token) {
      fetchAccessToken();
    }
  }, []);
  const fetchAccessToken = async () => {
    const encryptedToken = localStorage.getItem("DeveloperToken");
    if (encryptedToken) {
      // Decrypt the token
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const originalToken = bytes.toString(CryptoJS.enc.Utf8);
      console.log("originaltoken", originalToken);
      setDecryptedToken(originalToken);
      setToken(originalToken);
    }
  };

  //3
  useEffect(() => {
    if (token) {
      getBusiness();
    }
  }, [token]);

  //4 => now click on any one business name in All business then =>
  const getBusiness = async () => {
    const business = await axios.get(
      "https://graph.facebook.com/v15.0/me/businesses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("respons of getBuisness", business.data);
    setAllBusiness(business.data.data);

    //firstBusinessId show be weframe bot only because we are here entering in our project so that we can take out all the whatsapp business accounts connected to our project so that we will take each those whatsapp business accounts id and then
    setProjectsBusinessId(business.data.data[2].id);
    console.log("setFirstBusinessId", business.data.data[2].id);
  };
  console.log("allBusiness", allBusiness);

  useEffect(() => {
    if (projectsBusinessId) {
      selectBusinessAndSetWhatsappBusinessId();
    }
  }, [projectsBusinessId]);

  //5
  const selectBusinessAndSetWhatsappBusinessId = async () => {
    //setFirstBusinessId(oneBusinessId);

    setWhatsappbusinessaccountid(""); // Reset whatsapp business id
    setAllNumbersOfBusiness([]); // Clear phone numbers
    setTo(""); // Clear recipient
    setCustomerTo(""); // Clear customer id
    setFrom(""); // Clear sender
    setMsg(""); // Clear message

    setPhoneNumberId(""); // Clear phone number id
    await getwhatsappBuisnessId();
  };

  //6
  const getwhatsappBuisnessId = async () => {
    const businessNumber = await axios.get(
      `https://graph.facebook.com/v20.0/${projectsBusinessId}/owned_whatsapp_business_accounts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("setwhatappBusinessIdAll", businessNumber.data.data);
    ////////////////////////////////////////here we are getting all the whatsapp business accounts connected to the developer account/// in place of all businesses this all should be seen

    setAllWhatsappBusinessAccountsConnectedToApp(businessNumber.data.data);
    // console.log("setwhatappBusinessname", businessNumber.data.data[0].name);

    setWhatsappbusinessaccountid(businessNumber.data.data[0].id);
    await getAllPhoneNumbersOfBusiness(businessNumber.data.data[0].id);
  };

  //7

  //8
  const getAllPhoneNumbersOfBusiness = async (whatsappbusinessaccountidd) => {
    const phoneNumbers = await axios.get(
      `https://graph.facebook.com/v20.0/${whatsappbusinessaccountidd}/phone_numbers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("phoneNumbers", phoneNumbers.data.data);
    //2: start map to all numbers and for each number check if this number exist in the directus or not, if not then add it to database
    phoneNumbers.data.data.map((eachPhoneNumbers) => {
      //     //check if eachWhatsappBusinessAccount.id already exist in the directus

      CheckPhoneNumberAndCreate(
        eachPhoneNumbers.id,
        eachPhoneNumbers.display_phone_number
      );
      console.log(
        "eachPhoneNumbers.number",
        eachPhoneNumbers.display_phone_number
      );
      //   //if exist do nothing
      //   //if not then create it in directus with information of the user in it
    });

    async function CheckPhoneNumberAndCreate(
      eachPhoneNumberId,
      eachPhoneNumberNumber
    ) {
      try {
        // Check if the business
        console.log("checkphonenumberid", eachPhoneNumberId);
        const phoneNumberExist = await axios.get(
          `http://localhost:8055/items/PhoneNumber/${eachPhoneNumberId}`
        );
        console.log("phoneNumberExist", phoneNumberExist);
        // If the business exists, do nothing
        if (phoneNumberExist) {
          console.log("Business already exists:", eachPhoneNumberId);
          return;
        }
      } catch (error) {
        // If the business does not exist (404 error), create a new one
        if (error.response) {
          try {
            const userResponse = await axios.get(
              "http://localhost:8055/users/me",
              {
                withCredentials: true,
              }
            );
            console.log("userResponse.data.data.id", userResponse.data.data.id);
            const result = splitPhoneNumber(eachPhoneNumberNumber);
            console.log("result.number", result.number);

            const newPhoneNumber = {
              id: eachPhoneNumberId,
              Business_id: whatsappbusinessaccountid,

              number: result.number, // Assuming this is the user ID
            };
            await axios.post(
              `http://localhost:8055/items/PhoneNumber`,
              newPhoneNumber
            );
            console.log("New PhoneNumber created:", eachPhoneNumberId);
          } catch (postError) {
            console.error("Error creating new business:", postError);
          }
        } else {
          console.error("Error checking business existence:", error);
        }
      }
    }

    ///////////////////////utility
    function splitPhoneNumber(phoneNumber) {
      // Modify the regex to capture the number without dashes
      const regex = /^(\+\d{1,3})\s(\d{10})$/;
      const cleanedPhoneNumber = phoneNumber.replace(/-/g, ""); // Remove dashes

      const matches = cleanedPhoneNumber.match(regex);

      if (matches) {
        const countryCode = matches[1];
        const number = matches[2];
        return { countryCode, number };
      } else {
        return null; // if phone number doesn't match the expected pattern
      }
    }

    //  const result = splitPhoneNumber(phoneNumber);

    //////////////////////utility
    //2: end map to all numbers and for each number check if this number exist in the directus or not, if not then add it to database
    //////////edited now
    const UpdatedPhoneNumbers = await axios.get(
      `https://graph.facebook.com/v20.0/${whatsappbusinessaccountidd}/phone_numbers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Phone Numbers:", UpdatedPhoneNumbers.data.data);
    setAllNumbersOfBusiness(UpdatedPhoneNumbers.data.data);
  };

  //10
  useEffect(() => {
    if (from) {
      getAllCustomerNumbersBusinessInteractedWith();
    }
  }, [from]);

  ////////////////////added this part
  const getAllCustomerNumbersBusinessInteractedWith = async () => {
    const allCustomerNumbers = await axios.get(
      `http://localhost:8055/items/PhoneNumber`,
      {
        params: {
          filter: {
            interactedBusinessNumberByCustomer: {
              _eq: phoneNumberId,
            },
          },
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("allCustomerNumbers", allCustomerNumbers.data.data);
    setAllCustomerNumbers(allCustomerNumbers.data.data);
  };

  //15
  const sendMessage = async () => {
    const sendMsg = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recepient_type: "individual",
        to: `${to}`,
        type: "text",
        text: {
          preview_url: false,
          body: `${msg}`,
        },
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const saveToDirectus = await axios.post(
      "http://localhost:8055/items/Message", //////MessageSentByBusiness

      {
        id: sendMsg.data.messages[0].id,
        From: phoneNumberId,
        timestamp: new Date().toISOString(), // Current timestamp,
        body: `${msg}`,
        type: "text",
        status: "sent",
        contacts_id: Number(`${to}`), //make it contacts_id: `91${to}`;
      },
      {
        withCredentials: true,
      }
    );

    // Update the frontend state immediately
    const newMessage = {
      id: sendMsg.data.messages[0].id,
      From: phoneNumberId,
      timestamp: new Date().toISOString(),
      body: `${msg}`,
      type: "text",
      status: "sent",
      contacts_id: Number(`${to}`),
    };

    // Clear the message input field
    setMsg("");

    // Optionally, you can re-fetch all chats to ensure consistency
    // AllCurrentChats();
  };
  console.log(
    "allWhatsappBusinessAccountsConnectedToApp[0].name",
    allWhatsappBusinessAccountsConnectedToApp[0]?.id
  );

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8055/auth/logout",
        { mode: "session" },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>onlogot</button>
      <header className="bg-success text-white text-center py-2">
        <h1>Whatsapp Integrate</h1>
      </header>

      <div className="row mt-3" style={{ height: "580px" }}>
        <div className="allbusinessNumbers col-md-2 border border-success">
          <h5>all numbers of business</h5>
          <ul className="list-group">
            {allNumbersOfBusiness ? (
              <>
                {allNumbersOfBusiness.map((number) => (
                  <li
                    key={number.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() => {
                        setPhoneNumberId(number.id);
                        setFrom(number.display_phone_number);
                      }}
                    >
                      {number.display_phone_number}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className="allChats col-md-3 border border-success ">
          <h5>all chats</h5>
          <ul className="list-group">
            {allCustomerNumbers ? (
              <>
                {allCustomerNumbers.map((eachChat) => (
                  <li
                    key={eachChat.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      onClick={() => {
                        setTo(eachChat.id);
                      }}
                      className="btn btn-secondary btn-sm btn-block w-100"
                    >
                      {eachChat.id}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className="SingleChat col-md-5 border border-success">
          <div className="chat-header">
            <span className="chat-label">From:</span>
            <span className="chat-from">{from && from}</span>
          </div>
          <div className="chat-input">
            <label className="chat-label">To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="chat-to-input"
            />
          </div>

          <div className="chat-messages overflow-auto h-400px p-3 border bg-light">
            {messages ? (
              messages.map((Chat) => (
                <div
                  key={Chat.id}
                  className={`message-container ${
                    Chat.From === phoneNumberId
                      ? "message-from-phone"
                      : "message-from-customer"
                  }`}
                >
                  <div className="message-bubble">{Chat.body}</div>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages</div>
            )}
          </div>
          <div className="chat-input">
            <label className="chat-label">Message:</label>
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="chat-msg-input w-100 mb-3"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm btn-block w-100 mb-2"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Redirecturl;
