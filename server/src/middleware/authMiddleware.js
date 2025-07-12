import jwt from "jsonwebtoken";
import User from "../model/User.js";

const authJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized - Invalid token", error: err.message });
  }
};

export default authJWT;
