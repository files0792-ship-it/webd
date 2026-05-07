//1st step :- import packages
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

//2nd step:- create app
const app = express();
sfasda
/*
3rd step:- apply middleware
cors()-> attaches frontend to backend
express.json()->lets you read json from requests
*/
app.use(cors());
app.use(express.json());

//4th step:- connect db
const db = new sqlite3.Database("database.db",(err) =>{
    if(err) console.log(err)
    else console.log("Database Connected")
});


//5th Step:- Create Table
db.run(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
    )`
)

//6th Step:- Routes(this is the logical part )
app.get("/users", (req,res) =>{
    db.all("SELECT * FROM users",[],(err,rows) =>{
        if(err) return res.send(err)
        else return res.json(rows)
    });
});//get method

app.post("/users", (req,res) =>{
    const {name} = req.body;
    db.run("INSERT INTO users (name) VALUES (?)",[name],function(err){
        if(err) return res.send(err)
        res.send("User Added")
    });
});//post method

app.put("/users/:id", (req,res) =>{
    const {name} = req.body;
    const {id} = req.params;

    db.run(
        "UPDATE users SET name = ? WHERE id = ?",[name,id],
        (err) =>{
            if(err) return res.send(err)
                else res.send("User Updated")
        }

    );
});//put method

app.delete("/users/:id",(req,res) =>{
    const {id} = req.params;

    db.run(
        "DELETE FROM users WHERE id = ?",[id],(err) =>{
            if(err) res.send(err)
                else res.send(`User with id:- ${id} is deleted`)
        }
    );
});//delete method
        

//Server Calling
app.listen(5000, ()=>{
    console.log("Server connected to port 5000")
});

