const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./expenses.db")

db.run(`
  CREATE TABLE IF NOT EXISTS expenses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    amount TEXT,
    category TEXT,
    date TEXT
  )
`)

app.get("/expenses", (req, res) => {

  db.all(
    "SELECT * FROM expenses ORDER BY id DESC",
    [],
    (err, rows) => {

      if(err){
        res.status(500).json(err)
      }else{
        res.json(rows)
      }

    }
  )

})

app.post("/expenses", (req, res) => {

  const {
    title,
    amount,
    category,
    date
  } = req.body

  db.run(
    `
    INSERT INTO expenses
    (title, amount, category, date)
    VALUES (?, ?, ?, ?)
    `,
    [title, amount, category, date],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          title,
          amount,
          category,
          date
        })

      }

    }

  )

})

app.delete("/expenses/:id", (req, res) => {

  db.run(
    "DELETE FROM expenses WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Expense deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})