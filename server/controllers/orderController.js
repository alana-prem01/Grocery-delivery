import Product from "../models/product.js"
import Order from "../models/order.js"
//Place Order COD: /api/order/cod\



export const placeOrderCOD = async (req, res) => {
    try {
         const userId = req.userId
        const { items, address } = req.body
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }
        //calculate Amount Using Items
        let amount = 0

        for (const item of items) {
            const product = await Product.findById(item.product)

            if (!product) {
                return res.json({ success: false, message: "Product not found" })
            }

            amount += product.offerPrice * item.quantity
        }

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })
        return res.json({ success: true, message: "Order Placed Successfully" })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId
        console.log("req.userId:", req.userId)
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
            .populate({
                path: "items.product"
            })
            .populate({
                path: "address"
            })
            .sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get All Orders For Seller /Admil : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
        .populate({
            path: "items.product",
            model: "product"
        })
        .populate({
            path: "address",
            model: "address"
        })
        .sort({ createdAt: -1 })

        console.log(JSON.stringify(orders, null, 2))

        res.json({ success: true, orders })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}
