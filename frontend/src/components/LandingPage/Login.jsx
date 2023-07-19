import { Link, withRouter } from "react-router-dom";
import { useState } from "react";
import { ApiLogin, router_noauth } from '../../constants';
import styled from "styled-components";
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { TextField } from "@mui/material";


function LoginPage({ history }) {
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [error, setError] = useState(null);

  function handleFormSubmit(event) {
    event.preventDefault();
    router_auth.post(ApiLogin, {
      "userEmail": userEmail,
      "userPassword": userPassword
    }).then(response => {
      localStorage.clear()
      localStorage.setItem('userId', response.data.userId);
      history.push('/messages');
    }).catch(error => {
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
      }}>Login</legend>

      <TextField
          label="EMAIL"
          InputProps={{
            startAdornment: (
              <EmailIcon color="action" fontSize="20px" style={{marginRight: '10px', color: 'black'}}/>
            ),
          }}
          style={{
            color: "black",
            marginTop: "30px"
          }}
          onChange={e => setUserEmail(e.target.value)}
          required
      />

      <TextField
          label="PASSWORD"
          InputProps={{
            startAdornment: (
              <KeyIcon color="action" fontSize="20px" style={{marginRight: '10px', color: 'black'}}/>
            ),
          }}
          style={{
            color: "black",
            marginTop: "30px"
          }}
          type="password"
          onChange={e => setUserPassword(e.target.value)}
          required
      />

      {error != null && <div style={{ color: 'red', fontSize: "20px", marginTop: "30px"}}>{error}</div>}
      <button type="submit" style={{
        width: "60%",
        height: "10%",
        backgroundColor: "#2B7A78",
        color: "#fff",
        border: "none",
        position: "absolute",
        bottom: "15%",
        left: "20%"
      }}>Login</button>
      <div style={{
        position: "absolute",
        fontSize: "17px",
        bottom: "10px",
        left: "20px"
      }}>
        Don't have an account yet?{" "}
        <Link className="underline text-black" to="/register">
          Register now
        </Link>
      </div>
    </form>
  );
}

export default withRouter(LoginPage);
