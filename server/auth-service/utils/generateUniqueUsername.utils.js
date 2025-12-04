async function generateUniqueUsername(fullname) {
  let base = fullname.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base) base = "user";

  let username = base;
  let counter = 1;

  // Ensure username is unique in AuthUser collection
  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
}

export default generateUniqueUsername;
