import { Route, Routes } from "react-router-dom";

import Status from "./components/Status/Status";
import Homepage from "./components/Homepage";
import StatusViewer from "./components/Status/StatusViewer";
import Signin from "./components/Register/Signin";
import SignUp from "./components/Register/SignUp";
import Profile from "./components/Profile/Profile";


function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/status" element={<Status/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        
        <Route path="/status/:userId" element={<StatusViewer/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
