import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Redirecturl from "./components/Redirecturl/Redirecturl";
import Access from "./components/Access/Access";
import ProvideAccessToken from "./components/ProvideAccessToken/ProvideAccessToken";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/provideaccesstoken" element={<ProvideAccessToken />} />
          <Route path="/redirecturl" element={<Redirecturl />} />
          <Route path="/access" element={<Access />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
