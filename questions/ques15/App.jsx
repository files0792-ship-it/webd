import { useEffect, useState } from "react"
import {
  initializeApp
} from "firebase/app"

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth"

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

function App() {

  const [user, setUser] = useState(null)

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState([])

  useEffect(() => {

    onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
      }
    )

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        )

      }
    )

    return () => unsubscribe()

  }, [])

  const login = async () => {

    const provider =
      new GoogleAuthProvider()

    try {

      await signInWithPopup(
        auth,
        provider
      )

    } catch (error) {
      console.log(error)
    }

  }

  const logout = async () => {

    try {

      await signOut(auth)

    } catch (error) {
      console.log(error)
    }

  }

  const sendMessage = async (e) => {

    e.preventDefault()

    if(message.trim() === ""){
      return
    }

    try {

      await addDoc(
        collection(db, "messages"),
        {
          text: message,
          name: user.displayName,
          uid: user.uid,
          createdAt: serverTimestamp()
        }
      )

      setMessage("")

    } catch (error) {
      console.log(error)
    }

  }

  if(!user){

    return (

      <div className="login-container">

        <div className="login-box">

          <h1>
            Real-Time Chat App
          </h1>

          <button onClick={login}>
            Login with Google
          </button>

        </div>

      </div>

    )

  }

  return (

    <div className="chat-container">

      <div className="chat-header">

        <h2>
          Welcome,
          {" "}
          {user.displayName}
        </h2>

        <button onClick={logout}>
          Logout
        </button>

      </div>

      <div className="chat-box">

        {
          messages.map((msg) => (

            <div
              key={msg.id}
              className={
                msg.uid === user.uid
                  ? "my-message"
                  : "other-message"
              }
            >

              <strong>
                {msg.name}
              </strong>

              <p>
                {msg.text}
              </p>

            </div>

          ))
        }

      </div>

      <form
        className="message-form"
        onSubmit={sendMessage}
      >

        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button type="submit">
          Send
        </button>

      </form>

    </div>

  )

}

export default App