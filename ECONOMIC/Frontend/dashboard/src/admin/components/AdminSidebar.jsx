import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>
      <hr />
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/admin/add-product">Add Product</Link>
        </li>

        <li>
          <Link to="/admin/manage-products">Manage Products</Link>
        </li>

        <li>
          <Link to="/admin/logout">Logout</Link>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
