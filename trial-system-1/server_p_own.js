const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");   

const app = express();

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.log(err);
  else console.log("Connected to SQLite database");

});

db.run  (`
    CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  amount REAL,
  category TEXT
)`
);

app.get("/expenses", (req, res) => {
  db.all("SELECT * FROM expenses", (err, rows) => {
    if (err) res.send(err);
    else res.json(rows);    
  });
});

app.post("/expenses", (req, res) => {
  const { title, amount, category } = req.body;
  db.run("INSERT INTO expenses (title, amount, category) VALUES (?, ?, ?)", [title, amount, category], (err) => {
    if (err) res.send(err);
    else res.send("User Added");
  });
});

app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM expenses WHERE id = ?", [id], (err) => {
    if (err) res.send(err);
    else res.send("User Deleted");
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
