import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [contacts, setContacts] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })

  const [editId, setEditId] = useState(null)

  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/contacts"
      )

      setContacts(response.data)

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
          `http://localhost:5000/contacts/${editId}`,
          formData
        )

        setContacts(
          contacts.map((contact) =>
            contact.id === editId
              ? response.data
              : contact
          )
        )

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }else{

      try {

        const response = await axios.post(
          "http://localhost:5000/contacts",
          formData
        )

        setContacts([
          response.data,
          ...contacts
        ])

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }

  }

  const editContact = (contact) => {

    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address
    })

    setEditId(contact.id)

  }

  const deleteContact = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/contacts/${id}`
      )

      setContacts(
        contacts.filter(
          (contact) => contact.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const resetForm = () => {

    setFormData({
      name: "",
      phone: "",
      email: "",
      address: ""
    })

    setEditId(null)

  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      contact.phone
        .includes(search)
  )

  return (

    <div className="container">

      <h1>Contact Management System</h1>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
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

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <button type="submit">

          {
            editId
              ? "Update Contact"
              : "Add Contact"
          }

        </button>

      </form>

      <input
        type="text"
        className="search-box"
        placeholder="Search by name or phone"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="contact-list">

        {
          filteredContacts.map((contact) => (

            <div
              className="contact-card"
              key={contact.id}
            >

              <h3>{contact.name}</h3>

              <p>
                <strong>Phone:</strong>
                {" "}
                {contact.phone}
              </p>

              <p>
                <strong>Email:</strong>
                {" "}
                {contact.email}
              </p>

              <p>
                <strong>Address:</strong>
                {" "}
                {contact.address}
              </p>

              <div className="buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editContact(contact)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteContact(contact.id)
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