import { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  async function fetchExpenses() {
    const resp = await axios.get("http://localhost:5000/expenses");
    setExpenses(resp.data);
  }
  
  useEffect(() => {
    fetchExpenses();
  }, []);

  async function addExpense() {
    await axios.post("http://localhost:5000/expenses", { 
      title: title,
      amount: amount,
      category: category  
    
     });

      fetchExpenses();  

      setTitle("");
      setAmount("");
      setCategory("");
  }

  async function deleteExpense(id) {
    await axios.delete(`http://localhost:5000/expenses/${id}`);
    fetchExpenses();

  }

  return (
    <div>
      <h1>Expense Tracker</h1>
      <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} />
      <button onClick={addExpense}>Add Expense</button>

      <div>
        {expenses.map((expense) => (
          <p key={expense.id}>
            <p>{expense.title}</p>
            <p>${expense.amount}</p>
            <p>{expense.category}</p>
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </p>
        ))}
      </div>
    </div>
  )
}

export default App;