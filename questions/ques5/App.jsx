import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [books, setBooks] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: ""
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/books"
      )

      setBooks(response.data)

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

  const addBook = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/books",
        {
          ...formData,
          status: "Available"
        }
      )

      setBooks([
        response.data,
        ...books
      ])

      setFormData({
        title: "",
        author: "",
        isbn: ""
      })

    } catch (error) {
      console.log(error)
    }

  }

  const toggleStatus = async (id, currentStatus) => {

    const newStatus =
      currentStatus === "Available"
        ? "Issued"
        : "Available"

    try {

      const response = await axios.put(
        `http://localhost:5000/books/${id}`,
        {
          status: newStatus
        }
      )

      setBooks(
        books.map((book) =>
          book.id === id
            ? response.data
            : book
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const deleteBook = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/books/${id}`
      )

      setBooks(
        books.filter((book) => book.id !== id)
      )

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="container">

      <h1>Library Book Management</h1>

      <form
        className="book-form"
        onSubmit={addBook}
      >

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="isbn"
          placeholder="ISBN Number"
          value={formData.isbn}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Book
        </button>

      </form>

      <div className="book-list">

        {
          books.map((book) => (

            <div
              className="book-card"
              key={book.id}
            >

              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong>
                {" "}
                {book.author}
              </p>

              <p>
                <strong>ISBN:</strong>
                {" "}
                {book.isbn}
              </p>

              <p>
                <strong>Status:</strong>
                {" "}
                {book.status}
              </p>

              <div className="buttons">

                <button
                  className="status-btn"
                  onClick={() =>
                    toggleStatus(
                      book.id,
                      book.status
                    )
                  }
                >
                  {
                    book.status === "Available"
                      ? "Issue Book"
                      : "Return Book"
                  }
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteBook(book.id)
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