import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { ErrorMessage } from "../components/ErrorMessage"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmationPassword, setConfirmationPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setToken] = useContext(UserContext)
  const navigate = useNavigate()

  const submitRegistration = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "/api/auth",
        data: {
          username: username,
          email: email,
          password: password,
        },
      })

      setToken(response.data)
    } catch (error) {
      setErrorMessage(error.response.data.detail)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === confirmationPassword && password.length >= 5) {
      submitRegistration()
      navigate("/")
    } else {
      setErrorMessage("Passwords do not match or are too short")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded border border-white bg-slate-900 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Register</h1>
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password validation"
          value={confirmationPassword}
          onChange={(e) => setConfirmationPassword(e.target.value)}
          required
        />

        <ErrorMessage message={errorMessage}></ErrorMessage>

        <Button type="submit" color="primary">
          Register
        </Button>
        <p className="flex justify-center">Already have an account?</p>
        <Button color="secondary" variant="light">
          <Link to="/login">Login</Link>
        </Button>
      </form>
    </div>
  )
}

export default Register
