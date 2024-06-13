import React from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Tooltip,
} from "@nextui-org/react"
import { VerticalDotsIcon } from "./icons/VerticalDotsIcon"
import { SearchIcon } from "./icons/SearchIcon"
import { ChevronDownIcon } from "./icons/ChevronDownIcon"
import { columns, transactionTypes } from "../mocks/data"
import { capitalize } from "../lib/utils"
import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../context/UserContext"
import { TransactionModal } from "./TransactionModal"
import { EditIcon } from "./icons/EditIcon"
import { DeleteIcon } from "./icons/DeleteIcon"
import { EyeIcon } from "./icons/EyeIcon"
import { useTransactions } from "../hooks/useTransactions"
import { useTransactionFormSubmit } from "../hooks/useTransactionFormSubmit"

const transactionsColorMap = {
  income: "success",
  expense: "danger",
}

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "amount",
  "date",
  "transaction_type",
  "actions",
]

export default function ExpenseTable() {
  const [filterValue, setFilterValue] = useState("")
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  })
  const [page, setPage] = useState(1)
  const [token] = useContext(UserContext)
  const { transactions, setTransactions } = useTransactions()
  const { submitForm } = useTransactionFormSubmit()

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredTransactions = [...transactions]

    if (hasSearchFilter) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      transactionTypeFilter !== "all" &&
      Array.from(transactionTypeFilter).length !== transactionTypes.length
    ) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        Array.from(transactionTypeFilter).includes(transaction.transaction_type)
      )
    }

    return filteredTransactions
  }, [transactions, filterValue, transactionTypeFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === "descending" ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = React.useCallback((transaction, columnKey) => {
    const cellValue = transaction[columnKey]

    switch (columnKey) {
      case "title":
        return <p>{transaction.title}</p>
      case "desciption":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {transaction.description}
            </p>
          </div>
        )
      case "transaction_type":
        return (
          <Chip
            className="capitalize"
            color={transactionsColorMap[transaction.transaction_type]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit transaction">
              <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                <TransactionModal
                  transaction={transaction}
                  onSubmit={submitForm}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete transaction">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue("")
    }
  }, [])

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Transaction Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={transactionTypeFilter}
                selectionMode="multiple"
                onSelectionChange={setTransactionTypeFilter}
              >
                {transactionTypes.map((transaction_type) => (
                  <DropdownItem
                    key={transaction_type.uid}
                    className="capitalize"
                  >
                    {capitalize(transaction_type.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <TransactionModal transaction={null} onSubmit={submitForm} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {transactions.length} transactions
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    transactionTypeFilter,
    visibleColumns,
    onRowsPerPageChange,
    transactions.length,
    onSearchChange,
    hasSearchFilter,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }, [selectedKeys, items.length, page, pages, hasSearchFilter])

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No transactions found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
