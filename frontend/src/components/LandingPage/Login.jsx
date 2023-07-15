import { Link, withRouter } from "react-router-dom";
import { useState } from "react";
import {ApiLogin, router_noauth} from '../../constants';


function LoginPage({ history }) {
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [error, setError] = useState(null);

  function handleFormSubmit(event) {
    event.preventDefault();
    router_noauth.post(ApiLogin, {
      "userEmail": userEmail, 
      "userPassword": userPassword 
    }, {withCredentials: true}).then(response => {
      history.push('/messages');
    }).catch(error => {
      if (error) {
        setError(error.response.data.error.message);
      } else if (error.request) {
        setError('No response received from the server.');
      } else {
        setError('An error occurred during the request.');
      }
    })
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
          <input type="email" placeholder="your@email.com" onChange={e => setUserEmail(e.target.value)}/>
          <input type="password" placeholder="password" onChange={e => setUserPassword(e.target.value)}/>
          <button className="primary">Login</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to="/register">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
