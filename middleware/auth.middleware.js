import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwtUtils.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing Token" });
  }
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
  const user = await User.findById(userId);
  if (!user.isVerified) {
    return res.status(401).json({ message: "Email not Verified" });
  }
  req.userId = userId;
  next();
};

// export const authenticateEmail = async (req, res, next) => {
    
//   next();
// };
