 import {Routes,Route} from "react-router-dom"
import {useState} from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Payment from "./pages/Payment"
import Signin from "./pages/Signin"

function App(){

const [cart,setCart]=useState([])

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

<Navbar cartCount={cart.length}/>

<Routes>

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

</Routes>

<Footer/>

</div>

)

}

export default App