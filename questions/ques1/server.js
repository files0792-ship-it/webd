const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./students.db")

db.run(`
  CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rollNumber TEXT,
    email TEXT,
    course TEXT
  )
`)

app.get("/students", (req, res) => {

  db.all(
    "SELECT * FROM students",
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

app.post("/students", (req, res) => {

  const {
    name,
    rollNumber,
    email,
    course
  } = req.body

  db.run(
    `
    INSERT INTO students
    (name, rollNumber, email, course)
    VALUES (?, ?, ?, ?)
    `,
    [name, rollNumber, email, course],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          name,
          rollNumber,
          email,
          course
        })

      }

    }

  )

})

app.delete("/students/:id", (req, res) => {

  db.run(
    "DELETE FROM students WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{
        res.json({
          message:"Student deleted"
        })
      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})