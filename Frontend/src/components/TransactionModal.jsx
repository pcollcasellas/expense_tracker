import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react"
import { PlusIcon } from "./icons/PlusIcon"
import { EditIcon } from "./icons/EditIcon"
import { DatePicker } from "@nextui-org/react"
import { ErrorMessage } from "../components/ErrorMessage"
import { Select, SelectItem } from "@nextui-org/react"
import axios from "axios"
import { useTransactions } from "../hooks/useTransactions"

const TRANSACTION_TYPES = [
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
]

export function TransactionModal({ transaction, onSubmit }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    transaction_type: "expense",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  })
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        description: transaction.description,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        date: transaction.date,
      })
    }
  }, [])

  const onChange = (event) => {
    if (event.target.name === "amount" && event.target.value < 0) {
      setErrorMessage("Amount cannot be negative")
    } else {
      setErrorMessage("")
    }
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    onSubmit(transaction, formData, errorMessage)
  }

  return (
    <>
      {transaction ? (
        <EditIcon onClick={onOpen} />
      ) : (
        <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
          Add new
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Transaction</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    autoFocus
                    type="text"
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => onChange(e)}
                    isRequired
                    required
                  />
                  <Input
                    type="text"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => onChange(e)}
                    isRequired
                    required
                  />
                  <Select
                    label="Transaction type"
                    name="transaction_type"
                    defaultSelectedKeys={[formData.transaction_type]}
                    value={formData.transaction_type}
                    onChange={(e) => onChange(e)}
                    isRequired
                    required
                  >
                    {TRANSACTION_TYPES.map((transaction_type) => (
                      <SelectItem key={transaction_type.key}>
                        {transaction_type.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => onChange(e)}
                  />
                  <Input
                    type="date"
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => onChange(e)}
                    isRequired
                    required
                  />
                  <ErrorMessage message={errorMessage} />

                  <div className="flex justify-end gap-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" onPress={onClose}>
                      Create
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
