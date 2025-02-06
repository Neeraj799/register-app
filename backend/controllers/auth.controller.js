import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import {
  userLoginValidation,
  userSignUpValidation,
} from "../helpers/authValidation.js";

const register = async (req, res) => {
  try {
    const { error } = userSignUpValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(403).json({ error: error.details });
    }
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const error = {
        details: [
          {
            message: "User already registered here",
            type: "any.unique",
            context: {
              label: "email",
              key: "email",
            },
          },
        ],
      };
      return res.status(403).json({ error: error.details[0] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error } = userLoginValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(403).json({ error: error.details });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(403).json({ message: "Invalid creadentials" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      envConfig.general.APP_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User login successfully",
      success: true,
      token,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find({}).sort({ createdAt: -1 });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { register, login, getUser };
