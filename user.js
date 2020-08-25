const router = require("express").Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    if (!email || !password || !passwordCheck)
      return res
        .status(400)
        .json({ msg: "Not all fields have been Entered.." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be atleast 8 characters long.." });
    if (password !== passwordCheck)
      return res.status(400).json({ msg: "Enter same password twice.." });
    if (!displayName) displayName = email;
    const ExistingUser = await User.findOne({ email: email });
    if (ExistingUser)
      return res
        .status(400)
        .json({ msg: "Account with this email already exists" });
    const salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(password, salt);
    //SEttig Up Json Web Token
    const NewUser = new User({
      email,
      displayName,
      password: PasswordHash,
    });
    const savedUser = await NewUser.save();
    res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      res.status(400).json({ msg: "Enter all Fields.." });
    const user = await User.findOne({ email: email });
    if (!user)
      res.status(404).json({ msg: "Account with this email not found.." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ msg: "Invalid Login Credentials.." });
    //Setting Up JWT
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    return res.json(deletedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/isLoggedIn", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    } else {
      return res.json(true);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.post("/isTokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
