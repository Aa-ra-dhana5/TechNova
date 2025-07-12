import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
dotenv.config();

const genrateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires: Date.now() + 60 * 60 * 1000,
      cart: [],
    });

    await sendVerificationEmail(user.email, verificationToken);

    const token = genrateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Signup Successful. Plwase verify your email.",
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Email found", email);

    const user = await User.findOne({ email });
    // console.log("uer fround from DB", user);

    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({
        message: "Invalid email or password",
        debug: { userFound: false, email },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({
        message: "Invalid email or password",
        debug: { userFound: true, passwordMatch: false },
      });
    }

    if (!user.isVerified) {
      console.log("⚠️ Email not verified for:", email);
      return res.status(401).json({
        message: "Please verify your email first",
        debug: { emailVerified: false },
      });
    }

    const token = genrateToken(user._id);

    // ✅ Set token as HttpOnly cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // true only in production
    //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ⚠️ true only for HTTPS in production
      sameSite: "Lax", // avoid 'None' unless cross-origin
      maxAge: 24 * 60 * 60 * 1000,
    });

    // console.log("✅ Login successful:", email);

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("💥 Server error during login:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "invalid or Expired Token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.send(`<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;font-family:sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verified</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background-color:#f9fafb;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);overflow:hidden;">
            <tr>
              <td style="padding:40px 30px;text-align:center;">
                <h2 style="color:#10b981;font-size:24px;margin-bottom:15px;">✅ Email Verified Successfully!</h2>
                <p style="color:#333;font-size:16px;margin:0 0 25px;">
                  Your email has been verified. You can now log in to your account and start using our services.
                </p>
                <a href="${
                  process.env.NODE_AUTH_API_URL
                }/login" target="_blank" style="display:inline-block;background-color:#4F46E5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;margin-top:10px;">
                
                </a>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f3f4f6;padding:20px;text-align:center;font-size:13px;color:#999;">
                If you did not request this, please ignore this message.<br />
                &copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};
export const cartUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cart } = req.body;

    const sanitizedCart = cart
      .filter((item) => item.productId) // ⛔ skip if no productId
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
      }));

    await User.updateOne({ _id: userId }, { $set: { cart: sanitizedCart } });

    res.status(200).json({ message: "Cart updated", cart: sanitizedCart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.productId");
    // console.log("cart userid find", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsername = async (req, res) => {
  const user = await User.findById(req.params.id).select("name");
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};
