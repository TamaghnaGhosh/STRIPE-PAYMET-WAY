require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// app.use(cors());

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// app.get("/", (req, res) => {
//   res.send({
//     mess: "hi",
//   });
// });

app.post("/create-checkout-session", async (req, res) => {
  try {
    const product = await stripe.products.create({ name: "item" });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: req.body.item * 100,
      currency: "inr",
    });

    console.log(product);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/#/?sucees=true`, 
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    console.log(session);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000);
