// DUMMY DECRYPTION - Just return the cipherText as is
export async function decryptMessage({
  cipherText,
  iv,
  encryptedKey,
  privateKeyPem,
}) {
  // Dummy implementation - returns cipherText decoded from base64
  try {
    return atob(cipherText);
  } catch (err) {
    return "[Dummy decrypted message]";
  }
}
