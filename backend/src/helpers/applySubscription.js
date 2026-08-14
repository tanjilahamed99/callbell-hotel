const User = require("../models/User");
const Website = require("../models/WebsiteInfo");

// helpers/applySubscription.js
async function applySubscription({
  userId,
  subId,
  orderId,
  paymentId,
  amount,
}) {
  const findUser = await User.findById(userId);
  if (!findUser) return { success: false, message: "User not found" };

  const alreadyProcessed = (findUser.transactionHistory || []).some(
    (t) => t.razorpay?.razorpay_payment_id === paymentId,
  );
  if (alreadyProcessed) return { success: true, message: "Already applied" };

  const planData = await Website.findOne();
  const mainPlan = planData?.plan?.find((p) => String(p.id) === String(subId));
  if (!mainPlan) return { success: false, message: "Plan not found" };

  const now = new Date();
  let startDate = now;
  let endDate = new Date();
  const hasActiveSub =
    findUser.subscription && findUser.subscription.endDate > now;

  if (hasActiveSub) {
    startDate = findUser.subscription.startDate;
    endDate = new Date(findUser.subscription.endDate);
    endDate.setDate(endDate.getDate() + mainPlan.duration);
  } else {
    endDate.setDate(now.getDate() + mainPlan.duration);
  }

  const subscription = {
    plan: mainPlan.name,
    status: "active",
    startDate,
    endDate,
    minute:
      (parseFloat(findUser.subscription?.minute) || 0) +
      (parseInt(mainPlan.minute) || 0),
  };

  const historyEntry = {
    razorpay: {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: "",
    },
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

  await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        transactionHistory: [
          ...(findUser.transactionHistory || []),
          historyEntry,
        ],
        subscription,
      },
    },
  );

  return {
    success: true,
    message: "Payment verified and subscription updated",
  };
}

module.exports = applySubscription;
