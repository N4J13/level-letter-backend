import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, "nimimylife");
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "nimimylife");
    return decoded.userId;
  } catch (error) {
    return null;
  }
};
