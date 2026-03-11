 import { useState } from "react"
import AdminLayout from "../layout/AdminLayout"

function AddProduct(){

const [product,setProduct] = useState({
name:"",
price:"",
description:""
})

const handleChange = (e) => {

setProduct({
...product,
[e.target.name]: e.target.value
})

}

const handleSubmit = (e) => {

e.preventDefault()

console.log("Product Added:",product)

/* Later we will send this data to backend API */

}

return(

<AdminLayout>

<div style={{
maxWidth:"500px",
margin:"40px auto",
padding:"20px",
border:"1px solid #ccc",
borderRadius:"10px",
background:"#f9f9f9"
}}>

<h2 style={{textAlign:"center"}}>Product Details</h2>

<form onSubmit={handleSubmit}>

{/* Product Name */}

<div style={{marginBottom:"15px"}}>

<label>Product Name</label>

<input
type="text"
name="name"
value={product.name}
onChange={handleChange}
placeholder="Enter product name"
style={{width:"100%",padding:"8px"}}
/>

</div>


{/* Price */}

<div style={{marginBottom:"15px"}}>

<label>Price</label>

<input
type="number"
name="price"
value={product.price}
onChange={handleChange}
placeholder="Enter price"
style={{width:"100%",padding:"8px"}}
/>

</div>


{/* Description */}

<div style={{marginBottom:"15px"}}>

<label>Description</label>

<textarea
name="description"
value={product.description}
onChange={handleChange}
placeholder="Enter product description"
style={{width:"100%",padding:"8px"}}
/>

</div>


{/* Add Product Button */}

<button
type="submit"
style={{
width:"100%",
padding:"10px",
background:"#007bff",
color:"white",
border:"none",
borderRadius:"5px",
cursor:"pointer"
}}
>

Add Product

</button>

</form>

</div>

</AdminLayout>

)

}

export default AddProduct