const AllUser = require("../model/UserModel");
const Course = require("../model/CourseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // for pwd hashing

//Register API

const registerAPI = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Pls Enter All Fields" });
  }
  try {
    const existingUser = await AllUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User account already exist" });
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new AllUser({ username, email, password: hashedPwd, role });
    await newUser.save();
    res.status(201).json({ message: "Registration success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginAPI = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await AllUser.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User account not found,Please register" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json("Password missmatch");
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login Success", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerAPI, loginAPI };
