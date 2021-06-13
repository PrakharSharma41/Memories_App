import bcrypt from "bcryptjs";// bcrypt is used to hash the password
import jwt from "jsonwebtoken";// used to store user in browser for a period of time

import User from "../models/user.js";



export const signin = async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.SECRET;
  try {
    const oldUser = await User.findOne({ email });// searching existing user wth his/her email when signing in

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });// if on sign in we dont find user with that email then send error

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);// use bcrypt to check hashed password

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });// in sign function we provide all information we want to store in token

    res.status(200).json({ result: oldUser, token });// returning the user
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const secret = process.env.SECRET;
  try {
    const oldUser = await UserModal.findOne({ email });// searching existing user wth his/her email when signing in

    if (oldUser) return res.status(400).json({ message: "User already exists" });// if on sign in we dont find user with that email then send error

    const hashedPassword = await bcrypt.hash(password, 12);// 12 is salt

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );// in sign function we provide all information we want to store in token
    res.status(201).json({ result, token });// returning the user
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
