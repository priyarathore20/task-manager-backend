import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../utils.js";

export const authChecker = async (req, res, next) => {
  const token = req?.headers?.authorization?.replace("Bearer ", "");
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    console.log(decoded);
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded; // Set decoded user information on request object
    next();
  });
};
