import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [feedbacks, setFeedbacks] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    comments: ""
  })

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/feedbacks"
      )

      setFeedbacks(response.data)

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

  const submitFeedback = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:5000/feedbacks",
        formData
      )

      setFeedbacks([
        response.data,
        ...feedbacks
      ])

      setFormData({
        name: "",
        rating: "",
        comments: ""
      })

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="container">

      <h1>Feedback Collection System</h1>

      <form
        className="feedback-form"
        onSubmit={submitFeedback}
      >

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Rating
          </option>

          <option value="1">
            1 Star
          </option>

          <option value="2">
            2 Stars
          </option>

          <option value="3">
            3 Stars
          </option>

          <option value="4">
            4 Stars
          </option>

          <option value="5">
            5 Stars
          </option>

        </select>

        <textarea
          name="comments"
          placeholder="Enter Comments"
          value={formData.comments}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Submit Feedback
        </button>

      </form>

      <div className="feedback-list">

        {
          feedbacks.map((feedback) => (

            <div
              className="feedback-card"
              key={feedback.id}
            >

              <h3>{feedback.name}</h3>

              <p>
                <strong>Rating:</strong>
                {" "}
                ⭐ {feedback.rating}
              </p>

              <p>
                <strong>Comments:</strong>
              </p>

              <p>{feedback.comments}</p>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App