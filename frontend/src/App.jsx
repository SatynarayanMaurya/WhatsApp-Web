import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import IndividualChat from "./pages/IndividualChat"
import HeroSection from "./pages/HeroSection"
import DefaultChatPage from "./pages/DefaultChatPage"
import Profile from "./pages/Profile"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import PrivateRoute from "./components/PrivateRoute"
import AiChatPage from "./components/AiChatPage"
import StatusPage from "./pages/StatusPage"
import StatusDefaultPage from "./components/StatusDefaultPage"
import IndividualStatusPage from "./pages/IndividualStatusPage"

function App() {

  return (
    <div >

      <Routes>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute> }>
          <Route path="/" element={<PrivateRoute><HeroSection/></PrivateRoute> }>
            <Route path="/" element={<DefaultChatPage/>}/>
            <Route path="/meta-ai" element={<AiChatPage/>}/>
            <Route path="/:id" element={<IndividualChat/>}/>
          </Route>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/status" element={<StatusPage/>}>
            <Route path="/status" element={<StatusDefaultPage/>}/>
            <Route path="/status/:id" element={<IndividualStatusPage/>}/>
          </Route>
        </Route>
      </Routes>
      
    </div>
  )
}

export default App
