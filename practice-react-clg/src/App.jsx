import{useState,useEffect} from "react";
import axios from "axios";
import "./New.css"

function App(){

  const[name,setName] = useState("");
  const port = 9; 
  const [users,setUsers] = useState([]);

  async function fetchUsers(){
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  }

  async function addUser(){
    if(name == "") return;

    await axios.post("http://localhost:5000/users",
      {
      name : name
      }
  );

  fetchUsers();
  setName("");

  }

  useEffect(() =>{
    fetchUsers();
  }
    ,
    []);
  
    return(
      <div>
        <h1>User Management System</h1>
        <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
        
        <button onClick={addUser}>Add User</button>

        <h2>Users List</h2>
        {
          users.map((ite) =>(
            <p key = {ite.id}>
              {ite.name}
            </p>
           ) )
        }
      </div>
    );
  }
export default App;