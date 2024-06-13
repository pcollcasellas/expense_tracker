import React, { useState, useEffect } from "react"
import axios from "axios"

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/transactions/")
        setTransactions(response.data)
        setLoading(false)
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    fetchTransactions()

    // Clean up function (optional)
    return () => {
      // Cancel any pending requests or clean up if needed
    }
  }, [])

  return { transactions, setTransactions }
}
