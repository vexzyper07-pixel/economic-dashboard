 import products from "../data/Products";
import { Link } from "react-router-dom";

function Products({addToCart}){

return(

<div className="container mt-5">

<h2 className="mb-4">Products</h2>

<div className="row">

{products.map((product)=>(

<div className="col-md-4" key={product.id}>

<div className="card mb-4">

<img src={product.image} className="card-img-top"/>

<div className="card-body text-center">

<h5>{product.name}</h5>

<p>₹{product.price}</p>

<Link
to={`/product/${product.id}`}
className="btn btn-secondary me-2"
>
View Details
</Link>

<button
className="btn btn-primary"
onClick={()=>addToCart(product)}
>
Add To Cart
</button>

</div>

</div>

</div>

))}

</div>

</div>

)

}

export default Products