import mongoose from "mongoose";
import Joi from "joi";

const schema = new mongoose.Schema({
  company_name: {
    type: String,
    unique: true,
    required: true,
  },
  company_address_1: {
    type: String,
    required: true,
  },
  company_address_2: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});
export const ValidateCompany = (data) => {
  const schema = Joi.object({
    company_name: Joi.string().required(),
    company_address_1: Joi.string().required(),
    company_address_2: Joi.string().required(),
    pincode: Joi.string().required(),
  });

  return schema.validate(data);
};
export const ValidateExisitingCompany = (data) => {
  const schema = Joi.object({
    company_name: Joi.string().required(),
    company_address_1: Joi.string().required(),
    company_address_2: Joi.string().required(),
    pincode: Joi.string().required(),
    _id: Joi.string().required(),
  });

  return schema.validate(data);
};
export const Companies = mongoose.model("companies", schema);
