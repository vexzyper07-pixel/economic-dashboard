 import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";

function ManageProducts(){
//its temp details once there backend api is ready we will fetch this data from backend and also add pagination and search functionality
const [products,setProducts] = useState([
 {id:1,name:"Laptop",price:500},
 {id:2,name:"Phone",price:300}
])

const [editId,setEditId] = useState(null)

const [editData,setEditData] = useState({
 name:"",
 price:""
})


const handleDelete = (id) => {

 setProducts(products.filter(p => p.id !== id))

}


const handleEdit = (product) => {

 setEditId(product.id)

 setEditData({
  name:product.name,
  price:product.price
 })

}


const handleUpdate = (id) => {

 setProducts(

  products.map(p =>

   p.id === id
   ? {...p,name:editData.name,price:editData.price}
   : p

  )

 )

 setEditId(null)

}


return(

<AdminLayout>

<h2>Manage Products</h2>

<table border="1" cellPadding="10">

<thead>

<tr>

<th>ID</th>
<th>Name</th>
<th>Price</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{products.map(product => (

<tr key={product.id}>

<td>{product.id}</td>

<td>

{editId === product.id ? (

<input
value={editData.name}
onChange={(e)=>setEditData({...editData,name:e.target.value})}
/>

) : (

product.name

)}

</td>

<td>

{editId === product.id ? (

<input
type="number"
value={editData.price}
onChange={(e)=>setEditData({...editData,price:e.target.value})}
/>

) : (

product.price

)}

</td>

<td>

{editId === product.id ? (

<button onClick={()=>handleUpdate(product.id)}>
Save
</button>

) : (

<button onClick={()=>handleEdit(product)}>
Edit
</button>

)}

<button onClick={()=>handleDelete(product.id)}>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</AdminLayout>

)

}

export default ManageProducts