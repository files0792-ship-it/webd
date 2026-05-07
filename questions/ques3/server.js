const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./employees.db")

db.run(`
  CREATE TABLE IF NOT EXISTS employees(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    department TEXT,
    salary TEXT,
    email TEXT
  )
`)

app.get("/employees", (req, res) => {

  db.all(
    "SELECT * FROM employees ORDER BY id DESC",
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

app.post("/employees", (req, res) => {

  const {
    name,
    department,
    salary,
    email
  } = req.body

  db.run(
    `
    INSERT INTO employees
    (name, department, salary, email)
    VALUES (?, ?, ?, ?)
    `,
    [name, department, salary, email],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          name,
          department,
          salary,
          email
        })

      }

    }

  )

})

app.put("/employees/:id", (req, res) => {

  const {
    name,
    department,
    salary,
    email
  } = req.body

  db.run(
    `
    UPDATE employees
    SET
    name=?,
    department=?,
    salary=?,
    email=?
    WHERE id=?
    `,
    [
      name,
      department,
      salary,
      email,
      req.params.id
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:Number(req.params.id),
          name,
          department,
          salary,
          email
        })

      }

    }

  )

})

app.delete("/employees/:id", (req, res) => {

  db.run(
    "DELETE FROM employees WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Employee deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})