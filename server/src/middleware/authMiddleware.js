// middleware/authJWT.js
import jwt from "jsonwebtoken";

const authJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = decoded.userId; // Attach user ID to request
    next();
  });
};

export default authJWT;
