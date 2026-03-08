 function Signin() {

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
            />

            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
            />

            <button className="btn btn-success">
              Login
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Signin;