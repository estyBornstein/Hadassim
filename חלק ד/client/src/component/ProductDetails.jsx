import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProductDeatailsById } from "../api/Product.js";

import '../sass/productDetails.scss';

function ProductDetails() {
    const nav = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // שליפת ה-id מה-URL
    console.log(id);

    const [product, setProduct] = useState(location.state || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // אם לא קיבלנו state אבל יש id - נשלוף מהשרת
    useEffect(() => {
        let isRelevant = true;
        if (!product && id) {
            setLoading(true);
            getProductDeatailsById(id)
                .then(res => {
                    if (isRelevant)
                        setProduct(res.data);
                })
                .catch(err => {
                    if(isRelevant){
                    alert('error')
                    console.error(err);
                    setError("Failed to load product");}
                })
                .finally(() => {
                    if(isRelevant)
                    setLoading(false);
                });

            return () => {
                isRelevant = false;
            };
        }
    }, []);

    const handleGoBack = () => {
        nav(-1);
    };

    return (
        <div className="product-details-container">
            {loading ? (
                <p>Loading product...</p> // מציג הודעת טעינה בזמן טעינת המוצר
            ) : error ? (
                <p>{error}</p> // מציג הודעת שגיאה אם יש בעיה
            ) : !product ? (
                <h2>Product not found</h2> // מציג אם לא נמצא מוצר
            ) : (
                <>
                    <button className="close-button" onClick={handleGoBack}>X</button>
                    <h1 className="product-details-header">{product.name}</h1>
                    <div className="product-details-info">
                        <h2>Price</h2>
                        <p>{product.price} $</p>

                        <h2>Description</h2>
                        <p>{product.description}</p>

                        <h2>Minimum Quantity</h2>
                        <p>{product.minimumQuantity}</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductDetails;
