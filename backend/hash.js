const bcrypt = require("bcrypt");

const password = "steve123";

bcrypt.hash(password, 12, (err, hash) => {
  if (err) throw err;
  console.log("HASHED PASSWORD:", hash);
});
