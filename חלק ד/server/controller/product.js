import { productModel } from "../models/product.js";
import { vendorModel } from "../models/vendor.js";



export async function getAllProductByVendorId(req, res) {
    let {id}=req.params
    try {
        let result = await vendorModel.findById(id)
        if(!result)
         res.json("not exist")
        else
        console.log(result.goods);
        if (result.goods?.length == 0)
            res.json("no product for this vendor")
        else
            res.json(result.goods)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring all the product for this vendor", message: err.message })
    }
};

export async function getProductById(req, res) {

    let { id } = req.params;
    console.log(id);
    try {
        let result = await productModel.findById(id)
        if (!result)
            return res.status(404).json({ title: "Problem with the id", message: "There is no product with such a code." })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring  the product by id", message: err.message })
    }
};

export async function getProductsByOrderId  (req, res)  {
    let { id } = req.params;
    id = id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ title: "Error", message: "The id is not valid" });
    }

    try {
        let order = await orderModel.findById(id).populate({
            path: 'orderedProductsList.product',
            model: 'product',
        });
        if (!order) {
            return res.status(404).json({ title: "Error", message: "Order not found" });
        }
        res.json(order.orderedProductsList);
    } catch (err) {
        res.status(400).json({ title: "Error, the products cannot be displayed by orderID", message: err.message });
    }
};


