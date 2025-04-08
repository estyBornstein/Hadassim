import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import '../sass/products.scss'; 

function Products() {
    let location = useLocation();
    let nav = useNavigate();
    const products = location.state?.products || [];
    const supplierId = location.state?.supplierId || null;
    let currentUser = useSelector(st => st.user.currentUser);

    // פונקציה לחזרה לדף הקודם
    const handleGoBack = () => {
        nav(-1); // יחזור לדף הקודם
    };

    return (
        <div className="products-container">
            <button className="close-button" onClick={handleGoBack}>X</button> {/* הכפתור כאן */}
            <div className="products-header">
                <h1>Product List</h1>
            </div>

            {products.length > 0 ? (
                <ul className="products-list">
                    {products.map(prod => (
                        <li key={prod._id} className="product-item">
                            <button 
                                className="product-button"
                                onClick={() => nav(`/product/${prod._id}`, { state: prod })}
                            >
                                {prod.name} - {prod.price}$
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <h2>No products available</h2>
            )}

            {currentUser?.role === 'ADMIN' && (
                <input 
                    type="button" 
                    value="Create Order" 
                    className="create-order-button"
                    onClick={() => nav('/order-form', { state: { products: products, supplierId: supplierId } })}
                />
            )}
        </div>
    );
}

export default Products;
