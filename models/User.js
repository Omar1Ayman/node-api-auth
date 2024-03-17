const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = Schema(
  {
    username: {
      type: String,
      trim: true,
      minLengt: 3,
      maxLength: 100,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      minLengt: 5,
      maxLength: 100,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minLengt: 8,
      required: true,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
  }
});

UserSchema.methods.ComparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};

const User = mongoose.model("User", UserSchema);

const RegisterValidation = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    bio: Joi.string(),
    profilePhoto: Joi.string(),
    isAdmin: Joi.boolean().default(false),
    isAccountVerified: Joi.boolean().default(false),
  });
  return schema.validate(obj);
};

const LoginValidation = (obj) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(obj);
};

const UpdateValidation = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(100),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    bio: Joi.string(),
  });
  return schema.validate(obj);
};

const ResetPassworValidation = (obj) => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  RegisterValidation,
  LoginValidation,
  UpdateValidation,
  ResetPassworValidation,
};
