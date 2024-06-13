import React from "react";
const columns = [
  {name: "id", uid: "id", sortable: true},
  {name: "Title", uid: "title", sortable: true},
  {name: "Description", uid: "description"},
  {name: "Amount", uid: "amount", sortable: true},
  {name: "Date", uid: "date", sortable: true},
  {name: "Transaction Type", uid: "transaction_type"},
  {name: "Actions", uid: "actions"},
];

const transactionTypes = [
  {name: "Expense", uid: "expense"},
  {name: "Income", uid: "income"},
];

const transactions = [
  {
    id: 1,
    title: "Super",
    description: "Bonpreu",
    transaction_type: "expense",
    amount: "54.98",
    date: "2024-06-08",
  },
  {
    id: 2,
    title: "Super",
    description: "Bonpreu",
    transaction_type: "expense",
    amount: "48.21",
    date: "2024-06-03",
  },
  {
    id: 3,
    title: "Nòmina",
    description: "Maig",
    transaction_type: "income",
    amount: "1500.00",
    date: "2024-06-01",
  },
  {
    id: 4,
    title: "Just Eat",
    description: "Indi",
    transaction_type: "expense",
    amount: "24.65",
    date: "2024-06-02",
  },
  {
    id: 5,
    title: "Leroy Merlin",
    description: "Valla i rodet",
    transaction_type: "expense",
    amount: "65.24",
    date: "2024-06-08",
  },

  {
    id: 6,
    title: "Super",
    description: "Bonpreu",
    transaction_type: "expense",
    amount: "54.98",
    date: "2024-05-08",
  },
  {
    id: 7,
    title: "Super",
    description: "Bonpreu",
    transaction_type: "expense",
    amount: "48.21",
    date: "2024-05-03",
  },
  {
    id: 8,
    title: "Nòmina",
    description: "Maig",
    transaction_type: "income",
    amount: "1500.00",
    date: "2024-05-01",
  },
  {
    id: 9,
    title: "Just Eat",
    description: "Indi",
    transaction_type: "expense",
    amount: "24.65",
    date: "2024-05-02",
  },
  {
    id: 10,
    title: "Leroy Merlin",
    description: "Valla i rodet",
    transaction_type: "expense",
    amount: "65.24",
    date: "2024-05-08",
  },
];

export {columns, transactionTypes};
