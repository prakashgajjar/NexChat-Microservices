export async function encryptMessage(message, recipientPublicKey) {
  //Generate AES key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  //IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  //Encrypt message → cipherText
  const encoded = new TextEncoder().encode(message);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );
  const cipherText = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));

  // Wrap AES key using recipient public key
  const rawAes = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedKeyBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientPublicKey,
    rawAes
  );
  const encryptedKey = btoa(
    String.fromCharCode(...new Uint8Array(encryptedKeyBuffer))
  );

  return {
    cipherText,
    iv: btoa(String.fromCharCode(...iv)),
    encryptedKey
  };
}
