import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import db from "@/lib/db";
import User from "@/models/User";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return signUp(req, res);
  }
}

const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, lastname, email, password } = req.body;
  if (
    !name ||
    !lastname ||   
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }
  try {
    await db.connect();
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: "User already exists" });
      await db.disconnect();
      return;
    }

    const newUser = new User({
      name,
      lastname,
      email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
    });
    const user = await newUser.save();
    await db.disconnect();
    res.status(201).json({
      message: "User created successfully",
      _id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export default handler