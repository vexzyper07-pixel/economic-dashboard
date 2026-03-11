import { Link } from "react-router-dom";

function AdminSidebar(){

  return(

    <div style={{
      width:"220px",
      height:"100vh",
      background:"#1e293b",
      color:"white",
      padding:"20px"
    }}>

      <h2>Admin Panel</h2>

      <hr />

      <ul style={{listStyle:"none", padding:"0"}}>

        <li style={{margin:"15px 0"}}>
          <Link to="/admin/dashboard" style={{color:"white"}}>Dashboard</Link>
        </li>

        <li style={{margin:"15px 0"}}>
          <Link to="/admin/add-product" style={{color:"white"}}>Add Product</Link>
        </li>

        <li style={{margin:"15px 0"}}>
          <Link to="/admin/manage-products" style={{color:"white"}}>Manage Products</Link>
        </li>

      </ul>

    </div>

  )

}

export default AdminSidebar;