const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./feedback.db")

db.run(`
  CREATE TABLE IF NOT EXISTS feedbacks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rating TEXT,
    comments TEXT
  )
`)

app.get("/feedbacks", (req, res) => {

  db.all(
    "SELECT * FROM feedbacks ORDER BY id DESC",
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

app.post("/feedbacks", (req, res) => {

  const {
    name,
    rating,
    comments
  } = req.body

  db.run(
    `
    INSERT INTO feedbacks
    (name, rating, comments)
    VALUES (?, ?, ?)
    `,
    [name, rating, comments],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          name,
          rating,
          comments
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})