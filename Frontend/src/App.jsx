import { useContext } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ExpenseHistory from "./pages/ExpenseHistory"

import { Route, Routes } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { NavBar } from "./components/NavBar"

function App() {
  const [token] = useContext(UserContext)

  return (
    <>
      <NavBar />
      <div className="mx-auto min-h-screen max-w-6xl px-2 pt-16 selection:bg-primary selection:text-secondary md:pt-20 lg:px-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/expense-history" element={<ExpenseHistory />} />
        </Routes>
      </div>
    </>
  )
}

export default App
