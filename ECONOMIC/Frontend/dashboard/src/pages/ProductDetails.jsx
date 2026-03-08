import { useParams } from "react-router-dom";
import products from "../data/Products";

function ProductDetails({addToCart}){

const {id}=useParams()

const product=products.find(p=>p.id==id)

return(

<div className="container mt-5">

<div className="row">

<div className="col-md-6">

<img src={product.image} className="img-fluid"/>

</div>

<div className="col-md-6">

<h2>{product.name}</h2>

<p>{product.description}</p>

<h4>₹{product.price}</h4>

<button
className="btn btn-success"
onClick={()=>addToCart(product)}
>
Add To Cart
</button>

</div>

</div>

</div>

)

}

export default ProductDetails