import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [posts, setPosts] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    createdDate: ""
  })

  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/posts"
      )

      setPosts(response.data)

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
          `http://localhost:5000/posts/${editId}`,
          formData
        )

        setPosts(
          posts.map((post) =>
            post.id === editId
              ? response.data
              : post
          )
        )

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }else{

      try {

        const response = await axios.post(
          "http://localhost:5000/posts",
          formData
        )

        setPosts([
          response.data,
          ...posts
        ])

        resetForm()

      } catch (error) {
        console.log(error)
      }

    }

  }

  const editPost = (post) => {

    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      createdDate: post.createdDate
    })

    setEditId(post.id)

  }

  const deletePost = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/posts/${id}`
      )

      setPosts(
        posts.filter(
          (post) => post.id !== id
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const resetForm = () => {

    setFormData({
      title: "",
      content: "",
      author: "",
      createdDate: ""
    })

    setEditId(null)

  }

  return (

    <div className="container">

      <h1>Blog Application</h1>

      <form
        className="blog-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="title"
          placeholder="Blog Title"
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
          type="date"
          name="createdDate"
          value={formData.createdDate}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Write blog content..."
          value={formData.content}
          onChange={handleChange}
          required
        />

        <button type="submit">

          {
            editId
              ? "Update Post"
              : "Create Post"
          }

        </button>

      </form>

      <div className="posts-list">

        {
          posts.map((post) => (

            <div
              className="post-card"
              key={post.id}
            >

              <h2>{post.title}</h2>

              <p className="meta">

                By {post.author}
                {" • "}
                {post.createdDate}

              </p>

              <p className="content">
                {post.content}
              </p>

              <div className="buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    editPost(post)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deletePost(post.id)
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