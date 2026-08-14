const Razorpays = require("razorpay");
const router = require("express").Router();
const crypto = require("crypto");
const Website = require("../../models/WebsiteInfo");
const User = require("../../models/User");
const Razorpay = require("../../models/Razorpay");
const applySubscription = require("../../helpers/applySubscription");

router.post("/create-intent", async (req, res) => {
  try {
    const credentials = await Razorpay.findOne();
    if (!credentials) {
      return res.send({ message: "Credentials not found", success: false });
    }

    const razorpay = new Razorpays({
      key_id: credentials.key,
      key_secret: credentials.secret,
    });

    const { userId, subId, amount, ...rest } = req.body;

    const options = {
      ...rest,
      amount,
      notes: {
        userId: String(userId),
        subId: String(subId),
        amount: String(amount / 100), // store in rupees for later comparison
      },
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Error");

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

router.post("/validate-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subId,
      userId,
      amount,
    } = req.body;

    if (!razorpay_payment_id || !userId || !subId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const credentials = await Razorpay.findOne();
    if (!credentials) {
      return res.status(400).json({
        success: false,
        message: "Credentials not found",
      });
    }

    const razorpay = new Razorpays({
      key_id: credentials.key,
      key_secret: credentials.secret,
    });

    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      console.log("Razorpay fetch error:", err);
      return res.status(400).json({
        success: false,
        message: "Could not verify payment with Razorpay",
      });
    }

    // Only proceed if Razorpay confirms it's actually captured
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${payment.status}`,
      });
    }

    // Extra safety: make sure amount matches what you expected (paise vs rupees)
    const expectedAmountPaise = Math.round(Number(amount) * 100);
    if (payment.amount !== expectedAmountPaise) {
      console.log(
        `Amount mismatch: expected ${expectedAmountPaise}, got ${payment.amount}`,
      );
      return res.status(400).json({
        success: false,
        message: "Amount mismatch",
      });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Idempotency check — don't double-grant if this payment_id was already processed
    const alreadyProcessed = (findUser.transactionHistory || []).some(
      (t) => t.razorpay?.razorpay_payment_id === razorpay_payment_id,
    );
    if (alreadyProcessed) {
      return res.json({
        success: true,
        message: "Payment already verified and applied",
      });
    }

    const planData = await Website.findOne();
    if (!planData || !Array.isArray(planData.plan)) {
      return res.status(500).json({
        success: false,
        message: "Plan data not configured",
      });
    }

    const mainPlan = planData.plan.find((p) => String(p.id) === String(subId));
    if (!mainPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Plan duration / dates
    const now = new Date();
    let startDate = now;
    let endDate = new Date();
    const rationDays = mainPlan.duration;

    const hasActiveSub =
      findUser.subscription && findUser.subscription.endDate > now;

    if (hasActiveSub) {
      startDate = findUser.subscription.startDate;
      endDate = new Date(findUser.subscription.endDate);
      endDate.setDate(endDate.getDate() + rationDays);
    } else {
      startDate = now;
      endDate.setDate(now.getDate() + rationDays);
    }

    const existingMinutes = parseFloat(findUser.subscription?.minute) || 0;
    const planMinutes = parseInt(mainPlan.minute) || 0;

    const subscription = {
      plan: mainPlan.name,
      status: "active",
      startDate,
      endDate,
      minute: existingMinutes + planMinutes,
    };

    const razorpayInfo = {
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      razorpay_signature: razorpay_signature || "",
    };

    const historyEntry = {
      razorpay: razorpayInfo,
      amount,
      paymentMethod: "Razorpay",
      status: "Completed",
      author: {
        name: findUser.name,
        email: findUser.email,
        id: findUser.id,
        address: findUser.address || "",
      },
      planId: subId,
      plan: mainPlan.name,
      planDuration: mainPlan.duration,
      planMinute: mainPlan.minute,
    };

    const updateHistory = [
      ...(findUser.transactionHistory || []),
      historyEntry,
    ];

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          transactionHistory: updateHistory,
          subscription,
        },
      },
      { new: true },
    );

    return res.json({
      success: true,
      message: "Payment verified and subscription updated",
      orderId: payment.order_id,
      paymentId: payment.id,
    });
  } catch (err) {
    console.log("validate-payment error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while validating payment",
    });
  }
});

router.get("/key", async (req, res) => {
  const credentials = await Razorpay.findOne();

  if (!credentials) {
    return res.send({
      message: "Credentials not found",
      success: false,
    });
  }

  res.send({
    success: true,
    key: credentials.key,
  });
});

router.post("/validate-order", async (req, res) => {
  try {
    const { orderId, userId, subId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const credentials = await Razorpay.findOne();
    if (!credentials) {
      return res
        .status(400)
        .json({ success: false, message: "Credentials not found" });
    }

    const razorpay = new Razorpays({
      key_id: credentials.key,
      key_secret: credentials.secret,
    });

    // Fetch the order itself (has notes: userId, subId, amount)
    let order;
    try {
      order = await razorpay.orders.fetch(orderId);
    } catch (err) {
      console.log("Order fetch error:", err);
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    // Fetch all payment attempts linked to this order
    const paymentsList = await razorpay.orders.fetchPayments(orderId);
    const capturedPayment = paymentsList.items.find(
      (p) => p.status === "captured",
    );

    if (!capturedPayment) {
      const latestAttempt = paymentsList.items[paymentsList.items.length - 1];
      return res.json({
        success: false,
        status: latestAttempt ? latestAttempt.status : "no_attempt",
        message: latestAttempt
          ? `Payment status: ${latestAttempt.status}`
          : "No payment attempt found for this order",
      });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Idempotency — already processed this payment before
    const alreadyProcessed = (findUser.transactionHistory || []).some(
      (t) => t.razorpay?.razorpay_payment_id === capturedPayment.id,
    );
    if (alreadyProcessed) {
      return res.json({
        success: true,
        message: "Payment already verified and applied",
      });
    }

    const planData = await Website.findOne();

    if (!planData || !Array.isArray(planData.plan)) {
      return res
        .status(500)
        .json({ success: false, message: "Plan data not configured" });
    }

    const mainPlan = planData.plan.find((p) => String(p.id) === String(subId));
    if (!mainPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const now = new Date();
    let startDate = now;
    let endDate = new Date();
    const rationDays = mainPlan.duration;

    const hasActiveSub =
      findUser.subscription && findUser.subscription.endDate > now;

    if (hasActiveSub) {
      startDate = findUser.subscription.startDate;
      endDate = new Date(findUser.subscription.endDate);
      endDate.setDate(endDate.getDate() + rationDays);
    } else {
      startDate = now;
      endDate.setDate(now.getDate() + rationDays);
    }

    const existingMinutes = parseFloat(findUser.subscription?.minute) || 0;
    const planMinutes = parseInt(mainPlan.minute) || 0;

    const subscription = {
      plan: mainPlan.name,
      status: "active",
      startDate,
      endDate,
      minute: existingMinutes + planMinutes,
    };

    const historyEntry = {
      razorpay: {
        razorpay_order_id: orderId,
        razorpay_payment_id: capturedPayment.id,
        razorpay_signature: "",
      },
      amount: mainPlan.price,
      paymentMethod: "Razorpay",
      status: "Completed",
      author: {
        name: findUser.name,
        email: findUser.email,
        id: findUser.id,
        address: findUser.address || "",
      },
      planId: subId,
      plan: mainPlan.name,
      planDuration: mainPlan.duration,
      planMinute: mainPlan.minute,
    };

    const updateHistory = [
      ...(findUser.transactionHistory || []),
      historyEntry,
    ];

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { transactionHistory: updateHistory, subscription } },
      { new: true },
    );

    return res.json({
      success: true,
      message: "Payment verified and subscription updated",
      orderId,
      paymentId: capturedPayment.id,
    });
  } catch (err) {
    console.log("validate-order error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while validating payment",
    });
  }
});

// IMPORTANT: this route needs the RAW body for signature verification,
// so it must NOT go through your global express.json() middleware.
// In app.js, register this route (or use express.raw on this path) BEFORE app.use(express.json()).
// router.post(
//   "/webhook",
//   require("express").raw({ type: "application/json" }),
//   async (req, res) => {
//     try {
//       const credentials = await Razorpay.findOne();
//       if (!credentials) {
//         return res.status(400).send("Webhook secret not configured");
//       }

//       const signature = req.headers["x-razorpay-signature"];
//       const expectedSignature = crypto
//         .createHmac("sha256", 'pXRduj5tIoPQDQfIJWNRxrEJ')
//         .update(req.body) // raw Buffer, not parsed JSON
//         .digest("hex");

//       if (signature !== expectedSignature) {
//         return res.status(400).send("Invalid webhook signature");
//       }

//       const payload = JSON.parse(req.body);

//       if (payload.event === "payment.captured") {
//         const payment = payload.payload.payment.entity;
//         const { userId, subId, amount } = payment.notes || {};

//         if (userId && subId) {
//           await applySubscription({
//             userId,
//             subId,
//             orderId: payment.order_id,
//             paymentId: payment.id,
//             amount: amount || payment.amount / 100,
//           });
//         }
//       }

//       res.json({ status: "ok" });
//     } catch (err) {
//       console.log("Webhook error:", err);
//       res.status(500).send("Webhook error");
//     }
//   },
// );

module.exports = router;
