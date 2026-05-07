import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [expenses, setExpenses] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/expenses"
      )

      setExpenses(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const addExpense = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/expenses",
        formData
      )

      setExpenses([
        response.data,
        ...expenses
      ])

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: ""
      })

    } catch (error) {
      console.log(error)
    }

  }

  const deleteExpense = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/expenses/${id}`
      )

      setExpenses(
        expenses.filter(
          (expense) => expense.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  )

  return (

    <div className="container">

      <h1>Expense Tracker</h1>

      <form
        className="expense-form"
        onSubmit={addExpense}
      >

        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Expense
        </button>

      </form>

      <div className="total-box">

        <h2>
          Total Expenses: ₹{totalExpenses}
        </h2>

      </div>

      <div className="expense-list">

        {
          expenses.map((expense) => (

            <div
              className="expense-card"
              key={expense.id}
            >

              <h3>{expense.title}</h3>

              <p>
                <strong>Amount:</strong>
                {" "}
                ₹{expense.amount}
              </p>

              <p>
                <strong>Category:</strong>
                {" "}
                {expense.category}
              </p>

              <p>
                <strong>Date:</strong>
                {" "}
                {expense.date}
              </p>

              <button
                onClick={() =>
                  deleteExpense(expense.id)
                }
              >
                Delete
              </button>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App