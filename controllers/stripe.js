const prisma = require("../config/prisma");
const stripe = require("stripe")('sk_test_51QVBOUGHcjnYualqAUXBFhBy4hXiSVNIcdZMu8UcfBwFd2FpJtxSQUfNn39Hlo8haZZUiGmxjMlz1MIC4ZpvfGvJ00pya2FVbx');

exports.payment = async (req, res) => {
    try {
        console.log(req.user.id);
        const cart = await prisma.cart.findFirst({
            where:{
                orderbyId: req.user.id
            }
        })
        const amountTHB = cart.cartTotal* 100

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountTHB,
            currency: "thb",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
          });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
}
