import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [employees, setEmployees] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
    email: ""
  })

  const [editId, setEditId] = useState(null)

  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/employees"
      )

      setEmployees(response.data)

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

  const handleSubmit = async (e) => {

    e.preventDefault()

    if(editId){

      try {

        const response = await axios.put(
          `http://localhost:5000/employees/${editId}`,
          formData
        )

        setEmployees(
          employees.map((employee) =>
            employee.id === editId
              ? response.data
              : employee
          )
        )

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }else{

      try {

        const response = await axios.post(
          "http://localhost:5000/employees",
          formData
        )

        setEmployees([
          ...employees,
          response.data
        ])

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }

  }

  const editEmployee = (employee) => {

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
      email: employee.email
    })

    setEditId(employee.id)

  }

  const deleteEmployee = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/employees/${id}`
      )

      setEmployees(
        employees.filter(
          (employee) => employee.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const resetForm = () => {

    setFormData({
      name: "",
      department: "",
      salary: "",
      email: ""
    })

    setEditId(null)

  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.department
        .toLowerCase()
        .includes(search.toLowerCase())
  )

  return (

    <div className="container">

      <h1>Employee Management System</h1>

      <form
        className="employee-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {
            editId
              ? "Update Employee"
              : "Add Employee"
          }
        </button>

      </form>

      <input
        type="text"
        className="search"
        placeholder="Search by name or department"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="employee-list">

        {
          filteredEmployees.map((employee) => (

            <div
              className="employee-card"
              key={employee.id}
            >

              <h3>{employee.name}</h3>

              <p>
                <strong>Department:</strong>
                {" "}
                {employee.department}
              </p>

              <p>
                <strong>Salary:</strong>
                {" "}
                ₹{employee.salary}
              </p>

              <p>
                <strong>Email:</strong>
                {" "}
                {employee.email}
              </p>

              <div className="buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editEmployee(employee)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteEmployee(employee.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App