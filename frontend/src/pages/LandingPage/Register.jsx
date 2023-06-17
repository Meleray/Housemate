import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import { useState} from "react";

function RegisterPage({ history }) {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  function handleFormSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:5001/api/add-user', {"userName": name, "userEmail": email, "userPassword": password, "userPicture": 2045}) // Server host, register is the route of the server
    history.push("/login");
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
          <input 
              type="text"
              placeholder="Name" 
              onChange={(e) => setName(e.target.value)}
              />
          <input 
              type="email" 
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              />
          <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)}
              />
          <button className="primary">
            Register
            </button>
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-black" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRouter(RegisterPage);
