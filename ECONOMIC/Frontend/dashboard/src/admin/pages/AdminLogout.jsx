import { useNavigate } from "react-router-dom";

function AdminLogout() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.clear(); // remove stored login data

    navigate("/signin");

  };

  return (

    <div className="container mt-5">

      <h2>Admin Dashboard</h2>

      <button
        className="btn btn-danger mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>

  );

}

export default AdminLogout;