import express from "express";
import { Users } from "../../models/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginValidation,
  signupValidation,
} from "../../validation/auth.validation.js";

const authRouter = express.Router();

// Function to generate JWT
function generateToken(user) {
  const { _id, phoneNumber, email, name } = user;

  return jwt.sign({ id: _id, phoneNumber, email, name }, "jdhgcjsojwh", {
    expiresIn: "6d",
  });
}

// To create a user

authRouter.post("/signup", async (req, res) => {
  try {
    const { error } = signupValidation(req.body);

    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return res.status(400).send({ message: error.message });
    }
    const { name, email, password, phoneNumber } = req.body;
    const existUser = await Users.findOne({ email: email });
    if (existUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Login instead!" });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    //add salt in db
    const newUser = new Users({
      email,
      phoneNumber,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// To login a user

authRouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req?.body ?? {};

    const { error } = loginValidation(req?.body);
    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return res.status(400).send({ message: error.message });
    }

    // Find the user in the database
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT and send it in the response
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Please try again later" });
  }
});

export default authRouter;
