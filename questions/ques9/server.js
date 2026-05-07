const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./inventory.db")

db.run(`
  CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    quantity TEXT,
    category TEXT
  )
`)

app.get("/products", (req, res) => {

  db.all(
    "SELECT * FROM products ORDER BY id DESC",
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

app.post("/products", (req, res) => {

  const {
    name,
    price,
    quantity,
    category
  } = req.body

  db.run(
    `
    INSERT INTO products
    (name, price, quantity, category)
    VALUES (?, ?, ?, ?)
    `,
    [name, price, quantity, category],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:this.lastID,
          name,
          price,
          quantity,
          category
        })

      }

    }

  )

})

app.put("/products/:id", (req, res) => {

  const {
    name,
    price,
    quantity,
    category
  } = req.body

  db.run(
    `
    UPDATE products
    SET
    name=?,
    price=?,
    quantity=?,
    category=?
    WHERE id=?
    `,
    [
      name,
      price,
      quantity,
      category,
      req.params.id
    ],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          id:Number(req.params.id),
          name,
          price,
          quantity,
          category
        })

      }

    }

  )

})

app.delete("/products/:id", (req, res) => {

  db.run(
    "DELETE FROM products WHERE id=?",
    [req.params.id],

    function(err){

      if(err){
        res.status(500).json(err)
      }else{

        res.json({
          message:"Product deleted"
        })

      }

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})