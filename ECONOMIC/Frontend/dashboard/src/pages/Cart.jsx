 import { Link } from "react-router-dom";

function Cart({cart,setCart}){

const increaseQty=(index)=>{

const updated=[...cart]
updated[index].qty+=1
setCart(updated)

}

const decreaseQty=(index)=>{

const updated=[...cart]

if(updated[index].qty>1)
updated[index].qty-=1

setCart(updated)

}

const removeItem=(index)=>{

const updated=cart.filter((_,i)=>i!==index)
setCart(updated)

}

const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0)

return(

<div className="container mt-5">

<h2>Your Cart</h2>

<table className="table">

<thead>

<tr>

<th>Product</th>
<th>Price</th>
<th>Qty</th>
<th>Total</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{cart.map((item,index)=>(

<tr key={index}>

<td>{item.name}</td>

<td>{item.price}</td>

<td>

<button
className="btn btn-sm btn-secondary me-2"
onClick={()=>decreaseQty(index)}
>-</button>

{item.qty}

<button
className="btn btn-sm btn-secondary ms-2"
onClick={()=>increaseQty(index)}
>+</button>

</td>

<td>{item.price*item.qty}</td>

<td>

<button
className="btn btn-danger btn-sm"
onClick={()=>removeItem(index)}
>
Remove
</button>

</td>

</tr>

))}

</tbody>

</table>

<h4>Total Amount: ₹{total}</h4>

<Link to="/payment" className="btn btn-success">
Proceed To Payment
</Link>

</div>

)

}

export default Cart