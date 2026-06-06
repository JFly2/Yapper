import './App.css';
import {Route, Routes} from "react-router";
import {RegisterPage} from "./pages/RegisterPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx"
import {ChatPage} from "./pages/ChatPage.jsx";

function App(){
   return (
       <Routes>
          <Route path={"/"} element={<RegisterPage />}></Route>
           <Route path={"/login"} element={<LoginPage />}></Route>
           <Route path={"/chat"} element={<ChatPage />}></Route>
       </Routes>
   );
}

export default App
