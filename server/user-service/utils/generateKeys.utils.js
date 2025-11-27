import crypto from "crypto";

//convert private key to base64
const encodePrivate = (key) => Buffer.from(key).toString("base64");

// Generate a normal RSA key pair
function generateKeyPair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

// Identity key (permanent)
function generateIdentityKeyPair() {
  const { publicKey, privateKey } = generateKeyPair();

  return {
    identityPublicKey: publicKey,
    identityPrivateKeyEncrypted: encodePrivate(privateKey),
  };
}

// Signed pre-key 
function generateSignedPreKey(identityPrivateKeyDecrypted) {
  const { publicKey, privateKey } = generateKeyPair();

  const signature = crypto.sign(
    "sha256",
    Buffer.from(publicKey),
    identityPrivateKeyDecrypted
  );

  return {
    signedPreKeyPublic: publicKey,
    signedPreKeyPrivateEncrypted: encodePrivate(privateKey),
    signedPreKeySignature: signature.toString("base64"),
  };
}

// One-time pre-keys
function generateOneTimePreKeys(count = 20) {
  const keys = [];

  for (let i = 0; i < count; i++) {
    const { publicKey, privateKey } = generateKeyPair();

    keys.push({
      publicKey,
      privateKeyEncrypted: encodePrivate(privateKey),
      used: false,
    });
  }

  return keys;
}

// generate all keys for one user // main functions //start here
export function generateAllKeys(userId) {
  // Identity
  const identity = generateIdentityKeyPair();

  // Decode the private identity key so we can sign the pre-key
  const identityPrivateKey = Buffer.from(
    identity.identityPrivateKeyEncrypted,
    "base64"
  ).toString();

  // Signed pre-key
  const signedPreKey = generateSignedPreKey(identityPrivateKey);

  // One-time pre-keys
  const oneTimePreKeys = generateOneTimePreKeys(20);

  return {
    userId,
    identityPublicKey: identity.identityPublicKey,
    identityPrivateKeyEncrypted: identity.identityPrivateKeyEncrypted,

    signedPreKeyPublic: signedPreKey.signedPreKeyPublic,
    signedPreKeyPrivateEncrypted: signedPreKey.signedPreKeyPrivateEncrypted,
    signedPreKeySignature: signedPreKey.signedPreKeySignature,

    oneTimePreKeys,
  };
}
