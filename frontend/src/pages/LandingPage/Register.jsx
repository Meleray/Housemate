import { Link, withRouter } from "react-router-dom";

function RegisterPage({ history }) {
  function handleFormSubmit(event) {
    event.preventDefault();
    history.push("/todo");
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Max Mustermann" />
          <input type="email" placeholder="your@email.com" />
          <input type="password" placeholder="password" />
          <button className="primary">Register</button>
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
