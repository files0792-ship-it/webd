const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./hospital.db")

db.run(`
  CREATE TABLE IF NOT EXISTS appointments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT,
    doctorName TEXT,
    date TEXT,
    time TEXT
  )
`)

app.get("/appointments", (req, res) => {

  db.all(
    `
    SELECT *
    FROM appointments
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

app.post("/appointments", (req, res) => {

  const {
    patientName,
    doctorName,
    date,
    time
  } = req.body

  db.run(
    `
    INSERT INTO appointments
    (patientName, doctorName, date, time)
    VALUES (?, ?, ?, ?)
    `,
    [
      patientName,
      doctorName,
      date,
      time
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          patientName,
          doctorName,
          date,
          time
        })

      }

    }

  )

})

app.delete("/appointments/:id", (req, res) => {

  db.run(
    "DELETE FROM appointments WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Appointment cancelled"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})