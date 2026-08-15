const router = require("express").Router();
const Gest = require("../../models/Gest");

router.post("/update", async (req, res) => {
  try {
    const { name, room } = req.body;

    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      req.ip;

    const ip = rawIp === "::1" ? "127.0.0.1 (localhost)" : rawIp;

    // Check if guest already exists by phone or IP
    let gest = await Gest.findOne({ $or: [{ room }, { ip }] });

    if (gest) {
      // Update existing guest with latest info
      gest = await Gest.findByIdAndUpdate(
        gest._id,
        { $set: { ip, name, room } },
        { new: true },
      );
    } else {
      gest = await Gest.create({ ip, name, room });
    }

    res.status(201).json({ success: true, ...gest._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
