import { useEffect, useState } from "react";

import { getAllSuppliers } from "../api/Suppliers";

import Supplier from "../component/Supplier";

function Suppliers() {
    let [status, setStatus] = useState();
    let [arrSuppliers, setArrSuppliers] = useState([]);

    useEffect(() => {
        let isRelevant = true;
        setStatus("pending");

        getAllSuppliers()
            .then(res => {
                if (isRelevant) {
                    // לוודא ש-res.data הוא מערך
                    setArrSuppliers(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(err => {
                if (isRelevant) {
                    console.log(err);
                }
            })
            .finally(() => {
                if (isRelevant) {
                    setStatus("finish");
                }
            });

        return () => {
            isRelevant = false;
        };
    }, []);

    return (
        <>
            <>
                {status === "pending" ? (
                    <p>Loading suppliers...</p>
                ) : status === "finish" && Array.isArray(arrSuppliers) && arrSuppliers.length > 0 ? (
                    arrSuppliers.map(supplier => (
                        <div key={supplier._id}>
                            <Supplier supplier={supplier} />
                        </div>
                    ))
                ) : (
                    <p>No suppliers found</p>
                )}
            </>
           


        </>
    );
}

export default Suppliers;
