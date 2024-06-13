import { useContext, useState } from "react"
import { ErrorMessage } from "../components/ErrorMessage"
import { UserContext } from "../context/UserContext"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setToken] = useContext(UserContext)
  const navigate = useNavigate()

  const submitLogin = async () => {
    let bodyFormData = new FormData()
    bodyFormData.append("username", username)
    bodyFormData.append("password", password)

    try {
      const response = await axios({
        method: "POST",
        url: "/api/auth/token",
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })

      setToken(response.data.access_token)
      navigate("/")
    } catch (error) {
      setErrorMessage(error.response.data.detail)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitLogin()
  }

  return (
    <div className="mx-auto max-w-md rounded border border-white bg-slate-900 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Login</h1>
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <ErrorMessage message={errorMessage}></ErrorMessage>
        <Button type="submit" color="primary">
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login
