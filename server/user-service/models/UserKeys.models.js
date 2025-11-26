import mongoose from "mongoose";

const UserKeys = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },

  // Permanent identity key (public)
  identityPublicKey: { type: String, required: true },

  // Permanent identity key (private, encrypted)
  identityPrivateKeyEncrypted: { type: String, required: true },

  // Signed pre-key pair
  signedPreKeyPublic: { type: String, required: true },
  signedPreKeyPrivateEncrypted: { type: String, required: true },
  signedPreKeySignature: { type: String, required: true },

  // One-time pre-keys (pool)
  oneTimePreKeys: [{
    publicKey: String,
    privateKeyEncrypted: String,
    used: { type: Boolean, default: false }
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserKeys" , UserKeys)
