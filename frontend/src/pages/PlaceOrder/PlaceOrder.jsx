import React, { useState, useEffect, useContext } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(data); // logs form data on each change
  }, [data]);

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) return alert("You must be logged in to place an order");

    if (getTotalCartAmount() === 0) return alert("Your cart is empty");

    // Prepare order items safely
    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // including delivery fee
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url); // redirect to Stripe checkout
      } else {
        alert("Error placing order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate("/cart")
    }else if(getTotalCartAmount() === 0){
      navigate("/cart");
    }
  },[!token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required type="text" name='firstName' value={data.firstName} onChange={onChangeHandler} placeholder='First name' />
          <input required type="text" name='lastName' value={data.lastName} onChange={onChangeHandler} placeholder='Last name' />
        </div>

        <input required type="email" name='email' value={data.email} onChange={onChangeHandler} placeholder='Email address' />
        <input required type="text" name='street' value={data.street} onChange={onChangeHandler} placeholder='Street' />

        <div className="multi-fields">
          <input required type="text" name='city' value={data.city} onChange={onChangeHandler} placeholder='City' />
          <input required type="text" name='state' value={data.state} onChange={onChangeHandler} placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required type="text" name='zipcode' value={data.zipcode} onChange={onChangeHandler} placeholder='Zip code' />
          <input required type="text" name='country' value={data.country} onChange={onChangeHandler} placeholder='Country' />
        </div>

        <input required type="text" name='phone' value={data.phone} onChange={onChangeHandler} placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>

          <div className="cart-total-details">
            <p>Total</p>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>

          <button type='submit' disabled={getTotalCartAmount() === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
