const prisma = require("../config/prisma")

exports.changeOderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body
        // console.log(orderId, orderStatus);
        const orderupdate = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: orderStatus }
        })

        res.json(orderupdate)
    } catch (err) {
        res.status(500).json({ message: " Server Error " })
    }
}


exports.getOderAdmin = async (req, res) => {
    try {

        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                orderby: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }
                }
            }
        })


        res.json(orders)
    } catch (err) {
        res.status(500).json({ message: " Server Error " })
    }
}