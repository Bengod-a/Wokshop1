const { json } = require("express");
const prisma = require("../config/prisma");



// exports.listUsers = async (req, res) => {
//     try {

//         const user = await prisma.user.findMany({
//             select: {
//                 id: true,
//                 email: true,
//                 role: true,
//                 enabled: true,
//                 address: true
//             }
//         })

//         res.send(user)


//         // res.send('Hello Users')
//     } catch (err) {
//         // console.log(err);
//         res.status(500).json({ message: 'Server Error' })
//     }
// }


exports.listUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, enabled: true, address: true },
      });
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

exports.changeStatus = async (req, res) => {
    try {

        const { id, enabled } = req.body
        // console.log(id, enabled);

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { enabled: enabled }
        })


        res.send('update status succes')
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}


exports.changeRole = async (req, res) => {
    try {

        const { id, role } = req.body
        // console.log(id, role);

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: role }
        })


        res.send('update Role succes')


        // res.send('Hello changeRole')
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}


exports.userCart = async (req, res) => {
    try {

        const { cart } = req.body
        // console.log(cart);
        // console.log(req.user.id);


        const user = await prisma.user.findFirst({
            where: { id: Number(req.user.id) }
        })
        // console.log(user);
        // delete

 // Check quantity
        for(const item of cart){
            // console.log(item);
            const product = await prisma.product.findFirst({
                where:{ id: item.id },
                select:{ quantity:true, title:true }
            })
            // console.log(item);
            // console.log(product);
            if(!product || item.count > product.quantity){
                return res.status(400).json({
                    ok: false,
                    message: `ขออภัย  ${product?.title || 'product'} หมดแล้ว`
                })
            }
         }

        await prisma.productOncart.deleteMany({
            where: {
                cart: {
                    orderbyId: user.id
                }
            }
        })
        // delete old cart
        await prisma.cart.deleteMany({
            where: {
                orderbyId: user.id
            }
        })


        // เตรียมสินค้า 
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        // หาผลรวม
        let cartTotal = products.reduce((sum, item) =>
            sum + item.price * item.count, 0)



        //  New cart
        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderbyId: user.id
            }
        })
        // console.log(newCart);
        // res.send('Add Cart Ok')


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getUserCart = async (req, res) => {
    try {

        const cart = await prisma.cart.findFirst({
            where: {
                orderbyId: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        // console.log(cart);
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}


exports.emptyCart = async (req, res) => {
    try {

        // code
        const cart = await prisma.cart.findFirst({
            where: { orderbyId: Number(req.user.id) }
        })

        if (!cart) {
            res.status(400).json({ message: 'No Cart' })
        }

        await prisma.productOncart.deleteMany({
            where: { cartId: cart.id }
        })

        const result = await prisma.cart.deleteMany({
            where: { orderbyId: Number(req.user.id) }
        })


        // console.log(result);
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        })

    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}



exports.saveAddress = async (req, res) => {
    try {

        const { address } = req.body
        console.log(address);
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })

        res.json({ ok: true, message: "Address update sucess" })
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}


// exports.saveOrder = async (req, res) => {
//     try {

//         const { id, amount, status, currency } = req.body.paymentIntent
        
 

//         // step1
//         const userCart = await prisma.cart.findFirst({
//             where: {
//                 orderbyId: Number(req.user.id)

//             },
//             include:{ products: true }
//         })
        
//         // Check Cart empty
//         if(!userCart || userCart.products.length === 0){
//             return res.status(400).json({ ok:false, message: "Cart is Empty" })
//         }
        
        
//         // Check quantity
//         // for(const item of userCart.products){
//         //     // console.log(item);
//         //     const product = await prisma.product.findFirst({
//         //         where:{ id: item.productId },
//         //         select:{ quantity:true, title:true }
//         //     })
//         //     // console.log(item);
//         //     // console.log(product);
//         //     if(!product || item.count > product.quantity){
//         //         return res.status(400).json({
//         //             ok: false,
//         //             message: `ขออภัย. สินค้า ${product?.title || 'product'} หมดแล้ว`
//         //         })
//         //     }
//         // }

//         // Create a new nem Oreder
//         const order = await prisma.order.create({
//             data:{
//                 products:{
//                    create: userCart.products.map((item)=>({
//                     productId: item.productId,
//                     count: item.count,
//                     price: item.price,
//                    })) 
//                 },
//                 orderby:{
//                     connect: { id: req.user.id }
//                 },
//                 cartTotal: userCart.cartTotal,
//                 stripePaymentId: id,
//                 amount: Number(amount),
//                 status: status,
//                 currency: currency
//             },
//         })



//         //  Update product
//         const update = userCart.products.map((item)=>({
//             where:{ id: item.productId },
//             data:{ 
//                 quantity: { decrement: item.count },
//                 sold: { increment: item.count }
//              }
//         }))
//         console.log(update);
       
//         await Promise.all(
//             update.map((updated)=> prisma.product.update())
//         )

//         await prisma.cart.deleteMany({
//             where:{ orderbyId: Number(req.user.id) }
//         })
        
//         res.json({ ok:true, order })
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Server Error' })
//     }
// }


exports.saveOrder = async (req, res) => {
    try {
        const { id, amount, status, currency } = req.body.paymentIntent;

        // Step 1: Fetch user cart
        const userCart = await prisma.cart.findFirst({
            where: { orderbyId: Number(req.user.id) },
            include: { products: true },
        });

        // Check if cart is empty
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ ok: false, message: "Cart is Empty" });
        }
        const amountTHB = Number(amount) / 100
        // Create a new order
        const order = await prisma.order.create({
            data: {
                products: {
                    create: userCart.products.map((item) => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price,
                    })),
                },
                orderby: {
                    connect: { id: req.user.id },
                },
                cartTotal: userCart.cartTotal,
                stripePaymentId: id,
                amount: amountTHB,
                status: status,
                currency: currency,
            },
        });

        // Update product quantities and sold counts
        const updates = userCart.products.map((item) => ({
            where: { id: item.productId },
            data: {
                quantity: { decrement: item.count },
                sold: { increment: item.count },
            },
        }));

        await Promise.all(
            updates.map((update) =>
                prisma.product.update({
                    where: update.where,
                    data: update.data,
                })
            )
        );

        // Clear the user's cart
        await prisma.cart.deleteMany({
            where: { orderbyId: Number(req.user.id) },
        });

        res.json({ ok: true, order });
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.getOrder = async (req, res) => {
    try {

        const order = await prisma.order.findMany({
            where:{ orderbyId: Number(req.user.id) },
            include:{ 
                products:{
                    include:{
                        product: true
                    }
                }
             }
        })
        if(order.length === 0){
            return res.status(400).json({ ok: false, message: "No Order"})
        }

        res.json({ ok: true, order})
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}