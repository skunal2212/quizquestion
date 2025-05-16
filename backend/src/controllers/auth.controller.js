const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials1" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Sign JWT token
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h", // optional: set token expiry
    });

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ where: { username } });
//     if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
