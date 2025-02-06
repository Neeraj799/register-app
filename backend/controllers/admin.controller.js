import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import envConfig from "../config/envConfig.js";
dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, envConfig.general.APP_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Login successful", token });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { adminLogin };
