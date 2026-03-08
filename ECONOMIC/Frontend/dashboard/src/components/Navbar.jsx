 import { Link } from "react-router-dom";

function Navbar({cartCount}){

return(

<nav className="navbar navbar-dark bg-dark navbar-expand-lg">

<div className="container">

<Link className="navbar-brand" to="/">
Economic Dashboard
</Link>

<ul className="navbar-nav ms-auto">

<li className="nav-item">
<Link className="nav-link" to="/">Home</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/products">Products</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/cart">
Cart ({cartCount})
</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/signin">Signin</Link>
</li>

</ul>

</div>

</nav>

)

}

export default Navbar