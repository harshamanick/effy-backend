import express from "express";
import lodash from "lodash";
import {
  Companies,
  ValidateCompany,
  ValidateExisitingCompany,
} from "../models/companies.js";

const route = express.Router();

route.get("/details_by_id", async (req, res) => {
  const id = req.query.id;

  try {
    const result = await Companies.find({ _id: id });
    res.status(200).send(result);
    console.log("Result", result);
  } catch (err) {
    console.log("ERROR", err);
    res.send(500, err);
  }
});
route.post("/new_company", async (req, res) => {
  const { error } = ValidateCompany(req?.body);
  if (error) {
    return res.status(400).send(error);
  }
  try {
    const companyData = lodash.pick(req.body, [
      "company_name",
      "company_address_1",
      "company_address_2",
      "pincode",
    ]);
    const isExistingCompany = await Companies.findOne({
      company_name: companyData.company_name,
    });
    if (isExistingCompany) {
      return res.status(400).send("Company Name alreay exist");
    }

    const company = new Companies(companyData);
    const result = await company.save();
    const response = await Companies.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.delete("/delete_company", async (req, res) => {
  const companyId = req?.query?.id;
  try {
    const result = await Companies.findByIdAndRemove(companyId);
    const response = await Companies.find({});
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.put("/update_company", async (req, res) => {
  const { error } = ValidateExisitingCompany(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  try {
    const isCompaniesExist = await Companies.findOne({ _id: req?.body?._id });
    if (!isCompaniesExist) {
      return res.status(404).send("Companies not found");
    }

    const updatedCompany = await Companies.findOneAndUpdate(
      { _id: req?.body?._id },
      req.body,
      { new: true }
    );
    res.send(updatedCompany);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});
route.get("/get_all_companies", async (req, res) => {
  try {
    const companies = await Companies.find({});
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});
export const companies = route;
