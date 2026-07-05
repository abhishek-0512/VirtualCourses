import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User is already exist" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email" });
    }
    if(password.length < 8){
      return res.status(400).json({message:"Enter Strong password"})
    }
    let hashPassword=await bcrypt.hash(password,10)
    const user=await User.create({
      name,
      email,
      password:hashPassword,
      role
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};