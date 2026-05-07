const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET_KEY = "secretkey"

const db = new sqlite3.Database("./users.db")

db.run(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`)

app.post("/register", async (req, res) => {

  const {
    username,
    email,
    password
  } = req.body

  try {

    const hashedPassword =
      await bcrypt.hash(password, 10)

    db.run(
      `
      INSERT INTO users
      (username, email, password)
      VALUES (?, ?, ?)
      `,
      [
        username,
        email,
        hashedPassword
      ],

      function(err){

        if(err){

          res.status(400).json({
            message:"Email already exists"
          })

        }else{

          res.json({
            message:"Registration successful"
          })

        }

      }

    )

  } catch (error) {

    res.status(500).json({
      message:"Server error"
    })

  }

})

app.post("/login", (req, res) => {

  const {
    email,
    password
  } = req.body

  db.get(
    `
    SELECT *
    FROM users
    WHERE email=?
    `,
    [email],

    async (err, user) => {

      if(err){

        return res.status(500).json({
          message:"Server error"
        })

      }

      if(!user){

        return res.status(400).json({
          message:"User not found"
        })

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        )

      if(!isMatch){

        return res.status(400).json({
          message:"Invalid password"
        })

      }

      const token = jwt.sign(
        {
          id:user.id,
          email:user.email
        },
        SECRET_KEY,
        {
          expiresIn:"1h"
        }
      )

      res.json({
        message:"Login successful",
        token
      })

    }

  )

})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})