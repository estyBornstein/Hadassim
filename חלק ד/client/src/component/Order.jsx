import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { changeStatusForOrder } from "../api/Orders";

import '../sass/order.scss'; 

function Order({ order }) {
    let currentUser = useSelector(st => st.user.currentUser);
    let nav = useNavigate();

    useEffect(() => {
        if (currentUser == null) {
            nav('/login'); // הפנייה לדף הלוגין אם המשתמש לא מחובר
        }
    }, [currentUser, nav]);

    function changeStatus() {
        let status = currentUser.role === "ADMIN" ? "ACCEPTED" : "APPROVED";
        changeStatusForOrder(order._id, status,currentUser?.token).then(res =>{
            console.log(res)
            alert(res.data?.message)}
        ).catch(err => {
            console.log(err);
            alert(err.response?.data?.message)
        });
    }

    return (
        <div className="order-container">

            <h2>Status: {order.status}</h2>
            <button
                onClick={changeStatus}
                disabled={currentUser.role=='ADMIN'&&order.status === "ACCEPTED"||
                currentUser.role!='ADMIN'&&order.status !='PENDING'
            }
                className={currentUser.role=='ADMIN'&&order.status === "ACCEPTED"||
                currentUser.role!='ADMIN'&&order.status !='PENDING'? 'disabled-button' : 'active-button'}
            >
                Change Status
            </button>


            {/* תצוגת פרטי ההזמנה */}
            <div className="order-details">
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}</p>
                {currentUser?.role == "ADMIN" && <p><strong>Vendor ID:</strong> {order.VendorCode}</p>}
            </div>

            <ul>
                {order.OrderedGoods.map(prod => {
                    return (
                        <li key={prod._id}>
                            <strong>Name:</strong> {prod.name} <strong>Amount:</strong> {prod.amount}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Order;
