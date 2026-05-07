import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const questions = [

    {
      question: "What is the capital of India?",
      options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
      answer: "Delhi"
    },

    {
      question: "Which language is used with React?",
      options: ["Python", "Java", "JavaScript", "C++"],
      answer: "JavaScript"
    },

    {
      question: "Who developed React?",
      options: ["Google", "Facebook", "Microsoft", "Amazon"],
      answer: "Facebook"
    },

    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Creative Style Sheets",
        "Colorful Style Sheets",
        "Computer Style Sheets"
      ],
      answer: "Cascading Style Sheets"
    }

  ]

  const [studentName, setStudentName] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/results"
      )

      setLeaderboard(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const handleAnswer = async (option) => {

    if(
      option ===
      questions[currentQuestion].answer
    ){
      setScore(score + 1)
    }

    const nextQuestion =
      currentQuestion + 1

    if(nextQuestion < questions.length){

      setCurrentQuestion(nextQuestion)

    }else{

      const finalScore =
        option ===
        questions[currentQuestion].answer
          ? score + 1
          : score

      setQuizFinished(true)

      try {

        await axios.post(
          "http://localhost:5000/results",
          {
            studentName,
            score: finalScore,
            date: new Date()
              .toLocaleDateString()
          }
        )

        fetchLeaderboard()

      } catch (error) {
        console.log(error)
      }

    }

  }

  return (

    <div className="container">

      <h1>Quiz Record System</h1>

      {

        !quizFinished ? (

          <div className="quiz-box">

            {

              currentQuestion === 0 && (

                <input
                  type="text"
                  placeholder="Enter Student Name"
                  value={studentName}
                  onChange={(e) =>
                    setStudentName(
                      e.target.value
                    )
                  }
                  required
                />

              )

            }

            <h2>
              {
                questions[currentQuestion]
                  .question
              }
            </h2>

            <div className="options">

              {
                questions[currentQuestion]
                  .options
                  .map((option, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        handleAnswer(option)
                      }
                    >
                      {option}
                    </button>

                  ))
              }

            </div>

          </div>

        ) : (

          <div className="result-box">

            <h2>
              Quiz Completed
            </h2>

            <p>
              Student:
              {" "}
              {studentName}
            </p>

            <p>
              Score:
              {" "}
              {score}
              {" / "}
              {questions.length}
            </p>

          </div>

        )

      }

      <div className="leaderboard">

        <h2>Leaderboard</h2>

        {
          leaderboard.map((result, index) => (

            <div
              className="leaderboard-card"
              key={result.id}
            >

              <p>
                <strong>
                  #{index + 1}
                </strong>
              </p>

              <p>
                {result.studentName}
              </p>

              <p>
                Score:
                {" "}
                {result.score}
              </p>

              <p>
                {result.date}
              </p>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App