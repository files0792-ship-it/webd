const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./quiz.db")

db.run(`
  CREATE TABLE IF NOT EXISTS results(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT,
    score INTEGER,
    date TEXT
  )
`)

app.get("/results", (req, res) => {

  db.all(
    `
    SELECT *
    FROM results
    ORDER BY score DESC
    `,
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

app.post("/results", (req, res) => {

  const {
    studentName,
    score,
    date
  } = req.body

  db.run(
    `
    INSERT INTO results
    (studentName, score, date)
    VALUES (?, ?, ?)
    `,
    [studentName, score, date],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          studentName,
          score,
          date
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})