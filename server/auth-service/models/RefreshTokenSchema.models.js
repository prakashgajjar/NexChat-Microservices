import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // JWT ID
    jti: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // store hash instead of raw token
    tokenHash: {
      type: String,
      required: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    device: {
      type: String, 
    },

    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

// Auto-delete expired tokens
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
