import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ExpenseTable from "../components/ExpenseTable"
import { UserContext } from "../context/UserContext"

const ExpenseHistory = (props) => {
  const [token] = useContext(UserContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      setIsLoading(false)
    }
  }, [token, navigate])

  if (isLoading) {
    return null
  }

  return (
    <main className="bg-zinc-950 p-8">
      <ExpenseTable />
    </main>
  )
}

export default ExpenseHistory
