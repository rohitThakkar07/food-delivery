import React, { useState, useEffect } from 'react';
import './order.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (e,orderId)=>{
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:e.target.value
    })
    if(response.data.success){
      await fetchAllOrders();
      console.log("ok")
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order">
      <h2>All Orders</h2>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel" className="order-icon" />
            <div className="order-details">
              <p className="order-item-food">
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <span>{order.address.street}, </span>
                <span>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </span>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>

            <p className="order-count">Items: {order.items.length}</p>
            <p className="order-amount">${order.amount}</p>

            <select className="order-status" onChange={(e)=>statusHandler(e,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
