import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [appointments, setAppointments] = useState([])

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: ""
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/appointments"
      )

      setAppointments(response.data)

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

  const bookAppointment = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/appointments",
        formData
      )

      setAppointments([
        response.data,
        ...appointments
      ])

      setFormData({
        patientName: "",
        doctorName: "",
        date: "",
        time: ""
      })

    } catch (error) {
      console.log(error)
    }

  }

  const cancelAppointment = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/appointments/${id}`
      )

      setAppointments(
        appointments.filter(
          (appointment) =>
            appointment.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="container">

      <h1>
        Hospital Appointment Booking
      </h1>

      <form
        className="appointment-form"
        onSubmit={bookAppointment}
      >

        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="doctorName"
          placeholder="Doctor Name"
          value={formData.doctorName}
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

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Book Appointment
        </button>

      </form>

      <div className="appointments-list">

        {
          appointments.map((appointment) => (

            <div
              className="appointment-card"
              key={appointment.id}
            >

              <h3>
                {appointment.patientName}
              </h3>

              <p>
                <strong>Doctor:</strong>
                {" "}
                {appointment.doctorName}
              </p>

              <p>
                <strong>Date:</strong>
                {" "}
                {appointment.date}
              </p>

              <p>
                <strong>Time:</strong>
                {" "}
                {appointment.time}
              </p>

              <button
                onClick={() =>
                  cancelAppointment(
                    appointment.id
                  )
                }
              >
                Cancel Appointment
              </button>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App