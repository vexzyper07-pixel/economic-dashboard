 import { Routes, Route, useLocation } from "react-router-dom"
import { useState } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Payment from "./pages/Payment"
import Signin from "./pages/Signin"

/* Admin Pages */
import AdminLogin from "./admin/pages/AdminLogin"
import AdminDashboard from "./admin/pages/AdminDashboard"
import AddProduct from "./admin/pages/AddProduct"
import ManageProducts from "./admin/pages/ManageProducts"

function App(){

const [cart,setCart]=useState([])

const location = useLocation()

/* check if admin route */
const isAdminRoute = location.pathname.startsWith("/admin")

const addToCart=(product)=>{

const exist=cart.find(p=>p.id===product.id)

if(exist){

setCart(
cart.map(p=>
p.id===product.id
?{...p,qty:p.qty+1}
:p
)
)

}else{

setCart([...cart,{...product,qty:1}])

}

}

return(

<div>

{/* Hide navbar in admin panel */}
{!isAdminRoute && <Navbar cartCount={cart.length}/>}

<Routes>

{/* Public Routes */}

<Route path="/" element={<Home/>}/>

<Route
path="/products"
element={<Products addToCart={addToCart}/>}
/>

<Route
path="/product/:id"
element={<ProductDetails addToCart={addToCart}/>}
/>

<Route
path="/cart"
element={<Cart cart={cart} setCart={setCart}/>}
/>

<Route path="/payment" element={<Payment/>}/>

<Route path="/signin" element={<Signin/>}/>


{/* Admin Routes */}

<Route path="/admin/login" element={<AdminLogin/>}/>

<Route path="/admin/dashboard" element={<AdminDashboard/>}/>

<Route path="/admin/add-product" element={<AddProduct/>}/>

<Route path="/admin/manage-products" element={<ManageProducts/>}/>

</Routes>

{/* Hide footer in admin panel */}
{!isAdminRoute && <Footer/>}

</div>

)

}

export default App