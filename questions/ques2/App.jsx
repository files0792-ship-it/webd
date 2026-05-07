import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/tasks"
      )

      setTasks(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const addTask = async (e) => {

    e.preventDefault()

    if(taskName.trim() === ""){
      return
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/tasks",
        {
          taskName
        }
      )

      setTasks([...tasks, response.data])

      setTaskName("")

    } catch (error) {
      console.log(error)
    }

  }

  const toggleTask = async (id, status) => {

    try {

      const response = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {
          status: !status
        }
      )

      setTasks(
        tasks.map((task) =>
          task.id === id ? response.data : task
        )
      )

    } catch (error) {
      console.log(error)
    }

  }

  const deleteTask = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/tasks/${id}`
      )

      setTasks(
        tasks.filter((task) => task.id !== id)
      )

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="container">

      <h1>To-Do List App</h1>

      <form
        onSubmit={addTask}
        className="todo-form"
      >

        <input
          type="text"
          placeholder="Enter Task"
          value={taskName}
          onChange={(e) =>
            setTaskName(e.target.value)
          }
        />

        <button type="submit">
          Add Task
        </button>

      </form>

      <div className="task-list">

        {
          tasks.map((task) => (

            <div
              className="task-card"
              key={task.id}
            >

              <div>

                <h3
                  style={{
                    textDecoration:
                      task.status
                        ? "line-through"
                        : "none"
                  }}
                >
                  {task.taskName}
                </h3>

                <p>
                  Status:
                  {
                    task.status
                      ? " Completed"
                      : " Pending"
                  }
                </p>

                <p>
                  Created:
                  {
                    new Date(
                      task.createdDate
                    ).toLocaleString()
                  }
                </p>

              </div>

              <div className="buttons">

                <button
                  className="complete-btn"
                  onClick={() =>
                    toggleTask(
                      task.id,
                      task.status
                    )
                  }
                >
                  {
                    task.status
                      ? "Undo"
                      : "Complete"
                  }
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTask(task.id)
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