import { Link, withRouter } from "react-router-dom";
import { useState } from "react";
import { router_noauth, ApiCreateUser } from "../../constants";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { TextField } from "@mui/material";

function RegisterPage({ history }) {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState(null);

  function handleFormSubmit(event) {
    event.preventDefault();
    router_noauth.post(ApiCreateUser,
      {
        "userName": name,
        "userEmail": email,
        "userPassword": password
      }).then(response => history.push("/login"))
      .catch(error => {
        setError(error.response.data.error);
      })
  }

  return (
    <form onSubmit={handleFormSubmit} style={{
      width: "20%",
      height: "50%",
      position: "absolute",
      top: "25%",
      left: "40%",
      background: "linear-gradient(135deg, #88eda5,  #dbf9e0)",
      textAlign: "center",
    }}>
      <legend style={{
        fontSize: "40px",
        alignContent: "center"
      }}>Sign up</legend>

      <TextField
        label="NAME"
        InputProps={{
          startAdornment: (
            <PersonIcon color="action" fontSize="20px" style={{ marginRight: '10px', color: 'black' }} />
          ),
        }}
        style={{
          color: "black",
          marginTop: "15px"
        }}
        onChange={e => setName(e.target.value)}
        required
      />

      <TextField
        label="EMAIL"
        InputProps={{
          startAdornment: (
            <EmailIcon color="action" fontSize="20px" style={{ marginRight: '10px', color: 'black' }} />
          ),
        }}
        style={{
          color: "black",
          marginTop: "15px"
        }}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <TextField
        label="PASSWORD"
        InputProps={{
          startAdornment: (
            <KeyIcon color="action" fontSize="20px" style={{ marginRight: '10px', color: 'black' }} />
          ),
        }}
        style={{
          color: "black",
          marginTop: "15px"
        }}
        type="password"
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error != null && <div style={{ color: 'red', fontSize: "20px", marginTop: "15px"}}>Invalid email</div>}
      <button type="submit" style={{
        width: "60%",
        height: "10%",
        backgroundColor: "#2B7A78",
        color: "#fff",
        border: "none",
        position: "absolute",
        bottom: "15%",
        left: "20%"
      }}>Register</button>
      <div style={{
        position: "absolute",
        fontSize: "17px",
        bottom: "10px",
        left: "20px"
      }}>
        Already a memeber?{" "}
        <Link className="underline text-black" to="/login">
          Login
        </Link>
      </div>
    </form>
  );
}

export default withRouter(RegisterPage);
