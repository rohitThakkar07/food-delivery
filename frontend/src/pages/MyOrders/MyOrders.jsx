import React, { useContext, useEffect, useState } from 'react';
import './myOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            setOrders(response.data.data || []);
        } catch (err) {
            console.error(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>

            {loading ? (
                <p className="loading">Loading your orders...</p>
            ) : orders.length === 0 ? (
                <p className="empty">No orders found.</p>
            ) : (
                <div className="orders-container">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-left">
                                <img src={assets.parcel_icon} alt="Parcel" className="parcel-icon" />
                                <div className="order-info">
                                    <p className="order-items">
                                        {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
                                    </p>
                                    <p className="order-amount">${order.amount}.00</p>
                                    <p className="order-items-count">Items: {order.items.length}</p>
                                    <p className="order-status">{order.status}</p>
                                </div>
                            </div>
                            <button onClick={fetchOrders} className="track-btn">Track Order</button>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default MyOrders;
