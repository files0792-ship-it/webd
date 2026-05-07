const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./library.db")

db.run(`
  CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    isbn TEXT,
    status TEXT
  )
`)

app.get("/books", (req, res) => {

  db.all(
    "SELECT * FROM books ORDER BY id DESC",
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

app.post("/books", (req, res) => {

  const {
    title,
    author,
    isbn,
    status
  } = req.body

  db.run(
    `
    INSERT INTO books
    (title, author, isbn, status)
    VALUES (?, ?, ?, ?)
    `,
    [title, author, isbn, status],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          title,
          author,
          isbn,
          status
        })

      }

    }

  )

})

app.put("/books/:id", (req, res) => {

  const { status } = req.body

  db.run(
    `
    UPDATE books
    SET status=?
    WHERE id=?
    `,
    [status, req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        db.get(
          "SELECT * FROM books WHERE id=?",
          [req.params.id],

          (err, row) => {

            if(err){
              res.status(500).json(err)
            }else{
              res.json(row)
            }

          }

        )

      }

    }

  )

})

app.delete("/books/:id", (req, res) => {

  db.run(
    "DELETE FROM books WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Book deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})