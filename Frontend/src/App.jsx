
import {BrowserRouter, Routes,Route} from "react-router-dom"
import './App.css'
import  Home from "./Component/Home"
import Login from "./Component/Login"
import Register from "./Component/Register"
import Vote from "./Component/Vote"
import Check from "./Component/Check"
import Change_Password from "./Component/Change_Password"
import Navbar from "./Component/Navbar"
import Logout from "./Component/logout";
function App() {


  return (
   <>
   <BrowserRouter>
   <Navbar/>
   <Routes>
<Route path="/login" element={<Login/>} />
<Route path="/" element={<Home/>} />
<Route path="/register" element={<Register/>} />
<Route path="/vote" element={<Vote/>} />
<Route path="/check" element={<Check/>} />
<Route path="logout" element={<Logout/>} />
<Route path="/ChangePassword" element={<Change_Password/>} />



   </Routes>
   
   
   </BrowserRouter>
   
   
   </>
  )
}

export default App
