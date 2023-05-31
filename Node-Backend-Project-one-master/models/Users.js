import Joi from "joi";
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  company_id: String,
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  designation: String,
  dob: {
    type: String,
  },
  is_active: Boolean,
});
export const User = mongoose.model("user", schema);

export const ValidateUser = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    dob: Joi.string().required(),
    designation: Joi.string().required(),
    is_active: Joi.boolean().required(),
    company_id: Joi.string().required(),
    migrate_id: Joi.string().optional(),
  });

  return schema.validate(data);
};
export const validateExsistingUser = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.string().required(),
    designation: Joi.string().required(),
    is_active: Joi.boolean().required(),
    company_id: Joi.string().required(),
    _id: Joi.string().required(),
    migrate_id: Joi.string().optional(),
  });

  return schema.validate(data);
};
