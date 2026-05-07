import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })

  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/notes"
      )

      setNotes(response.data)

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
          `http://localhost:5000/notes/${editId}`,
          formData
        )

        setNotes(
          notes.map((note) =>
            note.id === editId
              ? response.data
              : note
          )
        )

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }else{

      try {

        const response = await axios.post(
          "http://localhost:5000/notes",
          formData
        )

        setNotes([
          response.data,
          ...notes
        ])

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }

  }

  const editNote = (note) => {

    setFormData({
      title: note.title,
      content: note.content
    })

    setEditId(note.id)

  }

  const deleteNote = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/notes/${id}`
      )

      setNotes(
        notes.filter(
          (note) => note.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const resetForm = () => {

    setFormData({
      title: "",
      content: ""
    })

    setEditId(null)

  }

  return (

    <div className="container">

      <h1>Notes Management System</h1>

      <form
        className="note-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Write your note..."
          value={formData.content}
          onChange={handleChange}
          required
        />

        <button type="submit">

          {
            editId
              ? "Update Note"
              : "Add Note"
          }

        </button>

      </form>

      <div className="notes-list">

        {
          notes.map((note) => (

            <div
              className="note-card"
              key={note.id}
            >

              <h3>{note.title}</h3>

              <p>{note.content}</p>

              <div className="buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editNote(note)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNote(note.id)
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