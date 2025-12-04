async function generateUniqueUsername(fullname) {
  // Convert fullname → basic username
  let base = fullname.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!base) base = "user"; // fallback

  let username = base;
  let counter = 1;

  // Check DB until username is unique
  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
}
