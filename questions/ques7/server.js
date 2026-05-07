const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./contacts.db")

db.run(`
  CREATE TABLE IF NOT EXISTS contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT
  )
`)

app.get("/contacts", (req, res) => {

  db.all(
    "SELECT * FROM contacts ORDER BY id DESC",
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

app.post("/contacts", (req, res) => {

  const {
    name,
    phone,
    email,
    address
  } = req.body

  db.run(
    `
    INSERT INTO contacts
    (name, phone, email, address)
    VALUES (?, ?, ?, ?)
    `,
    [name, phone, email, address],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          name,
          phone,
          email,
          address
        })

      }

    }

  )

})

app.put("/contacts/:id", (req, res) => {

  const {
    name,
    phone,
    email,
    address
  } = req.body

  db.run(
    `
    UPDATE contacts
    SET
    name=?,
    phone=?,
    email=?,
    address=?
    WHERE id=?
    `,
    [
      name,
      phone,
      email,
      address,
      req.params.id
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:Number(req.params.id),
          name,
          phone,
          email,
          address
        })

      }

    }

  )

})

app.delete("/contacts/:id", (req, res) => {

  db.run(
    "DELETE FROM contacts WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Contact deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})