const User = require("../../../models/User");

exports.createDepartment = async (req, res) => {
  try {
    const { name, email, password, department } = req.body || {};

    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: `user of  ${name} already registered!`,
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      department,
    });
    const savedUser = await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = [
      "reception",
      "room-service",
      "restaurant",
      "manager",
      "duty-manager",
      "staff",
    ];

    const users = await User.find({
      department: { $in: departments },
    });

    res.status(200).json({
      success: true,
      message: "Departments users fetched successfully!",
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, department } = req.body || {};

    // Find existing user
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update ONLY fields sent by frontend
    if (name !== undefined) {
      existingUser.name = name;
    }

    if (email !== undefined) {
      // Check whether another user already uses this email
      const emailExists = await User.findOne({
        email,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "This email is already registered!",
        });
      }

      existingUser.email = email;
    }

    if (department !== undefined) {
      existingUser.department = department;
    }

    // Update password only if frontend sends it
    if (password !== undefined && password !== "") {
      existingUser.password = password;
    }

    const updatedUser = await existingUser.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await User.findOneAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
