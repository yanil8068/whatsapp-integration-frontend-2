// ////do business ke same number nahi ho sakte , dono business ke alag alag number honge, unke basis pe chat search kiya hai

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Redirecturl.css";

// const Redirecturl = () => {
//   const [code, setCode] = useState();
//   const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
//   const [firstBusinessId, setFirstBusinessId] = useState("");
//   const [allBusiness, setAllBusiness] = useState("");
//   const [allNumbersOfBusiness, setAllNumbersOfBusiness] = useState();
//   const [whatsappbusinessaccountid, setWhatsappbusinessaccountid] =
//     useState("");
//   const [to, setTo] = useState();
//   const [customerTo, setCustomerTo] = useState();
//   const [from, setFrom] = useState();
//   const [msg, setMsg] = useState("");
//   const [allChats, setAllChats] = useState([]);
//   const [currentChats, setCurrentChats] = useState();

//   const [phoneNumberId, setPhoneNumberId] = useState();
//   let clientId = process.env.REACT_APP_CLIENT_ID;
//   let clientSecret = process.env.REACT_APP_CLIENT_SECRET;
//   const directusToken = process.env.REACT_APP_DIRECTUS_ADMINISTRATOR_TOKEN;

//   // Polling useEffect
//   useEffect(() => {
//     const interval = setInterval(AllCurrentChats, 2000); // Poll every 2 seconds

//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, [phoneNumberId, directusToken, customerTo]);

//   //1
//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const retrievedCode = searchParams.get("code");
//     setCode(retrievedCode);
//     console.log("code", retrievedCode);
//   }, []);

//   //2
//   useEffect(() => {
//     if (code && !token) {
//       fetchAccessToken();
//     }
//   }, [code]);
//   const fetchAccessToken = async () => {
//     try {
//       const response = await axios.post(url);
//       setToken(response.data);
//       console.log("Access Token Response:", response.data.access_token);
//       setToken(response.data.access_token);
//       localStorage.setItem("accessToken", response.data.access_token);
//     } catch (error) {
//       console.error("Error fetching access token:", error);
//     }
//   };

//   //3
//   useEffect(() => {
//     if (token) {
//       getBusiness();
//     }
//   }, [token]);

//   const url = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${clientId}&redirect_uri=http://localhost:3000/redirecturl&client_secret=${clientSecret}&code=${code}`;

//   //4 => now click on any one business name in All business then =>
//   const getBusiness = async () => {
//     const business = await axios.get(
//       "https://graph.facebook.com/v15.0/me/businesses",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("respons of getBuisness", business.data);
//     setAllBusiness(business.data.data);

//     setFirstBusinessId(business.data.data[2].id);
//   };
//   console.log("allBusiness", allBusiness);

//   //allBusiness.map((eachbusiness)=>selectBusinessAndSetWhatsappBusinessId(eachbusiness.id) ,getwhatsappBuisnessId()=>)
//     //setWhatsappbusinessaccountid(businessNumber.data.data[0].id);=>getAllPhoneNumbersOfBusiness()=>setAllNumbersOfBusiness
//     //=>allNumbersOfBusiness.map((eachnumber)=>setPhoneNumberId() and From())
//   //5
//   const selectBusinessAndSetWhatsappBusinessId = async (oneBusinessId) => {
//     // setFirstBusinessId(oneBusinessId);

//     setWhatsappbusinessaccountid(""); // Reset whatsapp business id
//     setAllNumbersOfBusiness([]); // Clear phone numbers
//     setTo(""); // Clear recipient
//     setCustomerTo(""); // Clear customer id
//     setFrom(""); // Clear sender
//     setMsg(""); // Clear message
//     setAllChats([]); // Clear all chats
//     setCurrentChats([]); // Clear current chats
//     setPhoneNumberId(""); // Clear phone number id
//     await getwhatsappBuisnessId();
//   };

//   //6
//   const getwhatsappBuisnessId = async () => {
//     const businessNumber = await axios.get(
//       `https://graph.facebook.com/v20.0/${firstBusinessId}/owned_whatsapp_business_accounts`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("setwhatappBusinessIdAll", businessNumber.data);
//     console.log("setwhatappBusinessId", businessNumber.data.data[0].id);
//     setWhatsappbusinessaccountid(businessNumber.data.data[0].id);
//   };

//   //7
//   useEffect(() => {
//     if (whatsappbusinessaccountid) {
//       getAllPhoneNumbersOfBusiness();
//     }
//   }, [whatsappbusinessaccountid]);

//   //8
//   const getAllPhoneNumbersOfBusiness = async () => {
//     const phoneNumbers = await axios.get(
//       `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("Phone Numbers:", phoneNumbers.data.data);
//     setAllNumbersOfBusiness(phoneNumbers.data.data);
//   };

//   //9 is when we click on that particular number then it setPhoneNumberId() and From() then =>

//   // const getPhoneNumberId = async () => {
//   //   const phoneNumbers = await axios.get(
//   //     `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
//   //     {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     }
//   //   );
//   //   console.log("Phone Numbers:", phoneNumbers.data.data);
//   //   setAllNumbersOfBusiness(phoneNumbers.data.data);
//   //   console.log("allnumbersofbusiness", allNumbersOfBusiness);
//   //   console.log("Phone Numbers testing:", phoneNumbers.data.data[0].id);
//   //   setPhoneNumberId(phoneNumbers.data.data[0].id);
//   // };

//   //10
//   useEffect(() => {
//     if (from) {
//       getAllChats();
//     }
//   }, [from]);

//   //11
//   const getAllChats = async () => {
//     const allChats = await axios.get(
//       `http://localhost:8055/items/MessageSentByBusiness`,
//       {
//         params: {
//           filter: {
//             From: {
//               _eq: phoneNumberId,
//             },
//           },
//         },
//         headers: {
//           Authorization: `Bearer ${directusToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("allChats", allChats.data.data);
//     setAllChats(allChats.data.data);
//     // Create a map to filter out duplicate contacts_id
//     const uniqueChats = allChats.data.data.reduce((acc, chat) => {
//       // Check if chat's contacts_id is already in the map
//       if (
//         !acc.some(
//           (existingChat) => existingChat.contacts_id === chat.contacts_id
//         )
//       ) {
//         acc.push(chat);
//       }
//       return acc;
//     }, []);

//     console.log("uniqueChats,", uniqueChats);
//     setAllChats(uniqueChats);
//   };

//   //12 on click of the button in All chats =>
//   //setTo(eachChat.contacts_id);
//   // setCustomerTo(91 + eachChat.contacts_id);
//   // 13
//   const AllCurrentChats = async () => {
//     console.log("cutomerTo", customerTo);
//     if (customerTo && phoneNumberId) {
//       const response = await axios.get(
//         `http://localhost:8055/items/MessageSentByBusiness`,
//         {
//           params: {
//             filter: {
//               _or: [
//                 {
//                   From: {
//                     _eq: phoneNumberId,
//                   },
//                   contacts_id: {
//                     _eq: to,
//                   },
//                 },
//                 {
//                   From: {
//                     _eq: customerTo,
//                   },
//                   contacts_id: {
//                     _eq: phoneNumberId,
//                   },
//                 },
//               ],
//             },
//           },
//           headers: {
//             Authorization: `Bearer ${directusToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Sort the chats by timestamp in ascending order (oldest first)
//       const sortedChats = response.data.data.sort(
//         (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//       );

//       console.log("AllCurrentChats", sortedChats);
//       setCurrentChats(sortedChats);
//     }
//   };

//   //14 we write message and send message by click on send message
//   //15
//   const sendMessage = async () => {
//     const sendMsg = await axios.post(
//       `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
//       {
//         messaging_product: "whatsapp",
//         recepient_type: "individual",
//         to: `91${to}`,
//         type: "text",
//         text: {
//           preview_url: false,
//           body: `${msg}`,
//         },
//       },

//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     let fromm = phoneNumberId.toString();
//     console.log("from", fromm);

//     const saveToDirectus = await axios.post(
//       "http://localhost:8055/items/MessageSentByBusiness",

//       {
//         id: sendMsg.data.messages[0].id,
//         From: phoneNumberId,
//         timestamp: new Date().toISOString(), // Current timestamp,
//         body: `${msg}`,
//         type: "text",
//         status: "sent",
//         contacts_id: Number(`${to}`), //make it contacts_id: `91${to}`;
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${directusToken}`,
//         },
//       }
//     );

//     // Update the frontend state immediately
//     const newMessage = {
//       id: sendMsg.data.messages[0].id,
//       From: phoneNumberId,
//       timestamp: new Date().toISOString(),
//       body: `${msg}`,
//       type: "text",
//       status: "sent",
//       contacts_id: Number(`${to}`),
//     };

//     setCurrentChats((prevChats) => [newMessage, ...prevChats]);

//     // Clear the message input field
//     setMsg("");

//     // Optionally, you can re-fetch all chats to ensure consistency
//     AllCurrentChats();
//   };

//   return (
//     <div>
//       <header className="bg-success text-white text-center py-2">
//         <h1>Whatsapp Integrate</h1>
//       </header>
//       <div className="row mt-3" style={{ height: "580px" }}>
//         <div className="allbusiness col-md-2 border border-success">
//           <h5>All Businesses</h5>
//           <ul className="list-group">
//             {allBusiness ? (
//               allBusiness.map((onebusiness) => (
//                 <div key={onebusiness.id}>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <button
//                       className="btn btn-secondary btn-sm btn-block w-100"
//                       onClick={() =>
//                         selectBusinessAndSetWhatsappBusinessId(onebusiness.id)
//                       }
//                     >
//                       {onebusiness.name}
//                     </button>
//                   </li>
//                 </div>
//               ))
//             ) : (
//               <li className="list-group-item">No businesses found</li>
//             )}
//           </ul>
//         </div>
//         <div className="allbusinessNumbers col-md-2 border border-success">
//           <h5>all numbers of business</h5>
//           <ul className="list-group">
//             {allNumbersOfBusiness ? (
//               <>
//                 {allNumbersOfBusiness.map((number) => (
//                   <li
//                     key={number.id}
//                     className="list-group-item d-flex justify-content-between align-items-center"
//                   >
//                     <button
//                       className="btn btn-secondary btn-sm btn-block w-100"
//                       onClick={() => {
//                         setPhoneNumberId(number.id);
//                         setFrom(number.display_phone_number);
//                       }}
//                     >
//                       {number.display_phone_number}
//                     </button>
//                   </li>
//                 ))}
//               </>
//             ) : (
//               <></>
//             )}
//           </ul>
//         </div>
//         <div className="allChats col-md-3 border border-success ">
//           <h5>all chats</h5>
//           <ul className="list-group">
//             {allChats ? (
//               <>
//                 {allChats.map((eachChat) => (
//                   <li
//                     key={eachChat.id}
//                     className="list-group-item d-flex justify-content-between align-items-center"
//                   >
//                     <button
//                       className="btn btn-secondary btn-sm btn-block w-100"
//                       onClick={() => {
//                         setTo(eachChat.contacts_id);
//                         setCustomerTo(91 + eachChat.contacts_id);
//                         AllCurrentChats();
//                       }}
//                     >
//                       {eachChat.contacts_id}
//                     </button>
//                   </li>
//                 ))}
//               </>
//             ) : (
//               <></>
//             )}
//           </ul>
//         </div>
//         <div className="SingleChat col-md-5 border border-success">
//           <div className="chat-header">
//             <span className="chat-label">From:</span>
//             <span className="chat-from">{from && from}</span>
//           </div>
//           <div className="chat-input">
//             <label className="chat-label">To:</label>
//             <input
//               type="text"
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               className="chat-to-input"
//             />
//           </div>
//           <div className="chat-messages overflow-auto h-400px p-3 border bg-light">
//             {currentChats ? (
//               currentChats.map((Chat) => (
//                 <div
//                   key={Chat.id}
//                   className={`message-container ${
//                     Chat.From === phoneNumberId
//                       ? "message-from-phone"
//                       : "message-from-customer"
//                   }`}
//                 >
//                   <div className="message-bubble">{Chat.body}</div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-messages">No messages</div>
//             )}
//           </div>
//           <div className="chat-input">
//             <label className="chat-label">Message:</label>
//             <input
//               type="text"
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               className="chat-msg-input w-100 mb-3"
//             />
//           </div>
//           <button
//             className="btn btn-secondary btn-sm btn-block w-100 mb-2"
//             onClick={sendMessage}
//           >
//             Send Message
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Redirecturl;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////do business ke same number nahi ho sakte , dono business ke alag alag number honge, unke basis pe chat search kiya hai

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Redirecturl.css";

const Redirecturl = () => {
  const [code, setCode] = useState();
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
  const [to, setTo] = useState();
  const [customerTo, setCustomerTo] = useState();
  const [from, setFrom] = useState();
  const [msg, setMsg] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [allChatsByCustomer, setAllChatsByCustomer] = useState([]);
  const [currentChats, setCurrentChats] = useState();

  ////////////websocket
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const connection = useRef(null); // WebSocket connection reference

  const urll = "ws://localhost:8055/websocket";

  const handleShowCurrentChats = (e) => {
    // Create new WebSocket connection
    connection.current = new WebSocket(urll);

    connection.current.onopen = () => {
      connection.current.send(
        JSON.stringify({
          type: "auth",
          access_token: process.env.React_APP_DIRECTUS_TOKEN, // Send access token instead of email/password
        })
      );
    };

    connection.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleReceiveMessage(data);
    };

    connection.current.onclose = () => {
      console.log("WebSocket closed");
    };
  };

  const handleReceiveMessage = (data) => {
    console.log("Received message", data);

    if (data.type === "auth" && data.status === "ok") {
      console.log("Authentication successful");
      connection.current.send(
        JSON.stringify({
          type: "subscribe",
          collection: "Message",
          query: {
            filter: {
              _or: [
                {
                  from: {
                    _eq: phoneNumberId,
                  },
                  contacts_id: {
                    _eq: to,
                  },
                },
                {
                  from: {
                    _eq: to,
                  },
                  contacts_id: {
                    _eq: phoneNumberId,
                  },
                },
              ],
            },
            fields: ["*", "user_created.first_name"], // Fetch all fields plus user's first name
          },
        })
      );
    }

    if (data.type === "auth" && data.status === "ok") {
      console.log("Authentication successful");
      connection.current.send(
        JSON.stringify({
          type: "subscribe",
          collection: "Message",
          query: {
            fields: ["*"],
          },
        })
      );
    }

    if (data.type === "subscription" && data.event === "init") {
      // Initialize with existing messages
      setMessages(data.data);
    }

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

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (connection.current) {
      connection.current.send(
        JSON.stringify({
          type: "items",
          collection: "Message",
          action: "create",
          data: { text: messageText },
        })
      );
      setMessageText(""); // Clear the input field
    }
  };

  ////////////websocket

  const [phoneNumberId, setPhoneNumberId] = useState();
  let clientId = process.env.REACT_APP_CLIENT_ID;
  let clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const directusToken = process.env.REACT_APP_DIRECTUS_ADMINISTRATOR_TOKEN;

  ////////////////////////////////////////////////////entire flow correction code///////

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
  //1: end after login getting all the whatsapp business accounts connected to the app from developer api and check if a particular business is newly created then add it to database

  ////////////////////////////////////////////////////entire flow correction code///////

  // Polling useEffect
  useEffect(() => {
    const interval = setInterval(AllCurrentChats, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [phoneNumberId, directusToken, customerTo]);

  //1
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const retrievedCode = searchParams.get("code");
    setCode(retrievedCode);
    console.log("code", retrievedCode);
  }, []);

  //2
  useEffect(() => {
    if (code && !token) {
      fetchAccessToken();
    }
  }, [code]);
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(url);
      setToken(response.data);
      console.log("Access Token Response:", response.data.access_token);
      setToken(response.data.access_token);
      localStorage.setItem("accessToken", response.data.access_token);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  //3
  useEffect(() => {
    if (token) {
      getBusiness();
    }
  }, [token]);

  const url = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${clientId}&redirect_uri=http://localhost:3000/redirecturl&client_secret=${clientSecret}&code=${code}`;

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

  //allBusiness.map((eachbusiness)=>selectBusinessAndSetWhatsappBusinessId(eachbusiness.id) ,getwhatsappBuisnessId()=>)
  //setWhatsappbusinessaccountid(businessNumber.data.data[0].id);=>getAllPhoneNumbersOfBusiness()=>setAllNumbersOfBusiness
  //=>allNumbersOfBusiness.map((eachnumber)=>setPhoneNumberId() and From())

  //allBusiness.map((eachbusiness)=>getwhatsappBuisnessId()=>)
  //setWhatsappbusinessaccountid(businessNumber.data.data[0].id);=>getAllPhoneNumbersOfBusiness()=>"setAllNumbersOfBusiness"
  //
  //=>allNumbersOfBusiness.map((eachnumber)=>setPhoneNumberId() and From())=> getAllChats=>setAllChats
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   useEffect(() => {
  //     if (allBusiness) {
  // async function getAllNumbers(){
  //   // await getwhatsappBuisnessId();
  //   // await setWhatsappbusinessaccountid();
  //   const businessNumber = await axios.get(
  //     `https://graph.facebook.com/v20.0/${firstBusinessId}/owned_whatsapp_business_accounts`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );
  // console.log("setwhatappBusinessIdAll", businessNumber.data);
  // console.log("setwhatappBusinessId", businessNumber.data.data[0].id);
  // setWhatsappbusinessaccountid(businessNumber.data.data[0].id);

  // await getAllPhoneNumbersOfBusiness();
  //   const phoneNumbers = await axios.get(
  //     `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("Phone Numbers:", phoneNumbers.data.data);

  //   // setAllNumbersOfBusiness(phoneNumbers.data.data);
  //   await setAllNumbersOfBusiness([allNumbersOfBusiness,...newnumbersofbusiness]);

  // }
  // getAllNumbers()
  //     }
  //   }, [allBusiness]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //5
  const selectBusinessAndSetWhatsappBusinessId = async () => {
    //setFirstBusinessId(oneBusinessId);

    setWhatsappbusinessaccountid(""); // Reset whatsapp business id
    setAllNumbersOfBusiness([]); // Clear phone numbers
    setTo(""); // Clear recipient
    setCustomerTo(""); // Clear customer id
    setFrom(""); // Clear sender
    setMsg(""); // Clear message
    setAllChats([]); // Clear all chats
    setAllChatsByCustomer([]);
    setCurrentChats([]); // Clear current chats
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
    console.log("setwhatappBusinessname", businessNumber.data.data[0].name);

    setWhatsappbusinessaccountid(businessNumber.data.data[0].id);
  };

  //7
  // useEffect(() => {
  //   if (whatsappbusinessaccountid) {
  //     getAllPhoneNumbersOfBusiness();
  //   }
  // }, [whatsappbusinessaccountid]);

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

    console.log("Phone Numbers:", phoneNumbers.data.data);
    setAllNumbersOfBusiness(phoneNumbers.data.data);
  };

  //9 is when we click on that particular number then it setPhoneNumberId() and From() then =>

  // const getPhoneNumberId = async () => {
  //   const phoneNumbers = await axios.get(
  //     `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("Phone Numbers:", phoneNumbers.data.data);
  //   setAllNumbersOfBusiness(phoneNumbers.data.data);
  //   console.log("allnumbersofbusiness", allNumbersOfBusiness);
  //   console.log("Phone Numbers testing:", phoneNumbers.data.data[0].id);
  //   setPhoneNumberId(phoneNumbers.data.data[0].id);
  // };

  //10
  useEffect(() => {
    if (from) {
      getAllChats();
      getAllChatsByCustomer();
    }
  }, [from]);

  //11
  const getAllChats = async () => {
    ///////////////this data comes from backend so in directus hooks implement functionality that if a new contact sends message to business then that contact first get created in database and then its message get created in database and then the frontend will show its number in all chats and when a business clicks on that then its message also shows on chat
    // const allChats = await axios.get(
    //   `http://localhost:8055/items/MessageSentByBusiness`,
    //   {
    //     params: {
    //       filter: {
    //         From: {
    //           _eq: phoneNumberId,
    //         },
    //       },
    //     },
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    const allChats = await axios.get(`http://localhost:8055/items/Message`, {
      params: {
        filter: {
          From: {
            _eq: phoneNumberId,
          },
        },
      },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("allChats", allChats.data.data);
    setAllChats(allChats.data.data);
    // Create a map to filter out duplicate contacts_id
    const uniqueChats = allChats.data.data.reduce((acc, chat) => {
      // Check if chat's contacts_id is already in the map
      if (
        !acc.some(
          (existingChat) => existingChat.contacts_id === chat.contacts_id
        )
      ) {
        acc.push(chat);
      }
      return acc;
    }, []);

    console.log("uniqueChats,", uniqueChats);
    setAllChats(uniqueChats);
  };

  const getAllChatsByCustomer = async () => {
    ///////////////this data comes from backend so in directus hooks implement functionality that if a new contact sends message to business then that contact first get created in database and then its message get created in database and then the frontend will show its number in all chats and when a business clicks on that then its message also shows on chat
    // const allChats = await axios.get(
    //   `http://localhost:8055/items/MessageSentByBusiness`,
    //   {
    //     params: {
    //       filter: {
    //         From: {
    //           _eq: phoneNumberId,
    //         },
    //       },
    //     },
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    const allChatsByCustomer = await axios.get(
      `http://localhost:8055/items/Message`,
      {
        params: {
          filter: {
            contacts_id: {
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
    console.log("allChatsByCustomer", allChatsByCustomer.data.data);
    setAllChatsByCustomer(allChatsByCustomer.data.data);
    // Create a map to filter out duplicate contacts_id
    const uniqueChatsByCustomer = allChatsByCustomer.data.data.reduce(
      (acc, chat) => {
        // Check if chat's contacts_id is already in the map
        if (
          !acc.some(
            (existingChat) => existingChat.phoneNumberId === chat.phoneNumberId
          )
        ) {
          acc.push(chat);
        }
        return acc;
      },
      []
    );

    console.log("uniqueChatsByCustomer,", uniqueChatsByCustomer);
    setAllChatsByCustomer(uniqueChatsByCustomer);
  };

  //12 on click of the button in All chats =>
  //setTo(eachChat.contacts_id);
  // setCustomerTo(91 + eachChat.contacts_id);
  // 13
  const AllCurrentChats = async () => {
    console.log("cutomerTo", customerTo);
    if (customerTo && phoneNumberId) {
      const response = await axios.get(
        `http://localhost:8055/items/Message`, //////////it was MessageSentByBusiness before Message
        {
          params: {
            filter: {
              _or: [
                {
                  From: {
                    _eq: phoneNumberId,
                  },
                  contacts_id: {
                    _eq: to, ///////////////it was to before Message implementation
                  },
                },
                {
                  From: {
                    _eq: to, /////it was customerTo before Message implementation
                  },
                  contacts_id: {
                    _eq: phoneNumberId,
                  },
                },
              ],
            },
          },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sort the chats by timestamp in ascending order (oldest first)
      const sortedChats = response.data.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      console.log("AllCurrentChats", sortedChats);
      setCurrentChats(sortedChats);
    }
  };

  //14 we write message and send message by click on send message
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

    let fromm = phoneNumberId.toString();
    console.log("from", fromm);

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

    setCurrentChats((prevChats) => [newMessage, ...prevChats]);

    // Clear the message input field
    setMsg("");

    // Optionally, you can re-fetch all chats to ensure consistency
    AllCurrentChats();
  };
  console.log(
    "allWhatsappBusinessAccountsConnectedToApp",
    allWhatsappBusinessAccountsConnectedToApp
  );

  //////////////////////////////////////////////////////////////////websocket flow
  // const connection = useRef(null); // WebSocket connection reference

  //////////////////////////////////////////////////////////////////websocket flow

  return (
    <div>
      <header className="bg-success text-white text-center py-2">
        <h1>Whatsapp Integrate</h1>
      </header>
      {/* {token ? <>{token}</> : <></>} */}
      <div className="row mt-3" style={{ height: "580px" }}>
        <div className="allbusiness col-md-2 border border-success">
          <h5>All whatsapp Business accounts </h5>
          <ul className="list-group">
            {allWhatsappBusinessAccountsConnectedToApp ? (
              allWhatsappBusinessAccountsConnectedToApp.map((onebusiness) => (
                <div key={onebusiness.id}>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() =>
                        getAllPhoneNumbersOfBusiness(onebusiness.id)
                      }
                    >
                      {onebusiness.name}
                    </button>
                  </li>
                </div>
              ))
            ) : (
              <li className="list-group-item">No businesses found</li>
            )}
          </ul>
        </div>

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
            {allChats ? (
              <>
                {allChats.map((eachChat) => (
                  <li
                    key={eachChat.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() => {
                        setTo(eachChat.contacts_id);
                        setCustomerTo(91 + eachChat.contacts_id);
                        AllCurrentChats();
                        handleShowCurrentChats();
                      }}
                    >
                      {eachChat.contacts_id}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
          <hr />
          <ul className="list-group">
            {allChatsByCustomer ? (
              <>
                {allChatsByCustomer.map((eachChat) => (
                  <li
                    key={eachChat.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      onClick={() => {
                        setTo(eachChat.From);
                        setCustomerTo(91 + eachChat.From);
                        AllCurrentChats();
                        handleShowCurrentChats();
                      }}
                      className="btn btn-secondary btn-sm btn-block w-100"
                    >
                      {eachChat.From}
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
          {/* <div className="chat-messages overflow-auto h-400px p-3 border bg-light">
            {currentChats ? (
              currentChats.map((Chat) => (
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
          </div> */}
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
