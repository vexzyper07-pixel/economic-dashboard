import { Link } from "react-router-dom";

function AdminNavbar() {

  return (
    <nav style={{background:"#222", color:"#fff", padding:"10px"}}>

      <h2>Admin Panel</h2>

      <div style={{display:"flex", gap:"20px"}}>

        <Link to="/admin/dashboard">Dashboard</Link>

        <Link to="/admin/add-product">Add Product</Link>

        <Link to="/admin/manage-products">Manage Products</Link>

      </div>

    </nav>
  );
}

export default AdminNavbar;