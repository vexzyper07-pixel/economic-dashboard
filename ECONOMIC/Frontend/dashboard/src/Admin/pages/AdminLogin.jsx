import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/admin/login",{

      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        password
      })

    });

    const data = await response.json();

    if(data.token){

      localStorage.setItem("adminToken",data.token);

      navigate("/admin/dashboard");

    }else{

      alert("Login Failed");

    }

  };

  return (

    <div style={{width:"300px", margin:"100px auto"}}>

      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">Login</button>

      </form>

    </div>

  );

}

export default AdminLogin;