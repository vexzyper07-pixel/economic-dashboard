import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const navigate=useNavigate()

const handleLogin=(e)=>{

e.preventDefault()

// later we will connect backend
if(email==="admin@gmail.com" && password==="1234"){

navigate("/admin/dashboard")

}else{

alert("Invalid Admin Credentials")

}

}

return(

<div style={{width:"300px",margin:"100px auto"}}>

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

)

}

export default AdminLogin