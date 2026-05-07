const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./todo.db")

db.run(`
  CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskName TEXT,
    status INTEGER,
    createdDate TEXT
  )
`)

app.get("/tasks", (req, res) => {

  db.all(
    "SELECT * FROM tasks ORDER BY id DESC",
    [],
    (err, rows) => {

      if(err){
        res.status(500).json(err)
      }else{

        const formattedRows = rows.map((task) => ({
          ...task,
          status: Boolean(task.status)
        }))

        res.json(formattedRows)

      }

    }
  )

})

app.post("/tasks", (req, res) => {

  const { taskName } = req.body

  const status = 0

  const createdDate = new Date().toISOString()

  db.run(
    `
    INSERT INTO tasks
    (taskName, status, createdDate)
    VALUES (?, ?, ?)
    `,
    [taskName, status, createdDate],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id: this.lastID,
          taskName,
          status: false,
          createdDate
        })

      }

    }

  )

})

app.put("/tasks/:id", (req, res) => {

  const { status } = req.body

  db.run(
    `
    UPDATE tasks
    SET status=?
    WHERE id=?
    `,
    [status ? 1 : 0, req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        db.get(
          "SELECT * FROM tasks WHERE id=?",
          [req.params.id],

          (err, row) => {

            if(err){
              res.status(500).json(err)
            }else{

              row.status = Boolean(row.status)

              res.json(row)

            }

          }

        )

      }

    }

  )

})

app.delete("/tasks/:id", (req, res) => {

  db.run(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{
        res.json({
          message:"Task deleted"
        })
      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})