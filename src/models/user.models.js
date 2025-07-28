const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [5, "Email must be at least 5 characters"],
      maxlength: [40, "Email must be at most 40 characters"],
      validate: {
        validator: (email) => validator.isEmail(email),
        // validator: function(email){
        //     return validator.isEmail(email)
        // }
        message: "Please Enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "Password must be at least 5 characters"],
      select: false,  // Exclude password by default 
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

//! Password Encryption

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Check if password is modified if not, skip hashing
    return next();
  }

  let salt = await bcryptjs.genSalt(12);
  let hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

//! Compare the password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcryptjs.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
