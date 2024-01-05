

const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Error messages
const signUpErrorMessage = "Unable to sign up. Please try again later.";
const loginErrorMessage = "Unable to log in. Please try again later.";
const genericErrorMessage = "Something went wrong. Please try again later.";

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Secure password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: signUpErrorMessage,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill in the required details",
      });
    }

    // Check for a registered user
    const user = await User.findOne({ email });

    // If not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not a registered user",
      });
    }

    // Verify password and generate JWT token
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Password match
      const payload = {
        email: user.email,
        id: user._id,
      };

      // Generate JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d", // Set to 1 day, for example
      });

      // Omit password from the user object
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      // Set HTTP-only cookie with the token
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: userWithoutPassword,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: loginErrorMessage,
    });
  }
};
