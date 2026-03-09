import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  console.log("Login button clicked");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 
    const handleLogin = async () => {
  console.log(email, password);
    try {


      const response = await fetch("http://localhost:5000/api/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email,
          password: password
        })

      });

      const data = await response.json();

      if (response.ok) {

        alert("Login successful");

        navigate("/dashboard");

      } else {

        alert(data.message || "Login failed");

      }

    } catch (error) {

      console.error(error);

      alert("Server error");

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card p-4">

            <h3 className="text-center">Signin</h3>

            <input
              className="form-control mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-success"
              onClick={handleLogin}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Signin;