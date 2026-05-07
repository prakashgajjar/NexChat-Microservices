// DUMMY ENCRYPTION - Just encode the message in base64
export async function encryptMessage(message) {
  // Dummy implementation - just base64 encode the message
  const cipherText = btoa(message);
  const iv = "dummyIV123456789";
  const encryptedKey = "dummyEncryptedKey";

  return {
    cipherText,
    iv: btoa(iv),
    encryptedKey
  };
}

