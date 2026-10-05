import { Routes, Route } from "react-router-dom"

//auth imports
import Register from "./auth/Register"
import Login from './auth/Login';

const App = () => {
  return (
    <Routes>
      {/*auth routes*/}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />}/>
    </Routes>
  )
}

export default App