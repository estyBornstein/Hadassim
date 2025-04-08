import Jwt from "jsonwebtoken";


export const isExist = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ title: "First, log in", message: "unauthorized" });
    try {
        let result = Jwt.verify(token, process.env.SECRET_KEY);
        req.vendor = result;
        next();
    }
    catch (err) {
        return res.status(401).json({ title: "Error", message: err.message });
    }
}


// export const isGrocer = (req, res, next) => {
//     let token = req.headers.authorization;
//     if (!token)
//         return res.status(401).json({ title: "First, log in", message: "unauthorized" });
//     try {
//         let result = jwt.verify(token, process.env.SECRET_KEY);
//         if (result.role!="VENDOR")
//         return res.status(401).json({ title: "permission", message: "The vendor does not have access to this data." });
//         req.vendor = result;
//         next();
//     }
//     catch (err) {
//         return res.status(401).json({ title: "Error", message: err.message });
//     }
// }