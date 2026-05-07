const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())
dfdf
const db = new sqlite3.Database("./blog.db")

db.run(`
  CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author TEXT,
    createdDate TEXT
  )
`)

app.get("/posts", (req, res) => {

  db.all(
    "SELECT * FROM posts ORDER BY id DESC",
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

app.post("/posts", (req, res) => {

  const {
    title,
    content,
    author,
    createdDate
  } = req.body

  db.run(
    `
    INSERT INTO posts
    (title, content, author, createdDate)
    VALUES (?, ?, ?, ?)
    `,
    [
      title,
      content,
      author,
      createdDate
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          title,
          content,
          author,
          createdDate
        })

      }

    }

  )

})

app.put("/posts/:id", (req, res) => {

  const {
    title,
    content,
    author,
    createdDate
  } = req.body

  db.run(
    `
    UPDATE posts
    SET
    title=?,
    content=?,
    author=?,
    createdDate=?
    WHERE id=?
    `,
    [
      title,
      content,
      author,
      createdDate,
      req.params.id
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:Number(req.params.id),
          title,
          content,
          author,
          createdDate
        })

      }

    }

  )

})

app.delete("/posts/:id", (req, res) => {

  db.run(
    "DELETE FROM posts WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Post deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})