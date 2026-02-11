const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ✅ CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log("Order error:", err.message);
    res.status(500).json({ success: false });
  }
});


// ✅ PAYMENT SUCCESS (THIS WAS MISSING ❗)
router.post("/payment-success", (req, res) => {
  console.log("Razorpay Success Data:", req.body);

  res.send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;padding-top:60px;">
        <h2>✅ Payment Successful</h2>
        <p>You can return to the app now.</p>
      </body>
    </html>
  `);
});


// ❌ PAYMENT FAILED
router.post("/payment-failed", (req, res) => {
  console.log("Razorpay Failed:", req.body);

  res.send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;padding-top:60px;">
        <h2>❌ Payment Failed</h2>
        <p>Please try again.</p>
      </body>
    </html>
  `);
});
router.get("/razorpay-checkout", (req, res) => {
  const { order_id, amount } = req.query;

  res.send(`
  <html>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
      var options = {
        key: "${process.env.RAZORPAY_KEY_ID}",
        amount: "${amount * 100}",
        currency: "INR",
        name: "ScanPay Store",
        order_id: "${order_id}",

        handler: function (response) {
          // Send payment details to backend
          fetch("/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          })
          .then(res => res.json())
          .then(data => {
            if(data.success){
              window.location.replace("scanpay://receipt");
            } else {
              window.location.replace("scanpay://payment-failed");
            }
          });
        },

        modal: {
          ondismiss: function(){
            console.log("User closed");
          }
        }
      };

      var rzp = new Razorpay(options);
      rzp.open();
    </script>
  </html>
  `);
});


router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true, message: "Payment verified" });

  } else {
    return res.json({ success: false });
  }
});



module.exports = router;
