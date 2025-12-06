export async function generateUsername(fullName) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  let base = "";

  if (parts.length >= 3) {
    // full name with middle name → use middle name
    base = parts[1].toLowerCase();
  } else {
    // no middle name → use first name
    base = parts[0].toLowerCase();
  }

  // Generate 5–6 random digits
  const randomNumbers = Math.floor(10000 + Math.random() * 900000); 
  // ensures 5–6 digits always

  return base + randomNumbers;
}
