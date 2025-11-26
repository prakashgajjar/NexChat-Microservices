import bcrypt from "bcryptjs";
// import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { generateKeyPairSync } from "crypto";
import redis from "../configs/redis.config.js";

export const verifyOtp = async (req, res) => {
  try {
    const { contact, otp, username, password } = req.body;

    // fetch otp from redis
    const storedOtp = await redis.get(`otp:${contact}`);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // generate key pair
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const privateKeyEncrypted = Buffer.from(privateKey).toString("base64");

    // create user
    const user = await User.create({
      email: contact,
      username,
      password: hash,
      publicKey,
      privateKeyEncrypted,
      verified: true,
    });

    // delete OTP from redis
    await redis.del(`otp:${contact}`);

    res.json({ message: "Signup complete", userId: user._id });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};