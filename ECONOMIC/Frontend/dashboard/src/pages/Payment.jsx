function Payment(){

return(

<div className="container mt-5">

<h2>Payment</h2>

<form>

<div className="form-check">

<input className="form-check-input" type="radio" name="payment"/>

<label className="form-check-label">
UPI
</label>

</div>

<div className="form-check">

<input className="form-check-input" type="radio" name="payment"/>

<label className="form-check-label">
Credit Card
</label>

</div>

<div className="form-check">

<input className="form-check-input" type="radio" name="payment"/>

<label className="form-check-label">
Debit Card
</label>

</div>

<br/>

<button className="btn btn-primary">
Pay Now
</button>

</form>

</div>

)

}

export default Payment