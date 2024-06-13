import React from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react"
import Logo from "./Logo"
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export const NavBar = () => {
  const [token, setToken] = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    navigate("/")
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Link className="flex items-center" to="/">
          <Logo />
          <p className="ml-2 font-bold text-inherit">Expense Tracker</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Link color="foreground" to="/expense-history">
            Expense History
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {token ? (
          <NavbarItem className="hidden lg:flex">
            <Button onClick={handleLogout} color="secondary" variant="light">
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" to="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}
