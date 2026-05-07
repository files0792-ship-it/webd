import { useState } from "react"
import axios from "axios"

function App() {

  const [isLogin, setIsLogin] = useState(true)

  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if(isLogin){

        const response = await axios.post(
          "http://localhost:5000/login",
          {
            email: formData.email,
            password: formData.password
          }
        )

        setMessage(response.data.message)

        localStorage.setItem(
          "token",
          response.data.token
        )

        setIsAuthenticated(true)

      }else{

        const response = await axios.post(
          "http://localhost:5000/register",
          formData
        )

        setMessage(response.data.message)

        setIsLogin(true)

      }

      setFormData({
        username: "",
        email: "",
        password: ""
      })

    } catch (error) {

      setMessage(
        error.response.data.message
      )

    }

  }

  const logout = () => {

    localStorage.removeItem("token")

    setIsAuthenticated(false)

  }

  if(isAuthenticated){

    return (

      <div className="dashboard">

        <h1>
          Welcome to Dashboard
        </h1>

        <p>
          User authenticated successfully
        </p>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    )

  }

  return (

    <div className="container">

      <div className="form-box">

        <h1>

          {
            isLogin
              ? "Login"
              : "Register"
          }

        </h1>

        <form onSubmit={handleSubmit}>

          {

            !isLogin && (

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />

            )

          }

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">

            {
              isLogin
                ? "Login"
                : "Register"
            }

          </button>

        </form>

        <p className="message">
          {message}
        </p>

        <p
          className="toggle"
          onClick={() =>
            setIsLogin(!isLogin)
          }
        >

          {
            isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"
          }

        </p>

      </div>

    </div>

  )

}

export default App