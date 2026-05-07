import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [attendance, setAttendance] = useState([])

  const [formData, setFormData] = useState({
    studentName: "",
    date: "",
    status: "Present"
  })

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/attendance"
      )

      setAttendance(response.data)

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

  const markAttendance = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/attendance",
        formData
      )

      setAttendance([
        response.data,
        ...attendance
      ])

      setFormData({
        studentName: "",
        date: "",
        status: "Present"
      })

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="container">

      <h1>Student Attendance Management</h1>

      <form
        className="attendance-form"
        onSubmit={markAttendance}
      >

        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >

          <option value="Present">
            Present
          </option>

          <option value="Absent">
            Absent
          </option>

        </select>

        <button type="submit">
          Mark Attendance
        </button>

      </form>

      <div className="history-list">

        {
          attendance.map((record) => (

            <div
              className="attendance-card"
              key={record.id}
            >

              <h3>
                {record.studentName}
              </h3>

              <p>
                <strong>Date:</strong>
                {" "}
                {record.date}
              </p>

              <p>
                <strong>Status:</strong>
                {" "}
                <span
                  className={
                    record.status === "Present"
                      ? "present"
                      : "absent"
                  }
                >
                  {record.status}
                </span>
              </p>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App