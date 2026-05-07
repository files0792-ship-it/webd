const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./notes.db")

db.run(`
  CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`)

app.get("/notes", (req, res) => {

  db.all(
    "SELECT * FROM notes ORDER BY id DESC",
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

app.post("/notes", (req, res) => {

  const {
    title,
    content
  } = req.body

  db.run(
    `
    INSERT INTO notes
    (title, content)
    VALUES (?, ?)
    `,
    [title, content],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          title,
          content
        })

      }

    }

  )

})

app.put("/notes/:id", (req, res) => {

  const {
    title,
    content
  } = req.body

  db.run(
    `
    UPDATE notes
    SET
    title=?,
    content=?
    WHERE id=?
    `,
    [
      title,
      content,
      req.params.id
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:Number(req.params.id),
          title,
          content
        })

      }

    }

  )

})

app.delete("/notes/:id", (req, res) => {

  db.run(
    "DELETE FROM notes WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Note deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})