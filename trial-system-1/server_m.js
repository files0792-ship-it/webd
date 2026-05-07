// ============================
// server.js
// ============================

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./students.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to SQLite Database");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rollNumber TEXT,
    email TEXT,
    course TEXT
  )
`);

app.post("/students", (req, res) => {
  const { name, rollNumber, email, course } = req.body;

  const sql =
    "INSERT INTO students (name, rollNumber, email, course) VALUES (?, ?, ?, ?)";

  db.run(sql, [name, rollNumber, email, course], function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        message: "Student Added Successfully",
        id: this.lastID,
      });
    }
  });
});

app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(rows);
    }
  });
});

app.delete("/students/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE id=?";

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        message: "Student Deleted Successfully",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// ============================
// app.jsx
// ============================

import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    course: "",
  });

  const fetchStudents = async () => {
    const response = await fetch("http://localhost:5000/students");
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      rollNumber: "",
      email: "",
      course: "",
    });

    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
    });

    fetchStudents();
  };

  return (
    <div className="container">

      <h1>Student Record Management</h1>

      <form className="student-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="rollNumber"
          placeholder="Enter Roll Number"
          value={formData.rollNumber}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Enter Course"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Student
        </button>

      </form>

      <div className="student-list">

        {students.map((student) => (
          <div className="student-card" key={student.id}>

            <h2>{student.name}</h2>

            <p>
              <strong>Roll Number:</strong> {student.rollNumber}
            </p>

            <p>
              <strong>Email:</strong> {student.email}
            </p>

            <p>
              <strong>Course:</strong> {student.course}
            </p>

            <button onClick={() => deleteStudent(student.id)}>
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default App;



// ============================
// app.css design 1
// ============================

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial, sans-serif;
}

body{
  background:#f1f5f9;
}

.container{
  width:90%;
  max-width:1200px;
  margin:auto;
  padding:40px 0;
}

h1{
  text-align:center;
  color:#0f172a;
  margin-bottom:30px;
}

.student-form{
  background:white;
  padding:30px;
  border-radius:20px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
  box-shadow:0 10px 25px rgba(0,0,0,0.1);
}

.student-form input{
  padding:15px;
  border:1px solid #cbd5e1;
  border-radius:10px;
  font-size:16px;
}

.student-form button{
  background:#2563eb;
  color:white;
  border:none;
  border-radius:10px;
  cursor:pointer;
  transition:0.3s;
}

.student-form button:hover{
  background:#1d4ed8;
}

.student-list{
  margin-top:40px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:25px;
}

.student-card{
  background:white;
  padding:25px;
  border-radius:18px;
  box-shadow:0 8px 20px rgba(0,0,0,0.1);
}

.student-card h2{
  margin-bottom:10px;
}

.student-card p{
  margin:10px 0;
}

.student-card button{
  margin-top:15px;
  width:100%;
  padding:12px;
  border:none;
  background:crimson;
  color:white;
  border-radius:10px;
  cursor:pointer;
}




// ============================
// app.css design 2
// ============================

body{
  margin:0;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  font-family:sans-serif;
}

.container{
  width:90%;
  margin:auto;
  padding:40px 0;
}

h1{
  text-align:center;
  color:white;
  margin-bottom:35px;
}

.student-form{
  display:flex;
  flex-wrap:wrap;
  gap:20px;
  background:rgba(255,255,255,0.1);
  padding:30px;
  border-radius:20px;
  backdrop-filter:blur(12px);
}

.student-form input{
  flex:1 1 220px;
  padding:15px;
  border:none;
  border-radius:12px;
}

.student-form button{
  padding:15px 25px;
  border:none;
  border-radius:12px;
  background:#38bdf8;
  color:white;
  cursor:pointer;
}

.student-list{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:20px;
  margin-top:40px;
}

.student-card{
  background:rgba(255,255,255,0.1);
  color:white;
  padding:25px;
  border-radius:20px;
  backdrop-filter:blur(10px);
}

.student-card button{
  margin-top:15px;
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  background:#ef4444;
  color:white;
}




// ============================
// app.css design 3
// ============================

body{
  margin:0;
  background:#111827;
  color:white;
  font-family:Verdana,sans-serif;
}

.container{
  width:92%;
  margin:auto;
  padding:40px 0;
}

h1{
  text-align:center;
  margin-bottom:35px;
}

.student-form{
  display:grid;
  gap:20px;
  background:#1f2937;
  padding:30px;
  border-radius:18px;
}

.student-form input{
  padding:15px;
  border-radius:10px;
  border:1px solid #374151;
  background:#111827;
  color:white;
}

.student-form button{
  padding:15px;
  background:#10b981;
  border:none;
  border-radius:10px;
  color:white;
  cursor:pointer;
}

.student-list{
  margin-top:35px;
  display:flex;
  flex-wrap:wrap;
  gap:20px;
}

.student-card{
  flex:1 1 300px;
  background:#1f2937;
  padding:25px;
  border-radius:16px;
}

.student-card button{
  margin-top:15px;
  padding:12px;
  width:100%;
  background:#dc2626;
  border:none;
  border-radius:10px;
  color:white;
}




// ============================
// app.css design 4
// ============================

body{
  margin:0;
  background:#eef2ff;
  font-family:Poppins,sans-serif;
}

.container{
  width:90%;
  margin:auto;
  padding:50px 0;
}

h1{
  text-align:center;
  color:#4338ca;
  margin-bottom:35px;
}

.student-form{
  background:white;
  padding:35px;
  border-radius:20px;
  display:flex;
  flex-wrap:wrap;
  gap:18px;
  box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

.student-form input{
  flex:1 1 220px;
  padding:15px;
  border-radius:12px;
  border:2px solid #c7d2fe;
}

.student-form button{
  padding:15px 30px;
  background:#4f46e5;
  border:none;
  color:white;
  border-radius:12px;
  cursor:pointer;
}

.student-list{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:25px;
  margin-top:40px;
}

.student-card{
  background:white;
  padding:25px;
  border-radius:20px;
  box-shadow:0 10px 20px rgba(0,0,0,0.08);
}

.student-card h2{
  color:#312e81;
}

.student-card button{
  margin-top:15px;
  width:100%;
  padding:12px;
  background:#e11d48;
  border:none;
  color:white;
  border-radius:10px;
}




// ============================
// app.css design 5
// ============================

body{
  margin:0;
  background:linear-gradient(to right,#141e30,#243b55);
  font-family:Tahoma,sans-serif;
}

.container{
  width:90%;
  margin:auto;
  padding:40px 0;
}

h1{
  text-align:center;
  color:white;
  margin-bottom:40px;
}

.student-form{
  background:white;
  padding:30px;
  border-radius:25px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
}

.student-form input{
  padding:15px;
  border-radius:14px;
  border:1px solid #d1d5db;
}

.student-form button{
  background:#0f172a;
  color:white;
  border:none;
  border-radius:14px;
  cursor:pointer;
  font-size:16px;
}

.student-list{
  margin-top:40px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:25px;
}

.student-card{
  background:white;
  padding:25px;
  border-radius:20px;
  transition:0.3s;
}

.student-card:hover{
  transform:translateY(-5px);
}

.student-card button{
  width:100%;
  margin-top:15px;
  padding:12px;
  background:#dc2626;
  color:white;
  border:none;
  border-radius:12px;
}