import { useNavigate } from "react-router-dom";

import '../sass/supplier.scss';

function Supplier({ supplier }) {
    let nav = useNavigate();

    // בדיקה אם יש מידע על הספק
    if (!supplier) {
        return <p>No supplier data available</p>;
    }

    return (
        <div className="supplier-container">
            <div className="supplier-header">
                <h1>{supplier.companyName}</h1>
                <h2>{supplier.name}</h2>
                <h2>{supplier.phone}</h2>
                <h2>{supplier.representativeName}</h2>
            </div>
            
            <div className="supplier-info">
                <input 
                    type="button" 
                    value="List of Products" 
                    onClick={() => nav('/Product', { state: { products: supplier.goods, supplierId: supplier._id } })}
                />
            </div>
        </div>
    );
}

export default Supplier;
