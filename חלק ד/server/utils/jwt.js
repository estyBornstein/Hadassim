 import jwt from "jsonwebtoken";

export const generateToken = (vendor) => {
    let token = jwt.sign(
        {
            vendorId: vendor._id,
            phone: vendor.phone,
            role: vendor.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: '5h' }  
    );
    return token;
};
