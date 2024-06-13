import axios from "axios"
import { useTransactions } from "../hooks/useTransactions"

export const useTransactionFormSubmit = () => {
  const { transactions, setTransactions } = useTransactions()

  const submitTransactionForm = async ({
    transaction,
    formData,
    errorMessage,
  }) => {
    try {
      if (errorMessage) return

      if (transaction) {
        const newTransaction = { ...transaction, ...formData }
        const response = await axios.put(
          `/api/transactions/${transaction.id}`,
          {
            ...newTransaction,
          }
        )
        setTransactions(
          transactions.map((t) => (t.id === transaction.id ? response.data : t))
        )
      } else {
        const response = await axios.post("/api/transactions/", {
          ...formData,
        })
        setTransactions([...transactions, response.data])
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  return { submitTransactionForm }
}
