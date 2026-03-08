 import { Link } from "react-router-dom";

function Home(){

return(

<div className="container text-center mt-5">

<h1>Welcome to Economic Dashboard</h1>

<p className="lead">
Best place to buy electronics products.
</p>

<Link to="/products" className="btn btn-primary">
View Products
</Link>

<hr className="my-5"/>

<h3>About Our Store</h3>

<p>
We provide high quality electronics with affordable prices.
Explore laptops, mobiles and accessories.
</p>

</div>

)

}

export default Home