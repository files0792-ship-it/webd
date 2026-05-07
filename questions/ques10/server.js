const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./attendance.db")

db.run(`
  CREATE TABLE IF NOT EXISTS attendance(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT,
    date TEXT,
    status TEXT
  )
`)

app.get("/attendance", (req, res) => {

  db.all(
    `
    SELECT *
    FROM attendance
    ORDER BY id DESC
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

app.post("/attendance", (req, res) => {

  const {
    studentName,
    date,
    status
  } = req.body

  db.run(
    `
    INSERT INTO attendance
    (studentName, date, status)
    VALUES (?, ?, ?)
    `,
    [studentName, date, status],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          studentName,
          date,
          status
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})