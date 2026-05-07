import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [students, setStudents] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    course: ""
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/students"
      )

      setStudents(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const addStudent = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/students",
        formData
      )

      setStudents([...students, response.data])

      setFormData({
        name: "",
        rollNumber: "",
        email: "",
        course: ""
      })

    } catch (error) {
      console.log(error)
    }
  }

  const deleteStudent = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/students/${id}`
      )

      setStudents(
        students.filter((student) => student.id !== id)
      )

    } catch (error) {
      console.log(error)
    }
  }

  return (

    <div className="container">

      <h1>Student Record Management</h1>

      <form onSubmit={addStudent} className="form">

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
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

        {
          students.map((student) => (

            <div className="student-card" key={student.id}>

              <h3>{student.name}</h3>

              <p>
                <strong>Roll Number:</strong> {student.rollNumber}
              </p>

              <p>
                <strong>Email:</strong> {student.email}
              </p>

              <p>
                <strong>Course:</strong> {student.course}
              </p>

              <button
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </button>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App