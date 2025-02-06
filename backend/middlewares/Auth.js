import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const userAuthCheck = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized, JWT token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized , Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, envConfig.general.APP_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is wrong or expired" });
  }
};

const adminAuthCheck = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized, JWT token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized , Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, envConfig.general.APP_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is wrong or expired" });
  }
};

export { userAuthCheck, adminAuthCheck };
